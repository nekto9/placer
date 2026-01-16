import { CreateSportDto } from '@/store/api';
import { SportViewModel } from '../types';

export const convertToCreateDto = (data: SportViewModel): CreateSportDto => {
  const dtoData: CreateSportDto = {
    name: data.name,
  };

  return dtoData;
};
