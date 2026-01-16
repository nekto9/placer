import { Sport } from '@/prismaClient';
import { SportResponseDto } from '../dto';

export const mapSportToResponseDto = (sport: Sport): SportResponseDto => {
  return {
    id: sport.id,
    name: sport.name,
  };
};
