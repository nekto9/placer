import { FileItem } from '@/components/FileUpload/types';
import { PlaceResponseDto } from '@/store/api';

export type PlaceViewModel = {
  isIndoor: string;
  isFree: string;
  cityId: string[];
  cityName: string;
  coverFiles: FileItem[];
} & Omit<
  PlaceResponseDto,
  'isIndoor' | 'isFree' | 'combineSchedules' | 'city' | 'covers'
>;
