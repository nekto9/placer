import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma.module';
import { registerHelperQueueSettings } from './constants/helper.constants';
import { HelperQueueProcessor } from './helperQueue.processor';
import { HelperQueueService } from './helperQueue.service';

/**
 * Модуль очереди вспомогательных задач
 *
 * Предоставляет функциональность для выполнения фоновых задач обслуживания:
 * очистка устаревших записей, обслуживание базы данных, периодические операции.
 * Использует BullMQ для асинхронной обработки задач с поддержкой
 * приоритетов, повторных попыток и мониторинга.
 *
 * @class HelperQueueModule
 * @description Модуль для управления вспомогательными задачами
 *
 * Основные возможности:
 * - Очистка устаревших записей UserTgLinker
 * - Планирование периодических задач обслуживания
 * - Мониторинг выполнения задач
 * - Управление жизненным циклом задач
 *
 *
 */
@Module({
  imports: [
    PrismaModule, // Доступ к базе данных
    BullModule.registerQueue(registerHelperQueueSettings), // Регистрация очереди BullMQ
  ],
  providers: [HelperQueueService, HelperQueueProcessor], // Сервис и процессор очереди
  exports: [HelperQueueService], // Экспорт сервиса для использования в других модулях
})
export class HelperQueueModule {}
