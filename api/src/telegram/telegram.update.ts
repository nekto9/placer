import { forwardRef, Inject } from '@nestjs/common';
import { Action, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { CallbackQuery, Message } from 'telegraf/typings/core/types/typegram';
import { GameService } from '@/modules/game/game.service';
import { UserService } from '@/modules/user/user.service';
import { TelegramService } from './telegram.service';

/**
 * Обработчик обновлений и команд Telegram бота
 *
 * Содержит методы для обработки различных типов взаимодействий пользователей
 * с ботом: команды, текстовые сообщения, нажатия на inline-кнопки.
 * Использует декораторы nestjs-telegraf для маршрутизации событий.
 */
@Update()
export class TelegramUpdate {
  constructor(
    private readonly telegramService: TelegramService,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}
  /**
   * Обработчик команды /start
   */
  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    if ('text' in (ctx.message as Message.TextMessage)) {
      const text = (ctx.message as Message.TextMessage).text;
      const parts = text.split(' ');
      const deepLinkValue = parts[1] || null;

      if (deepLinkValue) {
        const linkedUser = await this.telegramService.linkUser(
          deepLinkValue,
          String(ctx.from.id)
        );

        // Обработка deep link параметра
        if (linkedUser) {
          await ctx.reply(
            `Пользователь ${linkedUser} связан с аккаунтом телеграм`
          );
        } else {
          await ctx.reply(`Ошибка связи`);
        }
      } else {
        // Обычный старт без параметров
        await ctx.reply('Добро пожаловать');
      }
    }
  }

  /**
   * Принятие приглашения
   */
  @Action(/confirm:([0-9a-fA-F-]{36})/)
  async confirm(@Ctx() ctx: Context): Promise<void> {
    if ('data' in (ctx.callbackQuery as CallbackQuery.DataQuery)) {
      const data = (ctx.callbackQuery as CallbackQuery.DataQuery).data;
      const gameId = data.split(':')[1];
      const telegramId = String(ctx.from.id);

      try {
        const user = await this.userService.getUser({ telegramId });

        if (user) {
          await this.gameService.acceptInvite({
            gameId: gameId,
            userId: user.id,
          });
        }

        const game = await this.gameService.getGameById(gameId);
        const gameInfo = await this.telegramService.getGameInfo(game);

        // Отправляем подтверждение пользователю
        await ctx.answerCbQuery('Участие подтверждено');

        // Обновляем текст сообщения
        await ctx.editMessageText(`${gameInfo}\n✅ Вы подтвердили участие`);
      } catch (error) {
        console.error('Error confirming participation:', error);
        await ctx.answerCbQuery('Произошла ошибка. Попробуйте позже.');
      }
    }
  }

  /**
   * Отклонение приглашения
   */
  @Action(/reject:([0-9a-fA-F-]{36})/)
  async reject(@Ctx() ctx: Context): Promise<void> {
    const gameId = (ctx.callbackQuery as CallbackQuery.DataQuery).data.split(
      ':'
    )[1];
    const telegramId = String(ctx.from.id);

    try {
      const user = await this.userService.getUser({ telegramId });
      if (user) {
        await this.gameService.rejectInvite({
          gameId: gameId,
          userId: user.id,
        });
      }

      const game = await this.gameService.getGameById(gameId);
      const gameInfo = await this.telegramService.getGameInfo(game);

      // Отправляем подтверждение об отказе
      await ctx.answerCbQuery('Приглашение отклонено.');

      // Обновляем текст сообщения
      await ctx.editMessageText(`${gameInfo}\n❌ Вы отказались от участия`);
    } catch (error) {
      console.error('Error rejecting participation:', error);
      await ctx.answerCbQuery('Произошла ошибка. Попробуйте позже.');
    }
  }

  /**
   * Принятие запроса на участие
   */
  @Action(/allow:([0-9a-fA-F-]{36}):(\d+)/)
  async allow(@Ctx() ctx: Context): Promise<void> {
    const data = (ctx.callbackQuery as CallbackQuery.DataQuery).data.split(':');
    const gameId = data[1];
    const memberIdx = +data[2];

    try {
      const user = await this.userService.getUser({ userIdx: memberIdx });
      if (user) {
        await this.gameService.allowJoin({
          gameId: gameId,
          userId: user.id,
        });
      }

      const game = await this.gameService.getGameById(gameId);
      const gameInfo = await this.telegramService.getGameInfo(game);

      // Отправляем подтверждение о принятии
      await ctx.answerCbQuery('Запрос принят.');

      // Обновляем текст сообщения
      await ctx.editMessageText(
        `${gameInfo}\n✅ ${user.username} добавлен в участники`
      );
    } catch (error) {
      console.error('Error allowing participation:', error);
      await ctx.answerCbQuery('Произошла ошибка. Попробуйте позже.');
    }
  }

  /**
   * Отклонение запроса на участие
   */
  @Action(/decline:([0-9a-fA-F-]{36}):(\d+)/)
  async decline(@Ctx() ctx: Context): Promise<void> {
    const data = (ctx.callbackQuery as CallbackQuery.DataQuery).data.split(':');
    const gameId = data[1];
    const memberIdx = +data[2];

    try {
      const user = await this.userService.getUser({ userIdx: memberIdx });
      if (user) {
        await this.gameService.declineJoin({
          gameId: gameId,
          userId: user.id,
        });
      }

      const game = await this.gameService.getGameById(gameId);
      const gameInfo = await this.telegramService.getGameInfo(game);

      // Отправляем подтверждение об отказе
      await ctx.answerCbQuery('Запрос отклонен.');

      // Обновляем текст сообщения
      await ctx.editMessageText(
        `${gameInfo}\n❌ Пользователю ${user.username} в участии отказано`
      );
    } catch (error) {
      console.error('Error allowing participation:', error);
      await ctx.answerCbQuery('Произошла ошибка. Попробуйте позже.');
    }
  }
}
