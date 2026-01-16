/**
 * Генерирует уникальный ключ на основе текущего времени
 *
 * Создает строку из текущей даты и времени в ISO формате,
 * заменяя специальные символы на дефисы для использования
 * в качестве части идентификатора задачи в BullMQ.
 *
 * const jobId = `send-email-${userId}-${getDateTimeKey()}`;
 * // Результат: "send-email-user123-2024-03-15T10-30-45-123Z"
 */
export const getDateTimeKey = (): string => {
  return new Date().toISOString().replace(/[.,:]/gi, '-');
};
