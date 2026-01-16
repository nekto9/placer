import mitt from 'mitt';

export interface ApiErrorType {
  status?: number;
  data?: {
    message?: string;
  };
  message?: string;
}

/** Событие для уведомлений об ошибках api */
export interface ApiErrorEvent {
  error: ApiErrorType;
  context?: {
    retryable?: boolean;
    retry?: () => void;
  };
}

/** Событие для системы уведомлений */
export interface AppNotificationEvent {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

/** Событие смены роута/вьюхи */
export interface ViewPageData {
  title: string;
  backLink?: string;
}

// Карта всех событий в приложении
export type EventMap = {
  apiError: ApiErrorEvent;
  appNotification: AppNotificationEvent;
  pendingStart: string;
  pendingStop: string;
  pageData: ViewPageData;
};

// Создаем типизированный event bus
const eventBus = mitt<EventMap>();

export const useMitt = () => {
  return eventBus;
};

// Экспортируем сам eventBus для прямого использования
export { eventBus };
