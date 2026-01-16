import { SportViewModel } from '../types';

export const getEmptySport = (): SportViewModel => {
  const resultViewData: SportViewModel = {
    id: '',
    name: '',
  };

  return resultViewData;
};
