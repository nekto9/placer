import { useCallback } from 'react';

interface ErrorReportData {
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  userId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
}

/**
 * Хук для отправки ошибок в систему мониторинга
 * Предоставляет унифицированный способ логирования ошибок
 */
export const useErrorReporting = () => {
  /**
   * Отправка ошибки в систему мониторинга
   */
  const reportError = useCallback(
    async (error: Error | string, context?: Record<string, unknown>) => {
      const errorData: ErrorReportData = {
        message: typeof error === 'string' ? error : error.message,
        stack: typeof error === 'object' ? error.stack : undefined,
        context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        // userId можно получить из контекста аутентификации
        userId: getCurrentUserId(),
      };

      // Логируем в консоль для разработки
      console.error('Error reported:', errorData);

      try {
        // В production здесь будет реальный API endpoint для отправки ошибок
        // await fetch('/api/errors', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(errorData),
        // });

        // Пока просто логируем
        console.warn('Error would be sent to monitoring system:', errorData);
      } catch (err) {
        console.error('Failed to send error to monitoring system:', err);
      }
    },
    []
  );

  /**
   * Отправка предупреждения в систему мониторинга
   */
  const reportWarning = useCallback(
    async (message: string, context?: Record<string, unknown>) => {
      const warningData = {
        level: 'warning',
        message,
        context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        userId: getCurrentUserId(),
      };

      console.warn('Warning reported:', warningData);

      try {
        // В production здесь будет реальный API endpoint
        // await fetch('/api/warnings', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(warningData),
        // });

        console.warn(
          'Warning would be sent to monitoring system:',
          warningData
        );
      } catch (err) {
        console.error('Failed to send warning to monitoring system:', err);
      }
    },
    []
  );

  /**
   * Отправка информационного сообщения в систему мониторинга
   */
  const reportInfo = useCallback(
    async (message: string, context?: Record<string, unknown>) => {
      const infoData = {
        level: 'info',
        message,
        context,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userId: getCurrentUserId(),
      };

      console.info('Info reported:', infoData);

      try {
        // В production здесь будет реальный API endpoint
        // await fetch('/api/info', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(infoData),
        // });

        console.warn('Info would be sent to monitoring system:', infoData);
      } catch (err) {
        console.error('Failed to send info to monitoring system:', err);
      }
    },
    []
  );

  return {
    reportError,
    reportWarning,
    reportInfo,
  };
};

/**
 * Получение ID текущего пользователя
 * В будущем можно интегрировать с контекстом аутентификации
 */
const getCurrentUserId = (): string | undefined => {
  // Здесь можно получить ID пользователя из localStorage, контекста или другого источника
  // Пока возвращаем undefined
  return undefined;
};
