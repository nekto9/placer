import { useReducer } from 'react';

export const useRerender = () => {
  return useReducer(() => +new Date(), 0)[1];
};
