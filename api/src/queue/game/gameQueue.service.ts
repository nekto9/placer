import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { getDateTimeKey } from '../common/tools';
import {
  DELAY_FOR_GAME_DELETE,
  GAME_JOB_NAMES,
  GAME_QUEUE_NAMES,
} from './constants/game.constants';
import {
  GameCheckForResetJobData,
  GameSendInviteJobData,
  GameSendMemberMessageJobData,
} from './interfaces/gameJob.interface';

/**
 * Сервис для управления очередью игровых задач
 */
@Injectable()
export class GameQueueService {
  constructor(
    @InjectQueue(GAME_QUEUE_NAMES.GAME) private readonly gameQueue: Queue
  ) {}

  /**
   * Добавляет задачу проверки игры на автоматическое удаление
   *
   * Создает отложенную задачу высокого приоритета для проверки
   * незаполненных или неактивных игр. Если игра не набрала достаточно
   * участников или не была активирована в течение определенного времени,
   * она будет автоматически удалена из системы.
   */
  async checkGameForReset(gameId: string) {
    const jobData: GameCheckForResetJobData = {
      gameId,
    };

    return this.gameQueue.add(GAME_JOB_NAMES.CHECK_GAME_FOR_RESET, jobData, {
      jobId: `check-game-for-reset-${gameId}-${getDateTimeKey()}`,
      delay: DELAY_FOR_GAME_DELETE, // Отложенное выполнение через заданный интервал
    });
  }

  /**
   * Добавляет задачу отправки приглашений пользователям в игру
   *
   * Создает задачу нормального приоритета для отправки уведомлений
   * о приглашении в игру указанным пользователям. Уведомления могут
   * отправляться через различные каналы: email, push-уведомления, Telegram.
   */
  async sendInvite(gameId: string, userIds: string[]) {
    const jobData: GameSendInviteJobData = {
      gameId,
      userIds,
    };

    return this.gameQueue.add(GAME_JOB_NAMES.SEND_INVITE, jobData, {
      jobId: `send-invite-${gameId}-${getDateTimeKey()}`,
    });
  }

  /** Принятие приглашения */
  async sendAcceptInvite(gameId: string, userId: string) {
    const jobData: GameSendMemberMessageJobData = {
      gameId,
      userId,
    };

    return this.gameQueue.add(GAME_JOB_NAMES.SEND_ACCEPT_INVITE, jobData, {
      jobId: `send-confirm-invite-${gameId}-${getDateTimeKey()}`,
    });
  }

  /** Отклонение приглашения */
  async sendRejectInvite(gameId: string, userId: string) {
    const jobData: GameSendMemberMessageJobData = {
      gameId,
      userId,
    };

    return this.gameQueue.add(GAME_JOB_NAMES.SEND_REJECT_INVITE, jobData, {
      jobId: `send-reject-invite-${gameId}-${getDateTimeKey()}`,
    });
  }

  /** Получение запроса на участие */
  async sendJoinRequest(gameId: string, userId: string) {
    const jobData: GameSendMemberMessageJobData = {
      gameId,
      userId,
    };

    return this.gameQueue.add(GAME_JOB_NAMES.SEND_JOIN_REQUEST, jobData, {
      jobId: `send-join-request-${gameId}-${getDateTimeKey()}`,
    });
  }

  /** Принятие запроса на участие */
  async sendJoinAllow(gameId: string, userId: string) {
    const jobData: GameSendMemberMessageJobData = {
      gameId,
      userId,
    };

    return this.gameQueue.add(GAME_JOB_NAMES.SEND_JOIN_ALLOW, jobData, {
      jobId: `send-join-allow-${gameId}-${getDateTimeKey()}`,
    });
  }

  /** Отклонение запроса на участие */
  async sendJoinDecline(gameId: string, userId: string) {
    const jobData: GameSendMemberMessageJobData = {
      gameId,
      userId,
    };

    return this.gameQueue.add(GAME_JOB_NAMES.SEND_JOIN_DECLINE, jobData, {
      jobId: `send-join-decline-${gameId}-${getDateTimeKey()}`,
    });
  }

  /** Присоединение нового участника */
  async sendJoinNotification(gameId: string, userId: string) {
    const jobData: GameSendMemberMessageJobData = {
      gameId,
      userId,
    };

    return this.gameQueue.add(GAME_JOB_NAMES.SEND_JOIN_NOTIFICATION, jobData, {
      jobId: `send-join-notification-${gameId}-${getDateTimeKey()}`,
    });
  }

  /** Выход юзера из участников */
  async sendUnJoinNotification(gameId: string, userId: string) {
    const jobData: GameSendMemberMessageJobData = {
      gameId,
      userId,
    };

    return this.gameQueue.add(
      GAME_JOB_NAMES.SEND_UNJOIN_NOTIFICATION,
      jobData,
      {
        jobId: `send-unjoin-notification-${gameId}-${getDateTimeKey()}`,
      }
    );
  }
}
