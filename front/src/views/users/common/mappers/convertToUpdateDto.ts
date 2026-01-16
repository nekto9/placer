import { UserUpdateDto } from '@/store/api';
import { UserViewModel } from '../types';

export const convertToUpdateDto = (data: UserViewModel): UserUpdateDto => {
  const dtoData: UserUpdateDto = {
    username: data.username,
  };

  return dtoData;
};
