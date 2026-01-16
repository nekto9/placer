import { CityResponseDto } from '@/store/api';
import { CityViewModel } from '../types';

export const convertToViewModel = (data: CityResponseDto): CityViewModel => {
  return { ...data };
};
