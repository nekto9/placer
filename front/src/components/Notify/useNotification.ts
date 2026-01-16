import { useCallback } from 'react';
import { ToastProps, useToaster } from '@gravity-ui/uikit';

export interface NotificationOptions {
  title?: string;
  message: string;
  autoHiding?: number;
  showRetry?: boolean;
  onRetry?: () => void;
}

/**
 * Хук для отображения уведомлений с использованием Gravity UI Toast
 * Обертка над Gravity UI Toast для унифицированной работы с уведомлениями
 */
export const useNotification = () => {
  const toaster = useToaster();

  /**
   * Базовая функция для создания уведомления с использованием только Gravity UI Toast типов
   */
  const createNotification = useCallback(
    (theme: ToastProps['theme'], options: NotificationOptions) => {
      const {
        title,
        message,
        autoHiding = 5000,
        showRetry = false,
        onRetry,
      } = options;

      const toastConfig: ToastProps = {
        name: `${theme}_${Date.now()}`,
        title,
        content: message,
        theme,
        autoHiding,
      };

      // Добавляем кнопку повтора если требуется
      if (showRetry && onRetry) {
        toastConfig.actions = [
          {
            label: 'Повторить',
            onClick: onRetry,
          },
        ];
      }

      toaster.add(toastConfig);
    },
    [toaster]
  );

  /**
   * Показать уведомление об ошибке
   */
  const showError = useCallback(
    (options: NotificationOptions) => {
      createNotification('danger', {
        title: 'Ошибка',
        ...options,
      });
    },
    [createNotification]
  );

  /**
   * Показать предупреждение
   */
  const showWarning = useCallback(
    (options: Omit<NotificationOptions, 'showRetry' | 'onRetry'>) => {
      createNotification('warning', {
        title: 'Предупреждение',
        autoHiding: 4000,
        ...options,
      });
    },
    [createNotification]
  );

  /**
   * Показать информационное сообщение
   */
  const showInfo = useCallback(
    (options: Omit<NotificationOptions, 'showRetry' | 'onRetry'>) => {
      createNotification('info', {
        title: 'Информация',
        autoHiding: 3000,
        ...options,
      });
    },
    [createNotification]
  );

  /**
   * Показать сообщение об успехе
   */
  const showSuccess = useCallback(
    (options: Omit<NotificationOptions, 'showRetry' | 'onRetry'>) => {
      createNotification('success', {
        title: 'Успешно',
        autoHiding: 3000,
        ...options,
      });
    },
    [createNotification]
  );

  return {
    showError,
    showWarning,
    showInfo,
    showSuccess,
  };
};
