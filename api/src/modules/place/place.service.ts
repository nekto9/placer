import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StaticPath } from '@/config/static.config';
import { PrismaService } from '@/database/prisma.service';
import { CalendarRepeatMode, WorkTimeMode } from '@/prismaClient';
import { dateToString, getDateParams, stringToDate } from '@/tools/dateUtils';
import dayjs from '@/tools/dayjs';
import { mapGameToResponseDto } from '../game/mappers';
import { UserService } from '../user/user.service';
import { CreatePlaceDto, UpdatePlaceDto, UpdateScheduleRankDto } from './dto';
import { GridDayResponseDto } from './dto/schedule/gridDayResponse.dto';
import {
  mapGridSlotsToDto,
  mapPlaceToResponseDto,
  mapSchedulesToShortDto,
} from './mappers';
import {
  mapCreatePlaceDtoToPrismaInput,
  mapUpdatePlaceDtoToPrismaInput,
} from './mappers/query.mapper';
import { splitTimeInterval } from './utils/splitTimeInterval';

@Injectable()
export class PlaceService {
  // constructor(private repository: PlaceRepository) {}
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private configService: ConfigService
  ) {}

  /** Путь до файлов с обложками */
  private getCoverPath() {
    return `${this.configService.get<string>('API_HOST')}/${StaticPath.COVER}`;
  }

  /**
   * Создает новую площадку на основе переданных данных.
   */
  async createPlace(
    createPlaceDto: CreatePlaceDto,
    requesterSub?: string,
    requestRoles?: string[]
  ) {
    const currenRequestUser = await this.userService.getUser({ requesterSub });

    const createPlaceData = mapCreatePlaceDtoToPrismaInput(
      createPlaceDto,
      currenRequestUser
    );
    const createdPlace = await this.prisma.place.create({
      data: createPlaceData,
      include: {
        covers: true,
        sports: {
          include: {
            sport: true,
          },
        },
        city: true,
      },
    });

    return mapPlaceToResponseDto(
      createdPlace,
      this.getCoverPath(),
      currenRequestUser,
      requestRoles
    );
  }

  /** Список площадок */
  async getPlaces(page = 1, limit = 10, requesterSub?: string) {
    const currenRequestUser = await this.userService.getUser({ requesterSub });
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.place.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          favoritedUsers: !!currenRequestUser,
          covers: true,
          sports: {
            include: {
              sport: true,
            },
          },
          city: true,
        },
      }),
      this.prisma.place.count(),
    ]);

    return {
      items: items.map((place) =>
        mapPlaceToResponseDto(place, this.getCoverPath(), currenRequestUser)
      ),
      total,
    };
  }

  /** Получение площадки по id */
  async getPlaceById(
    id: string,
    requesterSub?: string,
    requestRoles?: string[]
  ) {
    const currenRequestUser = await this.userService.getUser({ requesterSub });
    const place = await this.prisma.place.findUnique({
      where: { id },
      include: {
        favoritedUsers: !!currenRequestUser,
        covers: true,
        sports: {
          include: {
            sport: true,
          },
        },
        city: true,
      },
    });

    return mapPlaceToResponseDto(
      place,
      this.getCoverPath(),
      currenRequestUser,
      requestRoles
    );
  }

  /** Обновление площадки */
  async updatePlace(
    id: string,
    dto: UpdatePlaceDto,
    requesterSub?: string,
    requestRoles?: string[]
  ) {
    const currentRequestUser = await this.userService.getUser({ requesterSub });

    const updatedPlace = await this.prisma.$transaction(async (tx) => {
      // 1. Получаем текущие связи с видами спорта
      const currentSports = await tx.placeSport.findMany({
        where: { placeId: id },
        select: { sportId: true },
      });

      const currentSportIds = currentSports.map((s) => s.sportId);

      // 2. Определяем что добавить, что удалить
      const sportsToAdd = dto.sports.filter(
        (id) => !currentSportIds.includes(id)
      );
      const sportsToRemove = currentSportIds.filter(
        (id) => !dto.sports.includes(id)
      );

      // 3. Удаляем ненужные связи
      if (sportsToRemove.length > 0) {
        await tx.placeSport.deleteMany({
          where: {
            placeId: id,
            sportId: { in: sportsToRemove },
          },
        });
      }

      // 4. Добавляем новые связи
      if (sportsToAdd.length > 0) {
        await tx.placeSport.createMany({
          data: sportsToAdd.map((sportId) => ({
            sportId: sportId,
            placeId: id,
          })),
        });
      }

      // Аналогично с фотографиями
      // 1. Получаем текущие связи
      const currentCovers = await tx.placeCovers.findMany({
        where: { placeId: id },
        select: { id: true },
      });

      const currentCoversIds = currentCovers.map((s) => s.id);

      // 2. Определяем что добавить, что удалить
      const coversToAdd = dto.covers.filter(
        (id) => !currentCoversIds.includes(id)
      );
      const coversToRemove = currentCoversIds.filter(
        (id) => !dto.covers.includes(id)
      );

      // 3. Удаляем ненужные связи
      if (coversToRemove.length > 0) {
        await tx.placeCovers.deleteMany({
          where: {
            placeId: id,
            id: { in: coversToRemove },
          },
        });
      }

      // TODO: Добавить в bullMQ таску на удалене самих файлов

      // 4. Добавляем новые связи
      if (coversToAdd.length > 0) {
        await tx.placeCovers.createMany({
          data: coversToAdd.map((coverId) => ({
            id: coverId,
            placeId: id,
          })),
        });
      }

      const updatePlaceData = mapUpdatePlaceDtoToPrismaInput(dto);

      // 5. Обновляем Place
      const result = await tx.place.update({
        where: { id },
        data: updatePlaceData,
        include: {
          favoritedUsers: !!currentRequestUser,
          covers: true,
          sports: {
            include: {
              sport: true,
            },
          },
          city: true,
        },
      });

      return result;
    });

    return mapPlaceToResponseDto(
      updatedPlace,
      this.getCoverPath(),
      currentRequestUser,
      requestRoles
    );
  }

  /** Удаление площадки */
  async deletePlace(
    id: string,
    requesterSub?: string,
    requestRoles?: string[]
  ) {
    const currenRequestUser = await this.userService.getUser({ requesterSub });
    const deletedPlace = await this.prisma.place.delete({ where: { id } });

    // TODO: удаление обложек
    return mapPlaceToResponseDto(
      deletedPlace,
      this.getCoverPath(),
      currenRequestUser,
      requestRoles
    );
  }

  /** Список расписаний площадки */
  async getPlaceSchedules(id: string) {
    const schedules = await this.prisma.place
      .findUnique({
        where: { id },
      })
      .schedules({
        orderBy: {
          rank: 'asc',
        },
      });

    return mapSchedulesToShortDto(schedules);
  }

  /** Обновление приоритетов расписаний площадки */
  async updateRankPlaceSchedules(
    id: string,
    schedules: UpdateScheduleRankDto[]
  ) {
    const updatedSchedules = await this.prisma.place.update({
      where: { id },
      data: {
        schedules: {
          update: schedules.map((el) => ({
            where: {
              id: el.id,
            },
            data: {
              rank: el.rank,
            },
          })),
        },
      },
      include: {
        schedules: true,
      },
    });

    return mapSchedulesToShortDto(updatedSchedules.schedules);
  }

  /** Список слотов площадки для диапазона дат */
  async getPlaceSlots(
    placeId: string,
    startDateInput: string,
    stopDateInput: string
    // requesterSub?: string
  ) {
    // TODO: на основе юзера нужно доделать права
    // const currenRequestUser = await this.userService.getUser({ requesterSub });
    // console.log(currenRequestUser);

    const startDate = stringToDate(startDateInput);
    const stopDate = stringToDate(stopDateInput);

    const days: GridDayResponseDto[] = [];

    // 0. Выбираем забронированные слоты на данный период
    const bookedGames = await this.prisma.game.findMany({
      where: {
        placeId,
        date: { gte: startDate, lte: stopDate },
      },
      include: {
        place: true,
      },
    });

    // 1. Выбираем все расписания для площадки, у которых даты ограничений попадают в диапазон
    const schedules = await this.prisma.schedule.findMany({
      where: {
        placeId,
        OR: [
          {
            startDate: { lte: stopDate },
            stopDate: { gte: startDate },
          },
          {
            startDate: null,
            stopDate: { gte: startDate },
          },
          {
            startDate: { lte: stopDate },
            stopDate: null,
          },
          {
            startDate: null,
            stopDate: null,
          },
        ],
      },
      include: {
        timeSlots: true,
      },
      orderBy: {
        rank: 'asc',
      },
    });

    // дата при переборе диапазона
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      const currentDateString = dateToString(currentDate);

      const currentDateDayjs = dayjs(currentDate);

      const currentDateParams = getDateParams(currentDateDayjs);

      const dayGames = bookedGames
        .filter((game) => dateToString(game.date) === currentDateString)
        .map((game) => mapGameToResponseDto(game));

      // // День недели (1 - понедельник, 7 - воскресенье)
      // const weekDay = dateDay.isoWeekday();
      // // Число месяца
      // const monthDay = dateDay.date();
      // // Флаг последнего дня месяца
      // const isLastMonthDay = dateDay.daysInMonth() === monthDay;
      // // Номер недели в месяце
      // // const monthWeek = dateDay.isoWeek;

      // 2. Выбираем календарные расписания подходящие для даты
      schedules.forEach((schedule) => {
        // если на выбранную дату уже есть расписание, то идем дальше
        if (days.some((o) => o.date === currentDateString)) {
          return;
        }

        // если дата не подходит для диапазона конкретного рсписания
        if (
          (schedule.stopDate &&
            currentDate.getTime() > schedule.stopDate.getTime()) ||
          (schedule.startDate &&
            currentDate.getTime() < schedule.startDate.getTime())
        ) {
          return;
        }

        const setGridDataForDay = () => {
          const { id, timeSlots, name } = schedule;
          days.push({
            date: currentDateString,
            workTimeMode: schedule.workTimeMode,
            id,
            timeSlots,
            scheduleName: name,
            games: dayGames,
          });
        };

        const checkSplitSlots = () => {
          if (
            schedule.workTimeMode === WorkTimeMode.CUSTOM &&
            dayGames.length
          ) {
            const workingTime = schedule.timeSlots[0];
            schedule.timeSlots = splitTimeInterval(
              workingTime,
              dayGames,
              schedule
            ).map((slot) => ({
              ...workingTime,
              timeStart: slot.timeStart,
              timeEnd: slot.timeEnd,
            }));
            // console.log('custom', {
            //   currentDateString,
            //   ts: schedule,
            //   dayGames,
            //   spl: splitTimeInterval(workingTime, dayGames, schedule),
            // });
          }
        };

        if (
          // Однократное событие
          schedule.repeatMode === CalendarRepeatMode.ONCE &&
          schedule.startDate.getTime() === currentDate.getTime()
        ) {
          checkSplitSlots();
          setGridDataForDay();
        } else if (
          // Ежедневное
          schedule.repeatMode === CalendarRepeatMode.DAILY &&
          (schedule.startDate === null ||
            schedule.repeatStep === 1 ||
            currentDateDayjs.diff(dayjs(schedule.startDate), 'day') %
              schedule.repeatStep ===
              0)
        ) {
          checkSplitSlots();
          setGridDataForDay();
        } else if (
          // Еженедельное
          schedule.repeatMode === CalendarRepeatMode.WEEKLY &&
          (schedule[`wd${currentDateParams.weekDay}`] ||
            Array.from(Array(7).keys()).every((i) => !schedule[`wd${i + 1}`]))
        ) {
          checkSplitSlots();
          setGridDataForDay();
        } else if (
          // По календарным дням
          schedule.repeatMode === CalendarRepeatMode.CALENDDAYS &&
          (schedule[`d${currentDateParams.monthDay}`] ||
            (currentDateParams.isLastMonthDay && schedule.dLast))
        ) {
          checkSplitSlots();
          setGridDataForDay();
        } else if (
          // По дням недели
          schedule.repeatMode === CalendarRepeatMode.WEEKDAYS &&
          (schedule[`wd${currentDateParams.weekDay}`] ||
            Array.from(Array(7).keys()).every((i) => !schedule[`wd${i + 1}`]))
        ) {
          checkSplitSlots();
          setGridDataForDay();
        }
      });

      currentDate = currentDateDayjs.add(1, 'day').toDate();
    }

    return mapGridSlotsToDto({
      startDate: startDateInput,
      stopDate: stopDateInput,
      days,
    });
  }

  /**
   * Добавление площадки в избранное
   */
  async addPlaceToFavorites(
    favoriteId: string,
    requesterSub: string,
    requestRoles?: string[]
  ) {
    const currentRequestUser = await this.userService.getUser({ requesterSub });

    // Добавляем в избранное (если уже есть, то ничего не произойдет из-за unique constraint)
    try {
      await this.prisma.placeFavorite.create({
        data: {
          userId: currentRequestUser.id,
          placeId: favoriteId,
        },
      });
    } catch (error) {
      // Если запись уже существует, игнорируем ошибку
      if (error.code !== 'P2002') {
        throw error;
      }
    }

    // Получаем информацию о площадке, которую добавили из избранного
    const favoritePlace = await this.prisma.place.findUnique({
      where: { id: favoriteId },
      include: {
        favoritedUsers: !!currentRequestUser,
        covers: true,
        sports: {
          include: {
            sport: true,
          },
        },
        city: true,
      },
    });

    if (!favoritePlace) {
      return null;
    }

    // Возвращаем информацию о добавленной площадке
    return mapPlaceToResponseDto(
      favoritePlace,
      this.getCoverPath(),
      currentRequestUser,
      requestRoles
    );
  }

  /**
   * Удаление площадки из избранного
   */
  async removePlaceFromFavorites(
    favoriteId: string,
    requesterSub: string,
    requestRoles?: string[]
  ) {
    const currentRequestUser = await this.userService.getUser({ requesterSub });

    const deleted = await this.prisma.placeFavorite.deleteMany({
      where: {
        userId: currentRequestUser.id,
        placeId: favoriteId,
      },
    });

    if (deleted.count === 0) {
      return null;
    }

    // Получаем информацию о площадке, которую удаляем из избранного
    const favoritePlace = await this.prisma.place.findUnique({
      where: { id: favoriteId },
      include: {
        favoritedUsers: !!currentRequestUser,
        covers: true,
        sports: {
          include: {
            sport: true,
          },
        },
        city: true,
      },
    });

    if (!favoritePlace) {
      return null;
    }

    // Возвращаем информацию об удаленной площадке
    return mapPlaceToResponseDto(
      favoritePlace,
      this.getCoverPath(),
      currentRequestUser,
      requestRoles
    );
  }

  /**
   * Получение списка избранных площадок
   *
   * Возвращает список всех площадок, добавленных в избранное текущим пользователем.
   */
  async getPlaceFavorites(
    text: string,
    page: number,
    limit: number,
    requesterSub?: string
  ) {
    const currenRequestUser = await this.userService.getUser({ requesterSub });

    const skip = (page - 1) * limit;

    // Построение условий поиска
    const searchCondition = text
      ? { name: { contains: text, mode: 'insensitive' as const } }
      : undefined;

    // Использование транзакции для атомарного получения данных и подсчета
    const [items, total] = await this.prisma.$transaction([
      // Получение площадок с пагинацией
      this.prisma.placeFavorite.findMany({
        where: {
          place: searchCondition,
          userId: currenRequestUser.id,
        },
        include: {
          place: {
            include: {
              favoritedUsers: true,
              covers: true,
              sports: {
                include: {
                  sport: true,
                },
              },
              city: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // Сортировка по дате создания (новые первыми)
      }),
      // Подсчет общего количества пользователей
      this.prisma.placeFavorite.count({
        where: {
          place: searchCondition,
          userId: currenRequestUser.id,
        },
      }),
    ]);

    return {
      items: items.map((favorite) =>
        mapPlaceToResponseDto(
          favorite.place,
          this.getCoverPath(),
          currenRequestUser
        )
      ),
      total,
    };
  }

  /** Обовление обложек */
  async updateCover(coverIds: string[], placeId: string, requesterSub: string) {
    const currenRequestUser = await this.userService.getUser({ requesterSub });

    const updatedPlace = await this.prisma.place.update({
      where: {
        id: placeId,
      },
      data: {
        covers: {
          createMany: {
            data: coverIds.map((coverId, coverIndex) => ({
              id: coverId,
              order: coverIndex,
            })),
          },
        },
      },
      include: { favoritedUsers: !!currenRequestUser, covers: true },
    });

    return mapPlaceToResponseDto(
      updatedPlace,
      this.getCoverPath(),
      currenRequestUser
    );
  }
}
