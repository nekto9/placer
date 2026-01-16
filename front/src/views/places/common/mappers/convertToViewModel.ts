import { PlaceResponseDto } from '@/store/api';
import { PlaceViewModel } from '../types';

export const convertToViewModel = (data: PlaceResponseDto): PlaceViewModel => {
  return {
    ...data,
    isFree: data.isFree.toString(),
    isIndoor: data.isIndoor.toString(),
    sports: data.sports || [],
    cityId: data.city ? [data.city.id] : [],
    cityName: data.city ? data.city.name : '',
    coverFiles:
      data.covers?.map((cover) => ({
        id: cover.fileId,
        url: cover.fileUrl,
        status: 'uploaded',
        type: 'image/',
      })) || [],
  };
};
