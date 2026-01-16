import { UpdateSportDto } from '@/store/api';
import { SportViewModel } from '../types';

export const convertToUpdateDto = (data: SportViewModel): UpdateSportDto => {
  const dtoData: UpdateSportDto = {
    name: data.name,
  };

  return dtoData;
};
