/** Названия задач в очереди helper */
export const HELPER_JOB_NAMES = {
  CLEANUP_USER_TG_LINKER: 'cleanupUserTgLinker',
} as const;

export const HELPER_JOB_IDS = {
  CLEANUP_USER_TG_LINKER: (userId: string) =>
    `cleanup-user-tg-linker-${userId}`,
} as const;

/** Названия очередей */
export const HELPER_QUEUE_NAMES = {
  HELPER: 'helper',
} as const;

/** Статусы результата задач helper */
export const HELPER_JOB_RESULT_STATUSES = {
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

/** Приоритеты задач */
export const HELPER_JOB_PRIORITIES = {
  HIGH: 1, // Критичные задачи очистки
  NORMAL: 2, // Обычные задачи очистки
  LOW: 3, // Фоновые задачи очистки
} as const;

export const registerHelperQueueSettings = {
  name: HELPER_QUEUE_NAMES.HELPER,
  // Конфигурация очереди для вспомогательных задач
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 50, // Сохраняем последние 50 успешных задач
    removeOnFail: 25, // Сохраняем последние 25 неудачных задач
    delay: 0,
  },
};

/** Время жизни записей UserTgLinker в миллисекундах (5 минут) */
export const USER_TG_LINKER_TTL = 5 * 60 * 1000; // 5 минут
