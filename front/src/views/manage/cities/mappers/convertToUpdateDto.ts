import { UpdateCityDto } from '@/store/api';
import { CityViewModel } from '../types';

export const convertToUpdateDto = (data: CityViewModel): UpdateCityDto => {
  const dtoData: UpdateCityDto = {
    name: data.name,
  };

  return dtoData;
};
