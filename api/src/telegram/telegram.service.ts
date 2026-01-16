import { join } from 'path';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import ejs from 'ejs';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { GameResponseDto } from '@/modules/game/dto';
import { UserResponseDto } from '@/modules/user/dto';
import { UserService } from '@/modules/user/user.service';
import { HelperQueueService } from '@/queue/helper/helperQueue.service';
import { formatTime } from '@/tools/dateUtils';

/**
 * Сервис для работы с Telegram Bot API
 */
@Injectable()
export class TelegramService {
  /**
   * Конструктор сервиса Telegram
   */
  constructor(
    @InjectBot() private bot: Telegraf,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly helperQueueService: HelperQueueService
  ) {}

  /** Рендер шаблона EJS */
  async renderTemplate(
    templateName: string,
    data: Record<string, string>
  ): Promise<string> {
    // Путь к папке с шаблонами
    const path = join(
      __dirname,
      '..',
      'templates',
      'telegram',
      `${templateName}.ejs`
    );
    return ejs.renderFile(path, data);
  }

  /** Данные об игре для сообщния */
  async getGameInfo(game: GameResponseDto) {
    const gameDate = new Date(game.date).toLocaleDateString('ru-RU');
    const gameTime = `${formatTime(game.timeStart)} - ${formatTime(game.timeEnd)}`;

    const result = await this.renderTemplate('gameInfo', {
      placeName: game.place.name,
      gameDate,
      gameTime,
    });
    return result;
  }

  /**
   * Отправляет приглашение на мероприятие с интерактивными кнопками
   *
   * Создает сообщение с inline-клавиатурой, позволяющей пользователю
   * быстро подтвердить или отклонить участие в мероприятии.
   * Callback-данные содержат ID события для последующей обработки.
   */
  async sendInvite(chatId: string, game: GameResponseDto): Promise<void> {
    try {
      const gameInfo = await this.getGameInfo(game);

      const inviteMessage =
        `Приглашение в игру!\n\n` + gameInfo + '\nПодтвердите участие';

      await this.bot.telegram.sendMessage(chatId, inviteMessage, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Принять', callback_data: `confirm:${game.id}` },
              { text: '❌ Отклонить', callback_data: `reject:${game.id}` },
            ],
          ],
        },
      });
    } catch (error) {
      console.error(`Failed to send invite to chat ${chatId}:`, error);
      throw new Error(`Failed to send Telegram invite: ${error.message}`);
    }
  }

  /** Запрос на уастие в игре */
  async sendJoinRequest(
    chatId: string,
    game: GameResponseDto,
    userMember: UserResponseDto
  ) {
    try {
      const gameInfo = await this.getGameInfo(game);

      const message =
        `${userMember.username} хочет присоединиться к игре\n\n` +
        gameInfo +
        '\nПодтвердите участника';

      await this.bot.telegram.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '✅ Принять',
                callback_data: `allow:${game.id}:${userMember.idx}`,
              },
              {
                text: '❌ Отклонить',
                callback_data: `decline:${game.id}:${userMember.idx}`,
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.error(`Failed to send invite to chat ${chatId}:`, error);
      throw new Error(`Failed to send Telegram invite: ${error.message}`);
    }
  }

  /**
   * Отправляет обычное текстовое сообщение пользователю
   *
   * Используется для отправки уведомлений, подтверждений,
   * информационных сообщений и других текстовых данных.
   */
  async sendMessage(chatId: string, message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      console.error(`Failed to send message to chat ${chatId}:`, error);
      throw new Error(`Failed to send Telegram message: ${error.message}`);
    }
  }

  /**
   * Привязка telegramId к пользователю
   */
  async linkUser(deepLink: string, tgUserId: string) {
    const linkedUser = await this.userService.linkTelegramUser(
      deepLink,
      tgUserId
    );

    if (linkedUser) {
      // Удаляем таску из bullmq
      await this.helperQueueService.removeJobUserTgLinker(linkedUser.id);

      return linkedUser.username;
    }

    return null;
  }
}
