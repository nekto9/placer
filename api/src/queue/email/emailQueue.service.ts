import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bullmq';
import { GameResponseDto } from '@/modules/game/dto';
import { UserResponseDto } from '@/modules/user/dto';
import { formatTime } from '@/tools/dateUtils';
import { getDateTimeKey } from '../common/tools';
import { EMAIL_JOB_NAMES, QUEUE_NAMES } from './constants/email.constants';
import { EmailJobData, EmailJobResult } from './interfaces/emailJob.interface';

@Injectable()
export class EmailQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.EMAIL)
    private readonly emailQueue: Queue<EmailJobData>,
    private configService: ConfigService
  ) {}

  /** Данные об игре для сообщения */
  getGameInfo(game: GameResponseDto) {
    const gameDate = new Date(game.date).toLocaleDateString('ru-RU');
    const gameTime = `${formatTime(game.timeStart)} - ${formatTime(
      game.timeEnd
    )}`;

    return {
      placeName: game.place.name,
      gameDate,
      gameTime,
      gameLink: `${this.configService.get<string>('CLIENT_HOST')}/games/${
        game.id
      }`,
    };
  }

  async sendInvite(
    to: string,
    game: GameResponseDto
  ): Promise<Job<EmailJobData, EmailJobResult>> {
    return this.emailQueue.add(
      EMAIL_JOB_NAMES.SEND_INVITE,
      {
        to,
        subject: 'Приглашение в игру',
        template: 'invite',
        context: this.getGameInfo(game),
      },
      {
        jobId: `email-invite-${to}-${getDateTimeKey()}`, // Уникальный ID задачи
      }
    );
  }

  async sendJoinRequest(
    to: string,
    game: GameResponseDto,
    userMember: UserResponseDto
  ): Promise<Job<EmailJobData, EmailJobResult>> {
    return this.emailQueue.add(
      EMAIL_JOB_NAMES.SEND_INVITE,
      {
        to,
        subject: 'Запрос на участие в игре',
        template: 'joinRequest',
        context: { userName: userMember.username, ...this.getGameInfo(game) },
      },
      {
        jobId: `email-request-${to}-${getDateTimeKey()}`, // Уникальный ID задачи
      }
    );
  }

  async sendMessageForGame(
    to: string,
    message: string,
    subject: string,
    game: GameResponseDto
  ): Promise<Job<EmailJobData, EmailJobResult>> {
    return this.emailQueue.add(
      EMAIL_JOB_NAMES.SEND_MESSAGE,
      {
        to,
        subject,
        template: 'gameMessage',
        context: { message, ...this.getGameInfo(game) },
      },
      {
        jobId: `email-message-${to}-${getDateTimeKey()}`, // Уникальный ID задачи
      }
    );
  }
}
