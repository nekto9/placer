import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { staticFolderOptions } from './config/static.config';
import { PrismaModule } from './database/prisma.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { MailSenderModule } from './mailSender/mailSender.module';
import { CityModule } from './modules/city/city.module';
import { GameModule } from './modules/game/game.module';
import { PlaceModule } from './modules/place/place.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { SportModule } from './modules/sport/sport.module';
import { UploaderModule } from './modules/uploader/uploader.module';
import { UserModule } from './modules/user/user.module';
import { BullMQModule } from './queue/bullmq/bullmq.module';
import { EmailQueueModule } from './queue/email/emailQueue.module';
import { GameQueueModule } from './queue/game/gameQueue.module';
import { HelperQueueModule } from './queue/helper/helperQueue.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    // Модуль конфигурации - загружает переменные окружения из .env файлов
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Папки со статикой
    ServeStaticModule.forRoot(
      staticFolderOptions.Public,
      staticFolderOptions.Avatar,
      staticFolderOptions.Cover
    ),

    // Модуль очередей задач - настраивает BullMQ с Redis
    BullMQModule,

    // Модуль аутентификации через Keycloak
    KeycloakModule,

    // Модуль работы с базой данных через Prisma ORM
    PrismaModule,

    // Бизнес-модули приложения
    PlaceModule, // Управление игровыми площадками
    ScheduleModule, // Управление расписанием и временными слотами
    GameModule, // Управление играми и участниками
    UserModule, // Управление пользователями и профилями

    // Справочники
    SportModule, // Управление видами спорта
    CityModule, // Управление городами

    // Аплоадер
    UploaderModule,

    // Модули очередей для асинхронной обработки
    EmailQueueModule, // Очередь email-уведомлений
    GameQueueModule, // Очередь игровых уведомлений и задач
    HelperQueueModule, // Очередь вспомогательных задач (очистка данных)

    // Интеграция с внешними сервисами
    TelegramModule, // Telegram Bot для уведомлений
    MailSenderModule, // отправка электропочты
  ],
})
export class AppModule {}
