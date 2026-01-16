import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { GameModule } from '@/modules/game/game.module';
import { UserModule } from '@/modules/user/user.module';
import { HelperQueueModule } from '@/queue/helper/helperQueue.module';
import { BotWebhookController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';

/**
 * Модуль интеграции с Telegram Bot API
 *
 * Предоставляет функциональность для работы с Telegram ботом:
 * отправка уведомлений, обработка команд и callback-запросов,
 * интерактивное взаимодействие с пользователями через inline-клавиатуры.
 */
@Module({
  imports: [
    // Конфигурация Telegraf с токеном бота
    TelegrafModule.forRootAsync({
      imports: [ConfigModule], // нужно для доступа к ConfigService
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        launchOptions:
          configService.get<string>('NODE_ENV') === 'production'
            ? {
                webhook: {
                  domain: configService.get<string>('API_HOST'),
                  port: 443,
                  path: '/api/v1/telegraf-bot-atata',
                  secretToken: configService.get<string>('SECRET_BOT_TOKEN'),
                },
              }
            : { dropPendingUpdates: true }, // В разработке сбрасываем накопившиеся обновления
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => GameModule),
    forwardRef(() => UserModule),
    HelperQueueModule, // очереди вспомогательных задач
  ],
  controllers: [BotWebhookController],
  providers: [
    TelegramService, // Сервис для отправки сообщений
    TelegramUpdate, // Обработчик команд и callback-запросов
  ],
  exports: [TelegramService], // Экспортируем сервис для использования в других модулях
})
export class TelegramModule {}
