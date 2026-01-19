import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import {
  $Enums,
  GameLevel,
  GameStatus,
  GameTimeFrame,
  GameUserStatus,
} from '@/prismaClient';
import { GameQueueService } from '@/queue/game/gameQueue.service';
import { getTimeFromDateInMunutes, stringToDate } from '@/tools/dateUtils';
import { UserService } from '../user/user.service';
import { CreateGameDto, UpdateGameDto } from './dto';
import {
  mapCreateGameDtoToPrismaInput,
  mapGameToResponseDto,
  mapUpdateGameDtoToPrismaInput,
} from './mappers';

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
    private userService: UserService
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
    // Получаем данные временного слота
    const timeSlot = await this.prisma.timeSlot.findUnique({
      where: { id: slotId },
    });

    if (!timeSlot) {
      throw new Error(`Time slot with id ${slotId} not found`);
    }

    const user = await this.userService.getUser({
      requesterSub,
    });

    if (!user) {
      throw new Error(`User with keycloak id ${requesterSub} not found`);
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

    // Добавляем задачу на автоматическую проверку и удаление неактивных игр
    await this.gameQueueService.checkGameForReset(createdGame.id);

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
    const user = await this.userService.getUser({
      requesterSub,
    });

    if (!user) {
      throw new Error(`User with keycloak id ${requesterSub} not found`);
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

    // Добавляем задачу на автоматическую проверку и удаление неактивных игр
    await this.gameQueueService.checkGameForReset(createdGame.id);

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

    // Обновляем игру в базе данных
    const updatedGame = await this.prisma.$transaction(async (tx) => {
      // ищем игру и проверяем на доступ юзера
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
        throw new Error('Game not found or not in permissions');
      }

      // Если дошли до сюда, то обновляем

      // 1. Получаем текущие связи с пользователями
      const currentUsers = await tx.gameUser.findMany({
        where: { gameId: id },
        select: { userId: true },
      });

      const currentUserIds = currentUsers.map((s) => s.userId);

      // 2. Определяем что добавить, что удалить
      const usersToAdd = dto.gameUsers.filter(
        (user) => !currentUserIds.includes(user.userId)
      );
      const usersToRemove = currentUserIds.filter(
        (id) => !dto.gameUsers.map((u) => u.userId).includes(id)
      );

      // 3. Удаляем ненужные связи
      if (usersToRemove.length > 0) {
        await tx.gameUser.deleteMany({
          where: {
            gameId: id,
            userId: { in: usersToRemove },
          },
        });
      }

      // 4. Добавляем новые связи
      if (usersToAdd.length > 0) {
        await tx.gameUser.createMany({
          data: usersToAdd.map((user) => ({
            userId: user.userId,
            gameId: id,
            role: user.role,
            status: user.status,
          })),
        });
      }

      const updateGameData = mapUpdateGameDtoToPrismaInput(dto);

      // 5. Обновляем игру
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

      return currentGame;
    });

    // Если игра была обновлена и есть пользователи для приглашения
    if (updatedGame.users?.length) {
      // Фильтруем только приглашенных пользователей
      const userIds = updatedGame.users
        .filter((gameUser) => gameUser.status === GameUserStatus.INVITED)
        .map((gameUser) => gameUser.user.id);

      if (userIds?.length) {
        // Добавляем задачу на отправку приглашений в очередь
        await this.gameQueueService.sendInvite(updatedGame.id, userIds);
      }

      // TODO: Добавить уведомления остальным участникам об изменении игры
    }

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
        throw new Error('Game not found or not in permissions');
      }

      // удаляем игру
      await tx.game.delete({
        where: { id: game.id },
      });

      return game;
    });

    // TODO: Добавить уведомления участникам об отмене игры

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
        throw new Error('Game not found or not in DRAFT status');
      }

      // удаляем игру
      await tx.game.delete({
        where: { id: game.id },
      });

      return game;
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
      // TODO: Тут из-за utc возможен косяк, нужно проверить
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
        ? 'asc'
        : 'desc';

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
}
