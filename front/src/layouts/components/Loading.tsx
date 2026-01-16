import { useEffect, useMemo, useState } from 'react';
import { Loader, Overlay } from '@gravity-ui/uikit';
import { eventBus } from '@/context/shared/eventBus';
import { newGuid } from '@/tools/guid';

/** Отображение лоадера поверх контента */
export const LoadingOverlay = () => {
  // Очередь лоадеров
  const [queue, setQueue] = useState<string[]>([]);

  const startLoadingHandler = (key: string) => {
    setQueue((prev) => [...prev.filter((o) => o !== key), key]);
  };

  const stopLoadingHandler = (key: string) => {
    setQueue((prev) => prev.filter((o) => o !== key));
  };

  useEffect(() => {
    eventBus.on('pendingStart', startLoadingHandler);
    eventBus.on('pendingStop', stopLoadingHandler);

    return () => {
      eventBus.off('pendingStart', startLoadingHandler);
      eventBus.off('pendingStop', stopLoadingHandler);
      setQueue([]);
    };
  }, []);

  // Если очередь не пустая, то отображаем лоадер
  return queue.length ? (
    <Overlay visible background="float" className="overlay--loading">
      <Loader />
    </Overlay>
  ) : null;
};

interface LoadingProps {
  isActive?: boolean;
  loadingKey?: string;
}

/** Добавление лоадера в очередь */
export const Loading = (props: LoadingProps): null => {
  const queueKey = useMemo(
    () => props.loadingKey || newGuid(),
    [props.loadingKey]
  );

  useEffect(() => {
    if (queueKey && props.isActive !== false) {
      eventBus.emit('pendingStart', queueKey);
    }

    if (queueKey && props.isActive === false) {
      eventBus.emit('pendingStop', queueKey);
    }

    return () => {
      if (queueKey) {
        eventBus.emit('pendingStop', queueKey);
      }
    };
  }, [queueKey, props.isActive]);

  return null;
};
