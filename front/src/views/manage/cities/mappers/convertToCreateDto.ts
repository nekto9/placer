import { CreateCityDto } from '@/store/api';
import { CityViewModel } from '../types';

export const convertToCreateDto = (data: CityViewModel): CreateCityDto => {
  const dtoData: CreateCityDto = {
    name: data.name,
  };

  return dtoData;
};
