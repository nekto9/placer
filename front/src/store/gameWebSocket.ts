import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

/** Типы событий WebSocket */
export type GameWebSocketEvent =
  | 'game:reserved'
  | 'game:released'
  | 'game:updated';

/** Данные события бронирования */
export interface GameReservedData {
  gameId: string;
  date: string;
  timeStart: number;
  timeEnd: number;
}

/** Данные события освобождения */
export interface GameReleasedData {
  gameId: string;
  date: string;
}

/** Данные события обновления */
export interface GameUpdatedData {
  gameId: string;
  date: string;
  timeStart: number;
  timeEnd: number;
  status: string;
}

/** Маппинг типов событий */
export interface GameWebSocketEvents {
  'game:reserved': GameReservedData;
  'game:released': GameReleasedData;
  'game:updated': GameUpdatedData;
}

/** Данные для подключения к WebSocket */
export interface WebSocketOptions {
  /** URL WebSocket сервера */
  url: string;
  /** JWT токен для аутентификации */
  token?: string;
  /** Автоматически подключаться при монтировании */
  autoConnect?: boolean;
}

/** Публичный API хука */
export interface UseGameWebSocketReturn {
  /** Подключён ли сокет */
  connected: boolean;
  /** Подключиться к серверу */
  connect: () => void;
  /** Отключиться от серверу */
  disconnect: () => void;
  /** Подписаться на события площадки */
  subscribeToPlace: (placeId: string) => void;
  /** Отписаться от событий площадки */
  unsubscribeFromPlace: (placeId: string) => void;
  /** Подписаться на событие */
  onEvent: <T extends GameWebSocketEvent>(
    event: T,
    callback: (data: GameWebSocketEvents[T]) => void
  ) => void;
  /** Отписаться от события */
  offEvent: <T extends GameWebSocketEvent>(
    event: T,
    callback: (data: GameWebSocketEvents[T]) => void
  ) => void;
}

/**
 * Хук для подключения к WebSocket Gateway игр
 *
 * Предоставляет real-time обновления о бронировании и изменении игр
 */
export const useGameWebSocket = ({
  url,
  token,
  autoConnect = true,
}: WebSocketOptions): UseGameWebSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  /** Подключение к серверу */
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    socketRef.current = io(`${url}/games`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      setConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
    });

    socketRef.current.on('connect_error', (error: Error) => {
      console.error('[WebSocket] Connection error:', error.message);
    });
  }, [url, token]);

  /** Отключение от сервера */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
    }
  }, []);

  /** Подписка на события площадки */
  const subscribeToPlace = useCallback((placeId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('subscribe:place', { placeId });
    } else {
      console.warn('[WebSocket] Not connected, cannot subscribe');
    }
  }, []);

  /** Отписка от событий площадки */
  const unsubscribeFromPlace = useCallback((placeId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('unsubscribe:place', { placeId });
    }
  }, []);

  /** Подписка на событие */
  const onEvent = useCallback(
    <T extends GameWebSocketEvent>(
      event: T,

      callback: (data: GameWebSocketEvents[T]) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback as never);
      }
    },
    []
  );

  /** Отписка от события */
  const offEvent = useCallback(
    <T extends GameWebSocketEvent>(
      event: T,

      callback: (data: GameWebSocketEvents[T]) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.off(event, callback as never);
      }
    },
    []
  );

  /** Автоматическое подключение при монтировании */
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    connected,
    connect,
    disconnect,
    subscribeToPlace,
    unsubscribeFromPlace,
    onEvent,
    offEvent,
  };
};
