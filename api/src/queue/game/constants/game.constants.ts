/** Названия задач в очереди game */
export const GAME_JOB_NAMES = {
  /** Удаление черновика задачи
   * фоновая задача без уведомлений */
  CHECK_GAME_FOR_RESET: 'checkGameForReset',

  /** Отправка приглашений
   * Получатели: приглашенные юзеры */
  SEND_INVITE: 'sendInvite',

  /** Принятие приглашения
   * Получатель: создатель игры */
  SEND_ACCEPT_INVITE: 'sendAcceptInvite',

  /** Отклонение приглашения
   * Получатель: создатель игры */
  SEND_REJECT_INVITE: 'sendRejectInvite',

  /** Запрос на участие
   * Получатель: создатель игры */
  SEND_JOIN_REQUEST: 'sendJoinRequest',

  /** Принятие запроса на участие
   * Получатель: приглашенный юзер */
  SEND_JOIN_ALLOW: 'sendJoinAllow',

  /** Отклонение запроса на участие
   * Получатель: приглашенный юзер */
  SEND_JOIN_DECLINE: 'sendJoinDecline',

  /** Присоединение нового участника
   * Получатель: создатель игры */
  SEND_JOIN_NOTIFICATION: 'sendJoinNotification',

  /** Выход юзера из участников
   * Получатель: создатель игры */
  SEND_UNJOIN_NOTIFICATION: 'sendUnJoinNotification',
} as const;

/** Названия очередей */
export const GAME_QUEUE_NAMES = {
  GAME: 'game',
} as const;

/** Статусы результата обновления игры */
export const GAME_JOB_RESULT_STATUSES = {
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

/** Приоритеты задач */
export const GAME_JOB_PRIORITIES = {
  HIGH: 1, // Критичные обновления (статус игры)
  NORMAL: 2, // Обычные обновления (время, место)
  LOW: 3, // Синхронизация данных
} as const;

export const registerGameQueueSettings = {
  name: GAME_QUEUE_NAMES.GAME,
  // Конфигурация очереди для обновления игр
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100, // Сохраняем последние 100 успешных задач
    removeOnFail: 50, // Сохраняем последние 50 неудачных задач
    delay: 0,
  },
};

/** Задержка перед удалением незаполненной игры */
export const DELAY_FOR_GAME_DELETE = 15 * 60 * 1000; // 15 минут
