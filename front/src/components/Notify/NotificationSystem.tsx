import React from 'react';
import {
  ApiErrorEvent,
  AppNotificationEvent,
  eventBus,
} from '@/context/shared/eventBus';
import { useNotification } from './useNotification';

/**
 * Компонент для автоматического отображения ошибок API и общих уведомлений
 */
export const ApiErrorHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showError, showWarning, showInfo, showSuccess } = useNotification();

  React.useEffect(() => {
    // Слушаем глобальные события ошибок API через mitt
    const handleApiError = (data: ApiErrorEvent) => {
      const { error, context } = data;

      let message = 'Произошла ошибка при выполнении запроса';
      let title = 'Ошибка API';
      let isWarning = false;

      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error;
        switch (apiError.status) {
          case 400:
            message = 'Некорректные данные запроса';
            title = 'Ошибка валидации';
            break;
          case 401:
            message = 'Необходима авторизация';
            title = 'Требуется вход в систему';
            break;
          case 403:
            message = 'Недостаточно прав для выполнения операции';
            title = 'Доступ запрещен';
            break;
          case 404:
            message = 'Запрашиваемый ресурс не найден';
            title = 'Ресурс не найден';
            isWarning = true;
            break;
          case 409:
            message = 'Конфликт данных. Возможно, ресурс уже существует';
            title = 'Конфликт данных';
            isWarning = true;
            break;
          case 422:
            message = 'Данные не прошли валидацию на сервере';
            title = 'Ошибка валидации';
            break;
          case 429:
            message = 'Слишком много запросов. Попробуйте позже';
            title = 'Превышен лимит запросов';
            isWarning = true;
            break;
          case 500:
            message = 'Внутренняя ошибка сервера';
            title = 'Ошибка сервера';
            break;
          case 502:
          case 503:
          case 504:
            message = 'Сервис временно недоступен. Попробуйте позже';
            title = 'Сервис недоступен';
            break;
          default:
            message = apiError.data?.message || apiError.message || message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const errorWithMessage = error;
        // Обработка сетевых ошибок
        if (
          errorWithMessage.message.includes('Network Error') ||
          errorWithMessage.message.includes('fetch')
        ) {
          message = 'Проблемы с сетевым соединением';
          title = 'Ошибка сети';
        } else {
          message = errorWithMessage.message;
        }
      }

      // Показываем предупреждение для менее критичных ошибок
      if (isWarning) {
        showWarning({
          title,
          message,
        });
      } else {
        showError({
          title,
          message,
          showRetry: context?.retryable,
          onRetry: context?.retry,
          autoHiding: context?.retryable ? 7000 : 5000, // Больше времени если есть кнопка повтора
        });
      }
    };

    // Слушаем общие события уведомлений через mitt
    const handleAppNotification = (data: AppNotificationEvent) => {
      const { type, message, title, showRetry, onRetry } = data;

      switch (type) {
        case 'success':
          showSuccess({ title, message });
          break;
        case 'error':
          showError({ title, message, showRetry, onRetry });
          break;
        case 'warning':
          showWarning({ title, message });
          break;
        case 'info':
          showInfo({ title, message });
          break;
        default:
          console.warn('Unknown notification type:', type);
      }
    };

    // Подписываемся на события через mitt
    eventBus.on('apiError', handleApiError);
    eventBus.on('appNotification', handleAppNotification);

    return () => {
      // Отписываемся от событий при размонтировании
      eventBus.off('apiError', handleApiError);
      eventBus.off('appNotification', handleAppNotification);
    };
  }, [showError, showWarning, showInfo, showSuccess]);

  return <>{children}</>;
};

/**
 * Утилитарная функция для отправки события ошибки API через mitt
 */
export const dispatchApiError = (
  error: unknown,
  context?: { retryable?: boolean; retry?: () => void }
) => {
  eventBus.emit('apiError', { error, context });
};

/**
 * Утилитарные функции для быстрого показа уведомлений
 * Используют mitt event bus для глобального управления уведомлениями
 */
export const NotificationUtils = {
  /**
   * Показать уведомление об успешном выполнении операции
   */
  showSuccess: (message: string, title?: string) => {
    eventBus.emit('appNotification', {
      type: 'success',
      message,
      title: title || 'Успешно',
    });
  },

  /**
   * Показать уведомление об ошибке
   */
  showError: (
    message: string,
    title?: string,
    options?: { showRetry?: boolean; onRetry?: () => void }
  ) => {
    eventBus.emit('appNotification', {
      type: 'error',
      message,
      title: title || 'Ошибка',
      ...options,
    });
  },

  /**
   * Показать предупреждение
   */
  showWarning: (message: string, title?: string) => {
    eventBus.emit('appNotification', {
      type: 'warning',
      message,
      title: title || 'Предупреждение',
    });
  },

  /**
   * Показать информационное сообщение
   */
  showInfo: (message: string, title?: string) => {
    eventBus.emit('appNotification', {
      type: 'info',
      message,
      title: title || 'Информация',
    });
  },
};
