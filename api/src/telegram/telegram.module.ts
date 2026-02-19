import { DynamicModule, forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegrafModule } from "nestjs-telegraf";
import { GameModule } from "@/modules/game/game.module";
import { UserModule } from "@/modules/user/user.module";
import { HelperQueueModule } from "@/queue/helper/helperQueue.module";
import { TelegramMockService } from "./telegram-mock.service";
import { BotWebhookController } from "./telegram.controller";
import { TelegramService } from "./telegram.service";
import { TelegramUpdate } from "./telegram.update";

/**
 * Модуль интеграции с Telegram Bot API
 *
 * Предоставляет функциональность для работы с Telegram ботом:
 * отправка уведомлений, обработка команд и callback-запросов,
 * интерактивное взаимодействие с пользователями через inline-клавиатуры.
 *
 * При недоступности Telegram API использует заглушку для предотвращения
 * блокировки запуска приложения.
 */
@Module({})
export class TelegramModule {
  private static readonly logger = new Logger(TelegramModule.name);

  static async forRoot(): Promise<DynamicModule> {
    const configService = new ConfigService();
    const telegramToken = configService.get<string>("TELEGRAM_BOT_TOKEN");

    // Если токен не настроен, используем заглушку
    if (!telegramToken) {
      this.logger.warn(
        "TELEGRAM_BOT_TOKEN не настроен, Telegram функциональность отключена"
      );
      return this.createMockModule();
    }

    try {
      // Проверяем доступность Telegram API с таймаутом
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://api.telegram.org/bot${telegramToken}/getMe`,
        {
          method: "GET",
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.logger.log("Telegram API доступен, загружаем полный модуль");
      return this.createFullModule();
    } catch (error) {
      this.logger.warn(
        `Telegram API недоступен (${error.message}), используем заглушку. ` +
          "Telegram функциональность будет отключена."
      );
      return this.createMockModule();
    }
  }

  private static createFullModule(): DynamicModule {
    return {
      module: TelegramModule,
      global: true,
      imports: [
        // Конфигурация Telegraf с токеном бота
        TelegrafModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            token: configService.get<string>("TELEGRAM_BOT_TOKEN"),
            launchOptions:
              configService.get<string>("NODE_ENV") === "production"
                ? {
                    webhook: {
                      domain: configService.get<string>("API_HOST"),
                      port: 443,
                      path: "/api/v1/telegraf-bot-atata",
                      secretToken:
                        configService.get<string>("SECRET_BOT_TOKEN"),
                    },
                  }
                : { dropPendingUpdates: true },
          }),
          inject: [ConfigService],
        }),
        forwardRef(() => GameModule),
        forwardRef(() => UserModule),
        HelperQueueModule,
      ],
      controllers: [BotWebhookController],
      providers: [TelegramService, TelegramUpdate],
      exports: [TelegramService],
    };
  }

  private static createMockModule(): DynamicModule {
    return {
      module: TelegramModule,
      global: true,
      imports: [
        forwardRef(() => GameModule),
        forwardRef(() => UserModule),
        HelperQueueModule,
      ],
      providers: [
        {
          provide: TelegramService,
          useClass: TelegramMockService,
        },
      ],
      exports: [TelegramService],
    };
  }
}
