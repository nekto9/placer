/** Названия задач в очереди email */
export const EMAIL_JOB_NAMES = {
  /** Отправка приглашений
   * Получатели: приглашенные юзеры */
  SEND_INVITE: 'sendInvite',

  /** Запрос на участие
   * Получатель: создатель игры */
  SEND_JOIN_REQUEST: 'sendJoinRequest',

  /** Различные оповещения */
  SEND_MESSAGE: 'sendMessage',
} as const;

/** Названия очередей */
export const QUEUE_NAMES = {
  EMAIL: 'email',
} as const;

/** Статусы результата email */
export const EMAIL_RESULT_STATUSES = {
  SENT: 'sent',
  FAILED: 'failed',
} as const;

export const registerEmailQueueSettings = {
  name: QUEUE_NAMES.EMAIL,
  // Опции конкретной очереди
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100, // Сохраняем только последние 100 успешных задач
    removeOnFail: 50, // Сохраняем только последние 50 неудачных задач
    delay: 0, // Задержка перед выполнением (мс)
  },
};
