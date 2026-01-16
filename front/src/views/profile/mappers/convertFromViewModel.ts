import { UserUpdateDto } from '@/store/api';
import { UserProfileViewModel } from '../types';

export const convertToUpdateDto = (
  data: UserProfileViewModel
): UserUpdateDto => {
  const dtoData: UserUpdateDto = {
    username: data.username,
    avatar: data.avatar?.id,
  };

  return dtoData;
};
