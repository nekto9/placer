import { City } from '@/prismaClient';
import { CityResponseDto } from '../dto';

export const mapCityToResponseDto = (city: City): CityResponseDto => {
  return {
    id: city.id,
    name: city.name,
  };
};
