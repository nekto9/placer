import { Injectable, Logger } from "@nestjs/common";
import { GameResponseDto } from "@/modules/game/dto";
import { UserResponseDto } from "@/modules/user/dto";

/**
 * Заглушка для TelegramService
 *
 * Используется когда Telegram API недоступен (например, при включенном VPN).
 * Все методы логируют предупреждения вместо реальной отправки сообщений.
 */
@Injectable()
export class TelegramMockService {
  private readonly logger = new Logger(TelegramMockService.name);

  constructor() {
    this.logger.warn(
      "Используется заглушка TelegramService - Telegram функциональность отключена"
    );
  }

  /**
   * Заглушка для рендера шаблона
   */
  async renderTemplate(
    templateName: string,
    data: Record<string, string>
  ): Promise<string> {
    this.logger.debug(`Заглушка renderTemplate: ${templateName}`, data);
    return `[MOCK] Template: ${templateName}`;
  }

  /**
   * Заглушка для получения информации об игре
   */
  async getGameInfo(game: GameResponseDto): Promise<string> {
    this.logger.debug(`Заглушка getGameInfo для игры ${game.id}`);
    return `[MOCK] Game info for ${game.id}`;
  }

  /**
   * Заглушка для отправки приглашения
   */
  async sendInvite(chatId: string, game: GameResponseDto): Promise<void> {
    this.logger.warn(
      `Заглушка sendInvite: приглашение в игру ${game.id} для чата ${chatId} не отправлено (Telegram недоступен)`
    );
  }

  /**
   * Заглушка для запроса на участие
   */
  async sendJoinRequest(
    chatId: string,
    game: GameResponseDto,
    userMember: UserResponseDto
  ): Promise<void> {
    this.logger.warn(
      `Заглушка sendJoinRequest: запрос от ${userMember.username} на участие в игре ${game.id} для чата ${chatId} не отправлен (Telegram недоступен)`
    );
  }

  /**
   * Заглушка для отправки сообщения
   */
  async sendMessage(chatId: string, message: string): Promise<void> {
    this.logger.warn(
      `Заглушка sendMessage: сообщение для чата ${chatId} не отправлено (Telegram недоступен): "${message}"`
    );
  }

  /**
   * Заглушка для привязки пользователя
   */
  async linkUser(deepLink: string, tgUserId: string): Promise<string | null> {
    this.logger.warn(
      `Заглушка linkUser: привязка пользователя ${tgUserId} с deepLink ${deepLink} не выполнена (Telegram недоступен)`
    );
    return null;
  }
}
