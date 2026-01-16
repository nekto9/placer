import { PlaceViewModel } from '../types';

export const getEmptyPlace = (): PlaceViewModel => {
  const resultViewData: PlaceViewModel = {
    id: '',
    name: '',
    description: '',
    isFree: 'false',
    isIndoor: 'false',
    coverFiles: [],
    sports: [],
    cityId: [],
    cityName: '',
    latitude: NaN,
    longitude: NaN,
  };

  return resultViewData;
};
