import { UserResponseDto } from '@/store/api';
import { UserViewModel } from '../types';

export const convertToViewModel = (data: UserResponseDto): UserViewModel => {
  return { ...data };
};
