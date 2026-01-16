import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Модуль очередей задач
 */
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule], // нужно для доступа к ConfigService
      useFactory: (configService: ConfigService) => ({
        /** Настройки подключения к Redis */
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD') || undefined,
        },

        /** Параметры по умолчанию для всех задач */
        defaultJobOptions: {
          /** Количество попыток выполнения задачи при ошибке */
          attempts: 3,

          /** Стратегия повторных попыток */
          backoff: {
            type: 'exponential', // Экспоненциальная задержка
            delay: 1000, // Начальная задержка 1 секунда
          },

          /** Автоматическое удаление успешно выполненных задач через 1 час */
          removeOnComplete: { age: 3600 },

          /** Автоматическое удаление неудачных задач через 24 часа */
          removeOnFail: { age: 24 * 3600 },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule], // Экспортируем сервис для использования в других модулях
})
export class BullMQModule {}
