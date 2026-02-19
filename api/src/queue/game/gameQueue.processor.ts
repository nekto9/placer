import { Processor, WorkerHost } from "@nestjs/bullmq";
import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  Optional,
} from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "@/database/prisma.service";
import { GameService } from "@/modules/game/game.service";
import { UserService } from "@/modules/user/user.service";
import { $Enums } from "@/prismaClient";
import { TelegramService } from "@/telegram/telegram.service";
import { EmailQueueService } from "../email/emailQueue.service";
import {
  GAME_JOB_NAMES,
  GAME_JOB_RESULT_STATUSES,
  GAME_QUEUE_NAMES,
} from "./constants/game.constants";
import {
  GameCancelReservationJobData,
  GameCheckForResetJobData,
  GameJobResult,
  GameSendInviteJobData,
  GameSendMemberMessageJobData,
} from "./interfaces/gameJob.interface";

@Processor(GAME_QUEUE_NAMES.GAME)
@Injectable()
export class GameQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(GameQueueProcessor.name);

  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly emailQueueService: EmailQueueService,
    @Optional() private readonly telegramService?: TelegramService
  ) {
    super();

    if (!this.telegramService) {
      this.logger.warn(
        "TelegramService недоступен, Telegram уведомления будут пропущены"
      );
    }
  }

  /**
   * Безопасная отправка Telegram сообщения
   */
  private async safeTelegramSend(
    method: keyof TelegramService,
    ...args: any[]
  ): Promise<void> {
    if (!this.telegramService) {
      this.logger.debug(`Telegram недоступен, пропускаем ${method}`);
      return;
    }

    try {
      await (this.telegramService[method] as any)(...args);
    } catch (error) {
      this.logger.error(`Ошибка Telegram ${method}:`, error);
      // Не выбрасываем ошибку, чтобы не блокировать основную логику
    }
  }

  /**
   * Безопасная отправка сообщения с информацией об игре
   */
  private async safeTelegramGameMessage(
    telegramId: string,
    game: any,
    text: string
  ): Promise<void> {
    if (!this.telegramService) {
      this.logger.debug("Telegram недоступен, пропускаем отправку сообщения");
      return;
    }

    try {
      const gameInfo = await this.telegramService.getGameInfo(game);
      const message = gameInfo + `\n${text}`;
      await this.telegramService.sendMessage(telegramId, message);
    } catch (error) {
      this.logger.error("Ошибка отправки Telegram сообщения:", error);
    }
  }

  async process(
    job: Job<
      | GameCheckForResetJobData
      | GameSendInviteJobData
      | GameSendMemberMessageJobData
      | GameCancelReservationJobData,
      GameJobResult,
      string
    >
  ): Promise<GameJobResult> {
    // Валидация входных данных
    if (!job.data?.gameId) {
      throw new Error("Game ID is required");
    }

    try {
      await job.updateProgress(10);

      let result: GameJobResult;

      switch (job.name) {
        case GAME_JOB_NAMES.CHECK_GAME_FOR_RESET:
          result = await this.checkGameForReset(
            job.data as GameCheckForResetJobData
          );
          break;
        case GAME_JOB_NAMES.CANCEL_RESERVATION:
          result = await this.cancelReservation(
            job.data as GameCancelReservationJobData
          );
          break;
        case GAME_JOB_NAMES.SEND_INVITE:
          result = await this.sendInvite(job.data as GameSendInviteJobData);
          break;
        case GAME_JOB_NAMES.SEND_ACCEPT_INVITE:
          result = await this.sendAcceptInvite(
            job.data as GameSendMemberMessageJobData
          );
          break;
        case GAME_JOB_NAMES.SEND_REJECT_INVITE:
          result = await this.sendRejectInvite(
            job.data as GameSendMemberMessageJobData
          );
          break;
        case GAME_JOB_NAMES.SEND_JOIN_REQUEST:
          result = await this.sendJoinRequest(
            job.data as GameSendMemberMessageJobData
          );
          break;
        case GAME_JOB_NAMES.SEND_JOIN_ALLOW:
          result = await this.sendJoinAllow(
            job.data as GameSendMemberMessageJobData
          );
          break;
        case GAME_JOB_NAMES.SEND_JOIN_DECLINE:
          result = await this.sendJoinDecline(
            job.data as GameSendMemberMessageJobData
          );
          break;
        case GAME_JOB_NAMES.SEND_JOIN_NOTIFICATION:
          result = await this.sendJoinNotification(
            job.data as GameSendMemberMessageJobData
          );
          break;
        case GAME_JOB_NAMES.SEND_UNJOIN_NOTIFICATION:
          result = await this.sendUnJoinNotification(
            job.data as GameSendMemberMessageJobData
          );
          break;
        default:
          throw new Error(`Unknown job name: ${job.name}`);
      }

      await job.updateProgress(100);
      return result;
    } catch (error) {
      return {
        status: GAME_JOB_RESULT_STATUSES.FAILED,
        gameId: job.data.gameId,
        error: error.message,
        timestamp: Date.now(),
      };
    }
  }

  /** Удаление игры, если данные не были заполнены */
  private async checkGameForReset(
    data: GameCheckForResetJobData
  ): Promise<GameJobResult> {
    try {
      await this.gameService.deleteDraftGame(data.gameId);

      return {
        status: GAME_JOB_RESULT_STATUSES.SUCCESS,
        gameId: data.gameId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to reset game ${data.gameId}: ${error.message}`
      );
      throw error;
    }
  }

  /** Приглашение пользователей (отправка уведомлений участникам) */
  private async sendInvite(
    data: GameSendInviteJobData
  ): Promise<GameJobResult> {
    try {
      // Получаем данные игры
      const game = await this.gameService.getGameById(data.gameId);

      if (!game) {
        throw new Error(`Game ${data.gameId} not found`);
      }

      // Получаем пользователей для приглашения
      const users = await this.userService.getUsersByIds(data.userIds);

      // Отправляем сообщения всем пользователям
      for (const user of users) {
        try {
          // Если указана почта (Должна быть точно, решим на этапе настройки регистрации),
          // отправляем мыло
          if (user.email) {
            await this.emailQueueService.sendInvite(user.email, game);
          }

          // Если привязан телеграм, отправляем туда
          if (user.telegramId) {
            await this.safeTelegramSend("sendInvite", user.telegramId, game);
          }
        } catch (messageError) {
          this.logger.error(
            `Failed to send invite message to user ${user.id}: ${messageError.message}`
          );
          // Продолжаем отправку остальным пользователям
        }
      }

      return {
        status: GAME_JOB_RESULT_STATUSES.SUCCESS,
        gameId: data.gameId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to send invite messages for game ${data.gameId}: ${error.message}`
      );
      throw error;
    }
  }

  /** Принятие приглашения (отправка уведомления создателю) */
  private async sendAcceptInvite(data: GameSendMemberMessageJobData) {
    try {
      // Получаем данные игры
      const game = await this.gameService.getGameById(data.gameId);

      if (!game) {
        throw new Error(`Game ${data.gameId} not found`);
      }

      // Ищем создателя игры
      const gameCreator = game.gameUsers.find(
        (el) => el.role === $Enums.GameUserRole.CREATOR
      );

      if (!gameCreator) {
        throw new Error(`Creator for game ${data.gameId} not found`);
      }

      // Получаем пользователя создателя игры для отправки ему уведомлений
      const user = await this.userService.getUser({
        userId: gameCreator.userId,
      });

      // Получаем пользователя-участника
      const userMember = await this.userService.getUser({
        userId: data.userId,
      });

      const text = `${userMember.username} принял приглашение`;

      // отправляем мыло
      if (user.email) {
        await this.emailQueueService.sendMessageForGame(
          user.email,
          text,
          "Приглашение принято",
          game
        );
      }

      // Если привязан телеграм, отправляем туда
      if (user.telegramId) {
        await this.safeTelegramGameMessage(user.telegramId, game, text);
      }

      return {
        status: GAME_JOB_RESULT_STATUSES.SUCCESS,
        gameId: data.gameId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to send ConfirmInvite for game ${data.gameId}: ${error.message}`
      );
      throw error;
    }
  }

  /** Отклонение приглашения (отправка уведомления создателю) */
  private async sendRejectInvite(data: GameSendMemberMessageJobData) {
    try {
      // Получаем данные игры
      const game = await this.gameService.getGameById(data.gameId);

      if (!game) {
        throw new Error(`Game ${data.gameId} not found`);
      }

      // Ищем создателя игры
      const gameCreator = game.gameUsers.find(
        (el) => el.role === $Enums.GameUserRole.CREATOR
      );

      if (!gameCreator) {
        throw new Error(`Creator for game ${data.gameId} not found`);
      }

      // Получаем пользователя
      const user = await this.userService.getUser({
        userId: gameCreator.userId,
      });

      // Получаем пользователя-участника
      const userMember = await this.userService.getUser({
        userId: data.userId,
      });

      const text = `${userMember.username} отклонил приглашение`;

      // отправляем мыло
      if (user.email) {
        await this.emailQueueService.sendMessageForGame(
          user.email,
          text,
          "Приглашение оклонено",
          game
        );
      }

      // Если привязан телеграм, отправляем туда
      if (user.telegramId) {
        await this.safeTelegramGameMessage(user.telegramId, game, text);
      }

      return {
        status: GAME_JOB_RESULT_STATUSES.SUCCESS,
        gameId: data.gameId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to send ConfirmInvite for game ${data.gameId}: ${error.message}`
      );
      throw error;
    }
  }

  /** Запрос на участие (отправка уведомления создателю) */
  private async sendJoinRequest(data: GameSendMemberMessageJobData) {
    try {
      // Получаем данные игры
      const game = await this.gameService.getGameById(data.gameId);

      if (!game) {
        throw new Error(`Game ${data.gameId} not found`);
      }

      // Ищем создателя игры
      const gameCreator = game.gameUsers.find(
        (el) => el.role === $Enums.GameUserRole.CREATOR
      );

      if (!gameCreator) {
        throw new Error(`Creator for game ${data.gameId} not found`);
      }

      // Получаем создателя игры
      const user = await this.userService.getUser({
        userId: gameCreator.userId,
      });

      // Получаем участника игры
      const userMember = await this.userService.getUser({
        userId: data.userId,
      });

      // отправляем мыло
      if (user.email) {
        await this.emailQueueService.sendJoinRequest(
          user.email,
          game,
          userMember
        );
      }

      // Если привязан телеграм, отправляем туда
      if (user.telegramId) {
        await this.safeTelegramSend(
          "sendJoinRequest",
          user.telegramId,
          game,
          userMember
        );
      }

      return {
        status: GAME_JOB_RESULT_STATUSES.SUCCESS,
        gameId: data.gameId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to send ConfirmInvite for game ${data.gameId}: ${error.message}`
      );
      throw error;
    }
  }

  /** Принятие запроса на участие */
  private async sendJoinAllow(data: GameSendMemberMessageJobData) {
    try {
      // Получаем данные игры
      const game = await this.gameService.getGameById(data.gameId);

      if (!game) {
        throw new Error(`Game ${data.gameId} not found`);
      }

      // Получаем пользователя
      const user = await this.userService.getUser({
        userId: data.userId,
      });

      if (!user) {
        throw new Error(`allowedUser for game ${data.gameId} not found`);
      }

      const text = `Ваш запрос на участие принят`;

      // отправляем мыло
      if (user.email) {
        await this.emailQueueService.sendMessageForGame(
          user.email,
          text,
          "Запрос на участие принят",
          game
        );
      }

      // Если привязан телеграм, отправляем туда
      if (user.telegramId) {
        await this.safeTelegramGameMessage(user.telegramId, game, text);
      }

      return {
        status: GAME_JOB_RESULT_STATUSES.SUCCESS,
        gameId: data.gameId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to send JoinAllow for game ${data.gameId}: ${error.message}`
      );
      throw error;
    }
  }

  /** Отклонение запроса на участие */
  private async sendJoinDecline(data: GameSendMemberMessageJobData) {
    try {
      // Получаем данные игры
      const game = await this.gameService.getGameById(data.gameId);

      if (!game) {
        throw new Error(`Game ${data.gameId} not found`);
      }

      // Получаем пользователя
      const user = await this.userService.getUser({
        userId: data.userId,
      });

      if (!user) {
        throw new Error(`allowedUser for game ${data.gameId} not found`);
      }

      const text = `Ваш запрос на участие отклонен`;

      // отправляем мыло
      if (user.email) {
        await this.emailQueueService.sendMessageForGame(
          user.email,
          text,
          "Запрос на участие отклонен",
          game
        );
      }

      // Если привязан телеграм, отправляем туда
      if (user.telegramId) {
        await this.safeTelegramGameMessage(user.telegramId, game, text);
      }

      return {
        status: GAME_JOB_RESULT_STATUSES.SUCCESS,
        gameId: data.gameId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to send JoinAllow for game ${data.gameId}: ${error.message}`
      );
      throw error;
    }
  }

  /** Присоединение нового участника */
  private async sendJoinNotification(data: GameSendMemberMessageJobData) {
    try {
      // Получаем данные игры
      const game = await this.gameService.getGameById(data.gameId);

      if (!game) {
        throw new Error(`Game ${data.gameId} not found`);
      }

      // Ищем создателя игры
      const gameCreator = game.gameUsers.find(
        (el) => el.role === $Enums.GameUserRole.CREATOR
      );

      if (!gameCreator) {
        throw new Error(`Creator for game ${data.gameId} not found`);
      }

      // Получаем пользователя-участника
      const userMember = await this.userService.getUser({
        userId: data.userId,
      });

      // Получаем пользователя
      const user = await this.userService.getUser({
        userId: gameCreator.userId,
      });

      const text = `${userMember.username} приcоединился к игре`;

      // отправляем мыло
      if (user.email) {
        await this.emailQueueService.sendMessageForGame(
          user.email,
          text,
          "Новый участник игры",
          game
        );
      }

      // Если привязан телеграм, отправляем туда
      if (user.telegramId) {
        await this.safeTelegramGameMessage(user.telegramId, game, text);
      }

      return {
        status: GAME_JOB_RESULT_STATUSES.SUCCESS,
        gameId: data.gameId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to send JoinNotification for game ${data.gameId}: ${error.message}`
      );
      throw error;
    }
  }

  /** Выход юзера из участников */
  private async sendUnJoinNotification(data: GameSendMemberMessageJobData) {
    try {
      // Получаем данные игры
      const game = await this.gameService.getGameById(data.gameId);

      if (!game) {
        throw new Error(`Game ${data.gameId} not found`);
      }

      // Ищем создателя игры
      const gameCreator = game.gameUsers.find(
        (el) => el.role === $Enums.GameUserRole.CREATOR
      );

      if (!gameCreator) {
        throw new Error(`Creator for game ${data.gameId} not found`);
      }

      // Получаем пользователя-участника
      const userMember = await this.userService.getUser({
        userId: data.userId,
      });

      // Получаем пользователя
      const user = await this.userService.getUser({
        userId: gameCreator.userId,
      });

      const text = `${userMember.username} отказался от игры`;

      // отправляем мыло
      if (user.email) {
        await this.emailQueueService.sendMessageForGame(
          user.email,
          text,
          "Отказ участника от игры",
          game
        );
      }

      // Если привязан телеграм, отправляем туда
      if (user.telegramId) {
        await this.safeTelegramGameMessage(user.telegramId, game, text);
      }

      return {
        status: GAME_JOB_RESULT_STATUSES.SUCCESS,
        gameId: data.gameId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to send UnJoinNotification for game ${data.gameId}: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Отмена бронирования игры
   *
   * Удаляет черновик игры после истечения времени бронирования.
   * Вызывается автоматически из очереди.
   */
  private async cancelReservation(
    data: GameCancelReservationJobData
  ): Promise<GameJobResult> {
    try {
      // Получаем игру с пользователями, чтобы найти создателя
      const game = await this.prisma.game.findFirst({
        where: {
          id: data.gameId,
        },
        include: {
          users: {
            where: {
              role: $Enums.GameUserRole.CREATOR,
            },
            include: {
              user: true,
            },
          },
          place: true,
        },
      });

      if (!game) {
        // Игра уже удалена (например, вручную или завершена)
        return {
          status: GAME_JOB_RESULT_STATUSES.SUCCESS,
          gameId: data.gameId,
          timestamp: Date.now(),
        };
      }

      if (game.status !== $Enums.GameStatus.DRAFT) {
        // Игра уже была завершена или изменена
        return {
          status: GAME_JOB_RESULT_STATUSES.SUCCESS,
          gameId: data.gameId,
          timestamp: Date.now(),
        };
      }

      // Получаем создателя для передачи в cancelReservation
      const creator = game.users[0]?.user;
      const requesterSub = creator?.keycloakId || "";

      // Отменяем бронирование
      await this.gameService.cancelReservation(data.gameId, requesterSub);

      return {
        status: GAME_JOB_RESULT_STATUSES.SUCCESS,
        gameId: data.gameId,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to cancel reservation ${data.gameId}: ${error.message}`
      );
      // Не выбрасываем ошибку, чтобы не блокировать очередь
      return {
        status: GAME_JOB_RESULT_STATUSES.FAILED,
        gameId: data.gameId,
        error: error.message,
        timestamp: Date.now(),
      };
    }
  }
}
