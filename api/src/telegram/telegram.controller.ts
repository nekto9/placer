import { Controller, ForbiddenException, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request, Response } from 'express'; // Или из 'fastify'
import { Public } from 'nest-keycloak-connect';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/types';

/*
Т.к. у нас все запрсы к апи перекрыты через гард, а запросы к боту нам нужно дергать неавторизованными,
то нам нужно использовать @Public(), который мы можем применить только к контроллеру.
Дополнительно у нас все апи перекрыто сваггером и пути здесь формируются через /api/v1/
Короче, контроллер для работы бота было сделать проще, чем городить дополнительную обвязку для обхода механизмов nest
Сам контроллер в сваггере не показываем
*/
@ApiExcludeController()
@Controller({
  path: 'telegraf-bot-atata',
  version: '1', // Явно указываем версию для /api/v1/telegraf-bot-atata
})
export class BotWebhookController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private configService: ConfigService
  ) {}

  @Public()
  @Post()
  async handleUpdate(
    @Req() req: Request & { body: Update },
    @Res() res: Response
  ): Promise<void> {
    // 1. Проверка секретного токена для безопасности
    const secretToken = req.headers['x-telegram-bot-api-secret-token'];

    const controlTokenValue =
      this.configService.get<string>('SECRET_BOT_TOKEN');

    if (controlTokenValue && secretToken !== controlTokenValue) {
      throw new ForbiddenException('Invalid secret token');
    }

    // 2. Передача обновления в Telegraf
    // handleUpdate принимает объект Update и объект ответа (res)
    await this.bot.handleUpdate(req.body, res);
  }
}
