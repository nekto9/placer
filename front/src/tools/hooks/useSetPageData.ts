import { useEffect } from 'react';
import { useMitt, ViewPageData } from '@/context/shared/eventBus';

export const useSetPageData = (data: ViewPageData) => {
  const mitt = useMitt();

  useEffect(() => mitt.emit('pageData', data), [mitt, data]);
};
