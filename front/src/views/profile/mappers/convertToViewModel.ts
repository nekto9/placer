import { UserResponseDto } from '@/store/api';
import { parseEmptyStringToUndefined } from '@/tools/parse';
import { UserProfileViewModel } from '../types';

export const convertToViewModel = (
  data: UserResponseDto
): UserProfileViewModel => {
  const { email, username, avatar, ...rest } = data;

  return {
    ...rest,
    email: parseEmptyStringToUndefined(email) || '',
    username: parseEmptyStringToUndefined(username) || '',
    avatar: avatar
      ? {
          id: avatar.fileId,
          url: avatar.fileUrl,
          status: 'uploaded',
          type: 'image/',
        }
      : undefined,
  };
};
