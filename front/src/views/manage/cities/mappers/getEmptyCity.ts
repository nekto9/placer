import { CityViewModel } from '../types';

export const getEmptyCity = (): CityViewModel => {
  const resultViewData: CityViewModel = {
    id: '',
    name: '',
  };

  return resultViewData;
};
