import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { GameGateway } from "@/gateway/game.gateway";
import {
  $Enums,
  GameLevel,
  GameStatus,
  GameTimeFrame,
  GameUserStatus,
  WorkTimeMode,
} from "@/prismaClient";
import { GameQueueService } from "@/queue/game/gameQueue.service";
import {
  dateToString,
  getTimeFromDateInMunutes,
  stringToDate,
} from "@/tools/dateUtils";
import {
  isScheduleActive,
  isScheduleAppliedToDate,
} from "@/tools/scheduleUtils";
import { splitTimeInterval } from "../place/utils/splitTimeInterval";
import { UserService } from "../user/user.service";
import { CreateGameDto, ExtendReservationDto, UpdateGameDto } from "./dto";
import {
  mapCreateGameDtoToPrismaInput,
  mapGameToResponseDto,
  mapUpdateGameDtoToPrismaInput,
} from "./mappers";

/**
 * Сервис для управления играми
 */
@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => GameQueueService))
    private gameQueueService: GameQueueService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private gameGateway: GameGateway
  ) {}

  /**
   * Создание игры на основе существующего временного слота
   *
   * Создает новую игру, используя предопределенный временной слот площадки.
   * Автоматически копирует время начала и окончания из слота, устанавливает
   * статус DRAFT и назначает создателя игры. После создания добавляет задачу
   * в очередь для автоматической проверки и удаления неактивных игр.
   */
  async createGameForSlot(
    placeId: string,
    slotId: string,
    dateInput: string,
    requesterSub: string
  ) {
    const gameDate = stringToDate(dateInput);

    // Получаем данные временного слота
    const timeSlot = await this.prisma.timeSlot.findUnique({
      where: { id: slotId },
      include: {
        schedule: true,
      },
    });

    if (!timeSlot) {
      throw new Error(`Временной слот с id ${slotId} не найден`);
    }

    if (
      timeSlot.schedule.placeId !== placeId ||
      timeSlot.schedule.workTimeMode !== WorkTimeMode.TIMEGRID ||
      !isScheduleActive(timeSlot.schedule) ||
      !isScheduleAppliedToDate(timeSlot.schedule, gameDate)
    ) {
      throw new Error("Выбранный слот недоступен для указанной даты");
    }

    const user = await this.userService.getUser({
      requesterSub,
    });

    if (!user) {
      throw new Error(`Пользователь с keycloak id ${requesterSub} не найден`);
    }

    // Проверяем, нет ли пересечений с существующими играми/бронированиями
    const hasConflict = await this.prisma.game.findFirst({
      where: {
        placeId,
        date: gameDate,
        status: {
          in: [GameStatus.DRAFT, GameStatus.APROVED],
        },
        OR: [
          {
            AND: [
              { timeStart: { lte: timeSlot.timeStart } },
              { timeEnd: { gt: timeSlot.timeStart } },
            ],
          },
          {
            AND: [
              { timeStart: { lt: timeSlot.timeEnd } },
              { timeEnd: { gte: timeSlot.timeEnd } },
            ],
          },
          {
            AND: [
              { timeStart: { gte: timeSlot.timeStart } },
              { timeEnd: { lte: timeSlot.timeEnd } },
            ],
          },
        ],
      },
    });

    if (hasConflict) {
      throw new Error("Выбранный слот уже забронирован или занят");
    }

    // Подготавливаем данные для создания игры
    const createGameDto = mapCreateGameDtoToPrismaInput(placeId, {
      date: dateInput,
      status: GameStatus.DRAFT,
      timeEnd: timeSlot.timeEnd,
      timeStart: timeSlot.timeStart,
      createUserId: user.id,
      level: GameLevel.EASY,
      countMembersMax: 0,
      countMembersMin: 0,
    });

    // Создаем игру в базе данных
    const createdGame = await this.prisma.game.create({
      data: createGameDto,
      include: {
        place: true,
        users: { include: { user: true } },
      },
    });

    // Добавляем задачу на автоматическое удаление через TTL (из env)
    const ttlMinutes = process.env.GAME_RESERVATION_TTL_MINUTES
      ? parseInt(process.env.GAME_RESERVATION_TTL_MINUTES, 10)
      : 15;

    await this.gameQueueService.scheduleReservationCancel(
      createdGame.id,
      ttlMinutes
    );

    // Отправляем WebSocket событие о бронировании
    this.gameGateway.sendGameReserved(placeId, {
      gameId: createdGame.id,
      date: dateInput,
      timeStart: timeSlot.timeStart,
      timeEnd: timeSlot.timeEnd,
    });

    return mapGameToResponseDto(createdGame, user);
  }

  /**
   * Создание игры с кастомным временным интервалом
   *
   * Создает новую игру с произвольным временем начала и окончания,
   * не привязанную к существующим временным слотам площадки.
   * Позволяет создавать игры в любое время в рамках рабочих часов площадки.
   */
  async createGameForCustomSlot(
    placeId: string,
    requesterSub: string,
    dto: CreateGameDto
  ) {
    const gameDate = stringToDate(dto.date);

    const user = await this.userService.getUser({
      requesterSub,
    });

    if (!user) {
      throw new Error(`Пользователь с keycloak id ${requesterSub} не найден`);
    }

    const schedules = await this.prisma.schedule.findMany({
      where: {
        placeId,
        OR: [
          {
            startDate: { lte: gameDate },
            stopDate: { gte: gameDate },
          },
          {
            startDate: null,
            stopDate: { gte: gameDate },
          },
          {
            startDate: { lte: gameDate },
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
        rank: "asc",
      },
    });

    const matchedSchedule = schedules
      .filter(isScheduleActive)
      .find((schedule) => isScheduleAppliedToDate(schedule, gameDate));

    if (
      !matchedSchedule ||
      matchedSchedule.workTimeMode !== WorkTimeMode.CUSTOM
    ) {
      throw new Error("Выбранный слот недоступен для указанной даты");
    }

    if (dto.timeStart >= dto.timeEnd) {
      throw new Error("Некорректный временной диапазон");
    }

    const startMinuteInHour = ((dto.timeStart % 60) + 60) % 60;
    const allowedStartMinute =
      (((matchedSchedule.timeStart ?? 0) % 60) + 60) % 60;

    if (startMinuteInHour !== allowedStartMinute) {
      throw new Error("Время начала не соответствует правилам расписания");
    }

    const bookedGames = await this.prisma.game.findMany({
      where: {
        placeId,
        date: gameDate,
        status: {
          in: [GameStatus.DRAFT, GameStatus.APROVED],
        },
      },
      select: {
        id: true,
        timeStart: true,
        timeEnd: true,
      },
    });

    const hasConflict = bookedGames.some(
      (game) => game.timeStart < dto.timeEnd && game.timeEnd > dto.timeStart
    );

    if (hasConflict) {
      throw new Error("Выбранный слот уже забронирован или занят");
    }

    const availableTimeRanges = matchedSchedule.timeSlots.flatMap(
      (workingTime) => {
        const overlappingGames = bookedGames.filter(
          (game) =>
            game.timeStart < workingTime.timeEnd &&
            game.timeEnd > workingTime.timeStart
        );

        return splitTimeInterval(
          workingTime,
          overlappingGames,
          matchedSchedule
        );
      }
    );

    const isWithinAvailableRange = availableTimeRanges.some(
      (timeRange) =>
        dto.timeStart >= timeRange.timeStart && dto.timeEnd <= timeRange.timeEnd
    );

    if (!isWithinAvailableRange) {
      throw new Error("Выбранный слот недоступен для указанной даты");
    }

    // Подготавливаем данные для создания игры с кастомным временем
    const createGameDto = mapCreateGameDtoToPrismaInput(placeId, {
      ...dto,
      createUserId: user.id,
    });

    // Создаем игру в базе данных
    const createdGame = await this.prisma.game.create({
      data: createGameDto,
      include: { place: true, sport: true, users: { include: { user: true } } },
    });

    // Добавляем задачу на автоматическое удаление через TTL (из env)
    const ttlMinutes = process.env.GAME_RESERVATION_TTL_MINUTES
      ? parseInt(process.env.GAME_RESERVATION_TTL_MINUTES, 10)
      : 15;

    await this.gameQueueService.scheduleReservationCancel(
      createdGame.id,
      ttlMinutes
    );

    // Отправляем WebSocket событие о бронировании
    this.gameGateway.sendGameReserved(placeId, {
      gameId: createdGame.id,
      date: dto.date,
      timeStart: dto.timeStart,
      timeEnd: dto.timeEnd,
    });

    return mapGameToResponseDto(createdGame, user);
  }

  /**
   * Обновление существующей игры
   *
   * Позволяет изменить параметры игры: время, статус, участников.
   * При добавлении новых участников со статусом INVITED автоматически
   * отправляет им приглашения через систему очередей.
   */
  async updateGame(id: string, dto: UpdateGameDto, requesterSub?: string) {
    const user = await this.userService.getUser({
      requesterSub,
    });

    if (!user) {
      return null;
    }

    const updateResult = await this.prisma.$transaction(async (tx) => {
      const game = await tx.game.findFirst({
        where: {
          id,
          users: {
            some: {
              role: $Enums.GameUserRole.CREATOR,
              userId: user.id,
            },
          },
        },
      });

      if (!game) {
        throw new Error("Игра не найдена или недостаточно прав");
      }

      const nextPlaceId = dto.placeId ?? game.placeId;
      const nextDate = dto.date ? stringToDate(dto.date) : game.date;
      const nextTimeStart = dto.timeStart ?? game.timeStart;
      const nextTimeEnd = dto.timeEnd ?? game.timeEnd;

      const hasSlotChanged =
        nextPlaceId !== game.placeId ||
        dateToString(nextDate) !== dateToString(game.date) ||
        nextTimeStart !== game.timeStart ||
        nextTimeEnd !== game.timeEnd;

      if (hasSlotChanged) {
        const hasConflict = await tx.game.findFirst({
          where: {
            id: { not: id },
            placeId: nextPlaceId,
            date: nextDate,
            status: {
              in: [GameStatus.DRAFT, GameStatus.APROVED],
            },
            OR: [
              {
                AND: [
                  { timeStart: { lte: nextTimeStart } },
                  { timeEnd: { gt: nextTimeStart } },
                ],
              },
              {
                AND: [
                  { timeStart: { lt: nextTimeEnd } },
                  { timeEnd: { gte: nextTimeEnd } },
                ],
              },
              {
                AND: [
                  { timeStart: { gte: nextTimeStart } },
                  { timeEnd: { lte: nextTimeEnd } },
                ],
              },
            ],
          },
        });

        if (hasConflict) {
          throw new Error("Выбранный слот уже забронирован или занят");
        }
      }

      if (dto.gameUsers?.length) {
        const currentUsers = await tx.gameUser.findMany({
          where: { gameId: id },
          select: { userId: true },
        });

        const currentUserIds = currentUsers.map((s) => s.userId);

        const usersToAdd = dto.gameUsers.filter(
          (item) => !currentUserIds.includes(item.userId)
        );
        const usersToRemove = currentUserIds.filter(
          (currentUserId) =>
            !dto.gameUsers.map((item) => item.userId).includes(currentUserId)
        );

        if (usersToRemove.length > 0) {
          await tx.gameUser.deleteMany({
            where: {
              gameId: id,
              userId: { in: usersToRemove },
            },
          });
        }

        if (usersToAdd.length > 0) {
          await tx.gameUser.createMany({
            data: usersToAdd.map((item) => ({
              userId: item.userId,
              gameId: id,
              role: item.role,
              status: item.status,
            })),
          });
        }
      } else {
        dto.gameUsers = [];
      }

      const updateGameData = mapUpdateGameDtoToPrismaInput(dto);

      const currentGame = await tx.game.update({
        where: { id },
        data: updateGameData,
        include: {
          users: {
            include: {
              user: true,
            },
          },
          place: true,
          sport: true,
        },
      });

      return {
        previousGame: game,
        updatedGame: currentGame,
      };
    });

    const { previousGame, updatedGame } = updateResult;

    if (updatedGame.users?.length) {
      const userIds = updatedGame.users
        .filter((gameUser) => gameUser.status === GameUserStatus.INVITED)
        .map((gameUser) => gameUser.user.id);

      if (userIds?.length) {
        await this.gameQueueService.sendInvite(updatedGame.id, userIds);
      }
    }

    const hasSlotChanged =
      updatedGame.placeId !== previousGame.placeId ||
      dateToString(updatedGame.date) !== dateToString(previousGame.date) ||
      updatedGame.timeStart !== previousGame.timeStart ||
      updatedGame.timeEnd !== previousGame.timeEnd;

    if (hasSlotChanged) {
      this.gameGateway.sendGameReleased(previousGame.placeId, {
        gameId: previousGame.id,
        date: dateToString(previousGame.date),
      });

      this.gameGateway.sendGameReserved(updatedGame.placeId, {
        gameId: updatedGame.id,
        date: dateToString(updatedGame.date),
        timeStart: updatedGame.timeStart,
        timeEnd: updatedGame.timeEnd,
      });
    }

    this.gameGateway.sendGameUpdated(updatedGame.placeId, {
      gameId: updatedGame.id,
      date: dateToString(updatedGame.date),
      timeStart: updatedGame.timeStart,
      timeEnd: updatedGame.timeEnd,
      status: updatedGame.status,
    });

    return mapGameToResponseDto(updatedGame, user);
  }

  /**
   * Удаление игры
   *
   * Полностью удаляет игру из системы. Операция необратима.
   * Также удаляются все связанные записи об участниках игры.
   */
  async deleteGame(id: string, requesterSub?: string) {
    const user = await this.userService.getUser({
      requesterSub,
    });

    if (!user) {
      return null;
    }

    const deletedGame = await this.prisma.$transaction(async (tx) => {
      // ищем игру, удалять даем только тому кто создал
      const game = await tx.game.findFirst({
        where: {
          id,
          users: {
            some: {
              role: $Enums.GameUserRole.CREATOR,
              userId: user.id,
            },
          },
        },
        include: { place: true, users: true }, // можно сразу получить связи
      });

      if (!game) {
        throw new Error("Игра не найдена или недостаточно прав");
      }

      // удаляем игру
      await tx.game.delete({
        where: { id: game.id },
      });

      return game;
    });

    this.gameGateway.sendGameReleased(deletedGame.placeId, {
      gameId: deletedGame.id,
      date: dateToString(deletedGame.date),
    });

    /**
     * {@inheritDoc}
     * @todo Добавить уведомления участникам об отмене игры
     * @author Евгений
     * @date 2026-02
     */

    return mapGameToResponseDto(deletedGame);
  }

  /**
   * Удаление игры,для которой не было завершено оформление
   *
   * Снаружи недоступно, вызыватся только из джоба очистки
   */
  async deleteDraftGame(id: string) {
    const deletedGame = await this.prisma.$transaction(async (tx) => {
      // ищем игру
      const game = await tx.game.findFirst({
        where: { id, status: GameStatus.DRAFT },
        include: { place: true, sport: true, users: true }, // можно сразу получить связи
      });

      if (!game) {
        throw new Error("Игра не найдена или не находится в статусе DRAFT");
      }

      // удаляем игру
      await tx.game.delete({
        where: { id: game.id },
      });

      return game;
    });

    this.gameGateway.sendGameReleased(deletedGame.placeId, {
      gameId: deletedGame.id,
      date: dateToString(deletedGame.date),
    });

    return deletedGame;
  }

  /**
   * Получение игры по идентификатору
   *
   * Возвращает подробную информацию об игре, включая данные о площадке
   * и всех участниках с их ролями и статусами.
   */
  async getGameById(id: string, requesterSub?: string) {
    const currentGame = await this.prisma.game.findUnique({
      where: { id },
      include: { place: true, sport: true, users: { include: { user: true } } },
    });

    const requestedUser = await this.userService.getUser({
      requesterSub,
    });

    return mapGameToResponseDto(currentGame, requestedUser || undefined);
  }

  /**
   * Получение списка игр с пагинацией
   *
   * Игры сортируются ПО РАЗНОМУ (зависит от timeframe).
   */
  async getGames(data: {
    page: number;
    limit: number;
    startDate?: string;
    stopDate?: string;
    timeframe?: GameTimeFrame;
    /** requesterSub всегда передается из запроса,
     * по этому параметру определяется блок meta для прав на фронте */
    requesterSub?: string;
    /** Если нужны игры юзера, то передаем его id */
    userId?: string;
    /** Статусы участников */
    memberStatuses?: GameUserStatus[];
    /** Если нужны игры конкретной площадки */
    placeId?: string;
  }) {
    let startDatePrepared: Date | undefined = data.startDate
      ? stringToDate(data.startDate)
      : undefined;
    let stopDatePrepared: Date | undefined = data.stopDate
      ? stringToDate(data.stopDate)
      : undefined;

    // Текущее время
    const currentTime = getTimeFromDateInMunutes(new Date());

    // Если даты не заданы, смотрим фрейм
    if (!startDatePrepared && !stopDatePrepared) {
      /**
       * {@inheritDoc}
       * @todo Проверить работу с UTC из-за возможной ошибки
       * @author Евгений
       * @date 2026-02
       */
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // если задан фрейм, то устанавливаем даты
      if (data.timeframe) {
        if (data.timeframe === GameTimeFrame.UPCOMING) {
          startDatePrepared = currentDate;
        } else if (data.timeframe === GameTimeFrame.PAST) {
          stopDatePrepared = currentDate;
        }
      } else {
        // по дефолту показываем ближайшие игры
        startDatePrepared = currentDate;
      }
    }

    // Условия для поиска предстоящих игр
    const startDateWhere = {
      // Фильтр по дате - только предстоящие игры
      OR: [
        { date: { gt: startDatePrepared } },
        {
          date: startDatePrepared,
          // Для игр сегодня проверяем время начала
          timeStart: {
            gt: currentTime,
          },
        },
      ],
    };

    // Условия для поиска прошедших игр
    const stopDateWhere = {
      // Фильтр по дате - только предстоящие игры
      OR: [
        { date: { lt: stopDatePrepared } },
        {
          date: stopDatePrepared,
          // Для игр сегодня проверяем время окончания
          timeEnd: {
            lt: currentTime,
          },
        },
      ],
    };

    const userIdWhere = data.userId
      ? Array.isArray(data.memberStatuses) && data.memberStatuses?.length
        ? {
            users: {
              some: {
                userId: data.userId,
                status: { in: data.memberStatuses },
              },
            },
          }
        : data.memberStatuses
        ? {
            users: {
              some: {
                userId: data.userId,
                status: {
                  in: [data.memberStatuses as unknown as GameUserStatus],
                },
              },
            },
          }
        : {
            users: {
              some: {
                userId: data.userId,
              },
            },
          }
      : undefined;

    const placeIdWhere = data.placeId ? { placeId: data.placeId } : undefined;

    const where = {
      AND: [
        startDatePrepared ? startDateWhere : null,
        stopDatePrepared ? stopDateWhere : null,
        userIdWhere,
        placeIdWhere,
      ].filter(Boolean),
    };

    const skip = (data.page - 1) * data.limit;

    // Для ближайших игр сортировка ASC, для остальных DESC
    const currentOrder =
      (!data.timeframe || data.timeframe === GameTimeFrame.UPCOMING) &&
      startDatePrepared &&
      !stopDatePrepared
        ? "asc"
        : "desc";

    const [items, total] = await this.prisma.$transaction([
      this.prisma.game.findMany({
        where,
        skip,
        take: data.limit,
        include: {
          place: true,
          sport: true,
          users: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { date: currentOrder },
      }),
      this.prisma.game.count(),
    ]);

    const user = await this.userService.getUser({
      requesterSub: data.requesterSub,
    });

    return {
      items: items.map((el) => mapGameToResponseDto(el, user || undefined)),
      total,
    };
  }

  /**
   * Принятие приглашения в игру
   *
   * Позволяет пользователю принять приглашение на участие в игре.
   * Изменяет статус участника с INVITED на CONFIRMED.
   * Доступно только для участников со статусом INVITED.
   */
  async acceptInvite(data: {
    gameId: string;
    requesterSub?: string;
    userId?: string;
  }) {
    const user = await this.userService.getUser({
      requesterSub: data.requesterSub,
      userId: data.userId,
    });

    if (!user) {
      return null;
    }

    // Обновляем статус пользователя в игре
    const updatedGameUser = await this.prisma.gameUser.updateMany({
      where: {
        gameId: data.gameId,
        userId: user.id,
        status: GameUserStatus.INVITED,
      },
      data: {
        status: GameUserStatus.CONFIRMED,
      },
    });

    if (updatedGameUser.count === 0) {
      return null;
    }

    // Уведомления
    await this.gameQueueService.sendAcceptInvite(data.gameId, user.id);

    // Возвращаем обновленную игру
    return this.getGameById(data.gameId, data.requesterSub);
  }

  /**
   * Отклонение приглашения в игру
   *
   * Позволяет пользователю отклонить приглашение на участие в игре.
   * Удаляет пользователя из списка участников игры (меняет статус с INVITED на REJECTED)
   * и делает недоступным его повторное приглашение.
   * Доступно только для участников со статусом INVITED.
   */
  async rejectInvite(data: {
    gameId: string;
    requesterSub?: string;
    userId?: string;
  }) {
    const user = await this.userService.getUser({
      requesterSub: data.requesterSub,
      userId: data.userId,
    });

    if (!user) {
      return null;
    }

    // Обновляем статус пользователя в игре
    const updatedGameUser = await this.prisma.gameUser.updateMany({
      where: {
        gameId: data.gameId,
        userId: user.id,
        status: GameUserStatus.INVITED,
      },
      data: {
        status: GameUserStatus.REJECTED,
      },
    });

    if (updatedGameUser.count === 0) {
      return null;
    }

    // Уведомления
    await this.gameQueueService.sendRejectInvite(data.gameId, user.id);

    // Возвращаем обновленную игру
    return this.getGameById(data.gameId, data.requesterSub);
  }

  /**
   * Запрос на участие в игре
   *
   * Для игры с режимом MODERATE пользователь может запрашивать участие в игре.
   * Добавляет в игру участника со статусом REQUESTED
   */
  async requestJoin(data: {
    gameId: string;
    requesterSub?: string;
    userId?: string;
  }) {
    const user = await this.userService.getUser({
      requesterSub: data.requesterSub,
      userId: data.userId,
    });

    if (!user) {
      return null;
    }

    const currentGame = await this.prisma.game.findUnique({
      where: {
        id: data.gameId,
      },
      include: {
        users: true,
      },
    });
    // Если игры нет или она не с режимом MODERATE, выходим
    if (
      !currentGame ||
      currentGame.requestMode !== $Enums.RequestMode.MODERATE
    ) {
      return null;
    }

    // Если юзер уже есть в игре, выходим
    if (currentGame.users.find((el) => el.userId === user.id)) {
      return null;
    }

    // Добавляем пользователя в игру
    const requestedGameUser = await this.prisma.gameUser.create({
      data: {
        gameId: data.gameId,
        userId: user.id,
        role: $Enums.GameUserRole.MEMBER,
        status: $Enums.GameUserStatus.REQUESTED,
      },
    });

    if (!requestedGameUser) {
      return null;
    }

    // Уведомления
    await this.gameQueueService.sendJoinRequest(data.gameId, user.id);

    // Возвращаем обновленную игру
    return this.getGameById(data.gameId, data.requesterSub);
  }

  /**
   * Добавление себя в список участников
   *
   * Доступно только для игр со статусом PUBLIC
   */
  async join(data: { gameId: string; requesterSub?: string; userId?: string }) {
    const user = await this.userService.getUser({
      requesterSub: data.requesterSub,
      userId: data.userId,
    });

    if (!user) {
      return null;
    }

    const currentGame = await this.prisma.game.findUnique({
      where: {
        id: data.gameId,
      },
      include: {
        users: true,
      },
    });
    // Если игры нет или она не публичная, выходим
    if (!currentGame || currentGame.requestMode !== $Enums.RequestMode.PUBLIC) {
      return null;
    }

    // Если юзер уже есть в игре, выходим
    if (currentGame.users.find((el) => el.userId === user.id)) {
      return null;
    }

    // Добавляем пользователя в игру сразу со статусом ALLOWED
    const requestedGameUser = await this.prisma.gameUser.create({
      data: {
        gameId: data.gameId,
        userId: user.id,
        role: $Enums.GameUserRole.MEMBER,
        status: $Enums.GameUserStatus.ALLOWED,
      },
    });

    if (!requestedGameUser) {
      return null;
    }

    // Уведомления
    await this.gameQueueService.sendJoinNotification(data.gameId, user.id);

    // Возвращаем обновленную игру
    return this.getGameById(data.gameId, data.requesterSub);
  }

  /**
   * Выход из участников игры
   */
  async unJoin(data: {
    gameId: string;
    requesterSub?: string;
    userId?: string;
  }) {
    const user = await this.userService.getUser({
      requesterSub: data.requesterSub,
      userId: data.userId,
    });

    if (!user) {
      return null;
    }

    // Удаляем юзера из списка участников
    await this.prisma.gameUser.deleteMany({
      where: {
        userId: user.id,
        gameId: data.gameId,
        NOT: { status: GameUserStatus.DECLINED },
      },
    });

    // Уведомления
    await this.gameQueueService.sendUnJoinNotification(data.gameId, user.id);

    // Возвращаем обновленную игру
    return this.getGameById(data.gameId, data.requesterSub);
  }

  /**
   * Отклонение запроса на участие в игре
   */
  async declineJoin(data: {
    gameId: string;
    requesterSub?: string;
    userId?: string;
  }) {
    const user = await this.userService.getUser({
      userId: data.userId,
    });

    if (!user) {
      return null;
    }

    // Обновляем статус пользователя в игре
    const updatedGameUser = await this.prisma.gameUser.updateMany({
      where: {
        gameId: data.gameId,
        userId: user.id,
        status: GameUserStatus.REQUESTED,
      },
      data: {
        status: GameUserStatus.DECLINED,
      },
    });

    if (updatedGameUser.count === 0) {
      return null;
    }

    // Уведомления
    await this.gameQueueService.sendJoinDecline(data.gameId, user.id);

    // Возвращаем обновленную игру
    return this.getGameById(data.gameId, data.requesterSub);
  }

  /**
   * Принятие запроса на участие в игре
   */
  async allowJoin(data: {
    gameId: string;
    requesterSub?: string;
    userId?: string;
  }) {
    const user = await this.userService.getUser({
      userId: data.userId,
    });

    if (!user) {
      return null;
    }

    // Обновляем статус пользователя в игре
    const updatedGameUser = await this.prisma.gameUser.updateMany({
      where: {
        gameId: data.gameId,
        userId: user.id,
        status: GameUserStatus.REQUESTED,
      },
      data: {
        status: GameUserStatus.ALLOWED,
      },
    });

    if (updatedGameUser.count === 0) {
      return null;
    }

    // Уведомления
    await this.gameQueueService.sendJoinAllow(data.gameId, user.id);

    // Возвращаем обновленную игру
    return this.getGameById(data.gameId, data.requesterSub);
  }

  /**
   * Продление бронирования игры
   *
   * Продлевает время жизни черновика игры. Используется при активности пользователя
   * в процессе заполнения данных игры.
   *
   * @param gameId ID игры
   * @param dto DTO продления (extendMinutes)
   * @param requesterSub Keycloak ID пользователя
   */
  async extendReservation(
    gameId: string,
    dto: ExtendReservationDto,
    requesterSub: string
  ) {
    const user = await this.userService.getUser({
      requesterSub,
    });

    if (!user) {
      throw new Error(`Пользователь с keycloak id ${requesterSub} не найден`);
    }

    // Проверяем, что игра существует и в статусе DRAFT
    // Проверяем, что пользователь является создателем (через связь GameUser)
    const game = await this.prisma.game.findFirst({
      where: {
        id: gameId,
        status: GameStatus.DRAFT,
        users: {
          some: {
            userId: user.id,
            role: $Enums.GameUserRole.CREATOR,
          },
        },
      },
      include: {
        place: true,
        users: { include: { user: true } },
      },
    });

    if (!game) {
      throw new Error(
        "Игра не найдена, не в статусе бронирования или вы не являетесь создателем"
      );
    }

    // Продлеваем бронирование (пересоздаём задачу в очереди)
    const ttlMinutes = dto.extendMinutes ?? 15;

    await this.gameQueueService.scheduleReservationCancel(
      gameId,
      ttlMinutes,
      true
    );

    return mapGameToResponseDto(game, user);
  }

  /**
   * Отмена бронирования игры
   *
   * Удаляет черновик игры и освобождает слот.
   *
   * @param gameId ID игры
   * @param requesterSub Keycloak ID пользователя
   */
  async cancelReservation(gameId: string, requesterSub: string) {
    const user = await this.userService.getUser({
      requesterSub,
    });

    if (!user) {
      throw new Error(`Пользователь с keycloak id ${requesterSub} не найден`);
    }

    // Проверяем, что игра существует и в статусе DRAFT
    // Проверяем, что пользователь является создателем (через связь GameUser)
    const game = await this.prisma.game.findFirst({
      where: {
        id: gameId,
        status: GameStatus.DRAFT,
        users: {
          some: {
            userId: user.id,
            role: $Enums.GameUserRole.CREATOR,
          },
        },
      },
      include: { place: true, users: true },
    });

    if (!game) {
      throw new Error(
        "Игра не найдена, не в статусе бронирования или вы не являетесь создателем"
      );
    }

    // Удаляем игру
    await this.prisma.game.delete({
      where: { id: gameId },
    });

    // Отправляем WebSocket событие об освобождении слота
    this.gameGateway.sendGameReleased(game.placeId, {
      gameId: game.id,
      date: dateToString(game.date),
    });

    return mapGameToResponseDto(game, user);
  }
}
