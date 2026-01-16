import {
  OnQueueEvent,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '@/database/prisma.service';
import {
  HELPER_JOB_NAMES,
  HELPER_JOB_RESULT_STATUSES,
  HELPER_QUEUE_NAMES,
  USER_TG_LINKER_TTL,
} from './constants/helper.constants';
import {
  CleanupUserTgLinkerJobData,
  HelperJobResult,
} from './interfaces/helperJob.interface';

/**
 * Процессор для обработки вспомогательных задач
 *
 * Обрабатывает различные типы вспомогательных задач: очистка устаревших записей,
 * обслуживание базы данных, фоновые операции. Использует BullMQ для
 * асинхронной обработки с поддержкой событий и мониторинга.
 *
 * @class HelperQueueProcessor
 * @description Процессор для вспомогательных задач очереди
 */
@Processor(HELPER_QUEUE_NAMES.HELPER)
@Injectable()
export class HelperQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(HelperQueueProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  /**
   * Основной метод обработки задач
   *
   * Маршрутизирует задачи по типам и выполняет соответствующую обработку.
   * Включает валидацию входных данных, обновление прогресса и обработку ошибок.
   *
   * @async
   * @method process
   * @param {Job<CleanupUserTgLinkerJobData, HelperJobResult, string>} job - Задача для обработки
   * @returns {Promise<HelperJobResult>} Результат выполнения задачи
   */
  async process(
    job: Job<CleanupUserTgLinkerJobData, HelperJobResult, string>
  ): Promise<HelperJobResult> {
    this.logger.log(
      `Processing helper job ${job.name} (${job.id}) - ${
        job.data.userId || 'No reason specified'
      }`
    );

    try {
      await job.updateProgress(10);

      let result: HelperJobResult;

      switch (job.name) {
        case HELPER_JOB_NAMES.CLEANUP_USER_TG_LINKER:
          result = await this.cleanupUserTgLinker(
            job.data as CleanupUserTgLinkerJobData
          );
          break;
        default:
          throw new Error(`Unknown helper job name: ${job.name}`);
      }

      await job.updateProgress(100);
      return result;
    } catch (error) {
      this.logger.error(`Helper job ${job.id} failed: ${error.message}`);
      return {
        status: HELPER_JOB_RESULT_STATUSES.FAILED,
        error: error.message,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Очистка устаревших записей UserTgLinker
   *
   * Удаляет записи UserTgLinker, которые старше указанного времени.
   * Эти записи создаются при попытке связывания Telegram аккаунта
   * и должны быть удалены, если связывание не было завершено.
   *
   * @private
   * @async
   * @method cleanupUserTgLinker
   * @param {CleanupUserTgLinkerJobData} data - Данные задачи очистки
   * @returns {Promise<HelperJobResult>} Результат выполнения очистки
   */
  private async cleanupUserTgLinker(
    data: CleanupUserTgLinkerJobData
  ): Promise<HelperJobResult> {
    const cutoffTime = new Date(Date.now() - USER_TG_LINKER_TTL);

    this.logger.log(
      `Cleaning up UserTgLinker records older than ${new Date(
        cutoffTime
      ).toISOString()}`
    );

    try {
      // Удаляем записи старше указанного времени
      const deleteResult = await this.prisma.userTgLinker.deleteMany({
        where: {
          createdAt: {
            lte: cutoffTime,
          },
          userId: data.userId,
        },
      });

      const deletedCount = deleteResult.count;

      this.logger.log(
        `Successfully deleted ${deletedCount} UserTgLinker records`
      );

      return {
        status: HELPER_JOB_RESULT_STATUSES.SUCCESS,
        deletedCount,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to cleanup UserTgLinker records: ${error.message}`
      );
      throw error;
    }
  }

  // События обработчика
  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`⚡ Helper job ${job.id} became active`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: HelperJobResult) {
    if (result.deletedCount !== undefined) {
      this.logger.log(
        `Helper job ${job.id} completed successfully - deleted ${result.deletedCount} records`
      );
    } else {
      this.logger.log(`Helper job ${job.id} completed successfully`);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`Helper job ${job.id} failed: ${err.message}`);
  }

  @OnWorkerEvent('error')
  onError(err: Error) {
    this.logger.error(`Helper worker error: ${err.message}`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number | object) {
    this.logger.log(`Helper job ${job.id} progress: ${progress}%`);
  }

  // События очереди
  @OnQueueEvent('waiting')
  onWaiting(job: Job) {
    this.logger.log(`Helper job ${job.id} is waiting`);
  }

  @OnQueueEvent('active')
  onQueueActive(job: Job) {
    this.logger.log(`Helper queue event: Job ${job.id} is active`);
  }

  @OnQueueEvent('completed')
  onQueueCompleted(job: Job, result: HelperJobResult) {
    if (result.deletedCount !== undefined) {
      this.logger.log(
        `Helper queue event: Job ${job.id} completed - deleted ${result.deletedCount} records`
      );
    } else {
      this.logger.log(`Helper queue event: Job ${job.id} completed`);
    }
  }

  @OnQueueEvent('failed')
  onQueueFailed(job: Job, err: Error) {
    this.logger.error(
      `Helper queue event: Job ${job.id} failed: ${err.message}`
    );
  }

  @OnQueueEvent('error')
  onQueueError(error: Error) {
    this.logger.error(`Helper queue error: ${error.message}`);
  }

  @OnQueueEvent('cleaned')
  onCleaned(jobs: string[], type: string) {
    this.logger.log(`Helper queue cleaned ${jobs.length} ${type} jobs`);
  }
}
