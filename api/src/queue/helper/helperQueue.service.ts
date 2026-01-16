import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import {
  HELPER_JOB_IDS,
  HELPER_JOB_NAMES,
  HELPER_JOB_PRIORITIES,
  HELPER_QUEUE_NAMES,
  USER_TG_LINKER_TTL,
} from './constants/helper.constants';
import {
  CleanupUserTgLinkerJobData,
  HelperJobResult,
} from './interfaces/helperJob.interface';

/**
 * Сервис для управления очередью вспомогательных задач
 *
 * Предоставляет методы для добавления различных типов вспомогательных задач:
 * очистка устаревших записей, обслуживание базы данных, фоновые операции.
 * Использует BullMQ для асинхронной обработки задач с поддержкой
 * приоритетов, повторных попыток и отложенного выполнения.
 *
 * @class HelperQueueService
 * @description Сервис для работы с очередью вспомогательных задач
 */
@Injectable()
export class HelperQueueService {
  private readonly logger = new Logger(HelperQueueService.name);

  /**
   * Конструктор сервиса вспомогательных очередей
   *
   * @param {Queue} helperQueue - Очередь для вспомогательных задач, инжектируемая через BullMQ
   */
  constructor(
    @InjectQueue(HELPER_QUEUE_NAMES.HELPER) private readonly helperQueue: Queue
  ) {}

  /**
   * Добавляет задачу очистки устаревших записей UserTgLinker
   *
   * Создает задачу для удаления записей UserTgLinker, которые старше указанного времени.
   * По умолчанию удаляются записи старше 5 минут. Эта задача помогает поддерживать
   * чистоту базы данных и освобождать место от временных записей связывания Telegram аккаунтов.
   *
   * @async
   * @method cleanupUserTgLinker
   * @param {string} [userId] - ID пользователя для связывания аккаунта телеграм
   * @returns {Promise<Job<CleanupUserTgLinkerJobData, HelperJobResult>>} Созданная задача в очереди
   */
  async cleanupUserTgLinker(
    userId: string
  ): Promise<Job<CleanupUserTgLinkerJobData, HelperJobResult>> {
    const jobData: CleanupUserTgLinkerJobData = {
      userId,
    };

    this.logger.log('Queuing UserTgLinker cleanup task');

    return this.helperQueue.add(
      HELPER_JOB_NAMES.CLEANUP_USER_TG_LINKER,
      jobData,
      {
        jobId: HELPER_JOB_IDS.CLEANUP_USER_TG_LINKER(userId),
        delay: USER_TG_LINKER_TTL,
        priority: HELPER_JOB_PRIORITIES.NORMAL, // Нормальный приоритет для задач очистки
        attempts: 3, // Стандартное количество попыток
        backoff: {
          type: 'exponential', // Экспоненциальная задержка между попытками
          delay: 1000, // Начальная задержка 1 секунда
        },
        removeOnComplete: 50, // Хранить 50 успешно выполненных задач
        removeOnFail: 25, // Хранить 25 неудачных задач
      }
    );
  }

  /**
   * Удаляем задачу из BullMQ
   * @param userId - юзер
   */
  async removeJobUserTgLinker(userId: string) {
    await this.helperQueue.remove(
      HELPER_JOB_IDS.CLEANUP_USER_TG_LINKER(userId)
    );
  }

  /**
   * Получение информации о конкретной задаче по её идентификатору
   *
   * Позволяет получить детальную информацию о задаче: статус выполнения,
   * данные, результат, количество попыток и другие метаданные.
   * Используется для мониторинга и отладки задач в очереди.
   *
   * @async
   * @method getJob
   * @param {string} jobId - Идентификатор задачи
   * @returns {Promise<Job<CleanupUserTgLinkerJobData, HelperJobResult> | undefined>} Объект задачи или undefined, если не найдена

   */
  async getJob(
    jobId: string
  ): Promise<Job<CleanupUserTgLinkerJobData, HelperJobResult> | undefined> {
    return this.helperQueue.getJob(jobId);
  }

  /**
   * Удаление конкретной задачи из очереди
   *
   * Принудительно удаляет задачу из очереди независимо от её статуса.
   * Используется для отмены задач или очистки проблемных задач.
   * Будьте осторожны при использовании этого метода.
   *
   * @async
   * @method removeJob
   * @param {string} jobId - Идентификатор задачи для удаления

   */
  async removeJob(jobId: string) {
    await this.helperQueue.remove(jobId);
    this.logger.log(`Job ${jobId} removed from helper queue`);
  }
}
