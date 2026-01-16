import { CreatePlaceDto, UpdatePlaceDto } from '@/store/api';
import { parseBool } from '@/tools/parse';
import { PlaceViewModel } from '../types';

export const convertToCreateDto = (data: PlaceViewModel): CreatePlaceDto => {
  const dtoData: CreatePlaceDto = {
    name: data.name,
    description: data.description,
    isIndoor: parseBool(data.isIndoor),
    isFree: parseBool(data.isFree),
    sports: data.sports.map((sport) => sport.id),
    city: data.cityId[0],
    latitude: data.latitude,
    longitude: data.longitude,
    covers: data.coverFiles?.map((el) => el.id),
  };

  return dtoData;
};

export const convertToUpdateDto = (data: PlaceViewModel): UpdatePlaceDto => {
  const dtoData: UpdatePlaceDto = {
    name: data.name,
    description: data.description,
    isIndoor: parseBool(data.isIndoor),
    isFree: parseBool(data.isFree),
    sports: data.sports.map((sport) => sport.id),
    city: data.cityId[0],
    latitude: data.latitude,
    longitude: data.longitude,
    covers:
      data.coverFiles
        ?.filter((el) => el.status !== 'deleted')
        .map((el) => el.id) || [],
  };

  return dtoData;
};
