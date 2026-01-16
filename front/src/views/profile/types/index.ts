import { FileItem } from '@/components/FileUpload/types';
import { UserResponseDto } from '@/store/api';

export type UserProfileViewModel = { avatar: FileItem } & Omit<
  UserResponseDto,
  'avatar'
>;
