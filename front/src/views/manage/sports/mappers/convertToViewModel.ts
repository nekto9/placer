import { SportResponseDto } from '@/store/api';
import { SportViewModel } from '../types';

export const convertToViewModel = (data: SportResponseDto): SportViewModel => {
  return { ...data };
};
