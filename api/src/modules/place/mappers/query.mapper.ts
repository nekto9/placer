import { UserResponseDto } from '@/modules/user/dto';
import { Prisma } from '@/prismaClient';
import { CreatePlaceDto, UpdatePlaceDto } from '../dto';

/** Создание площадки */
export const mapCreatePlaceDtoToPrismaInput = (
  dto: CreatePlaceDto,
  creator: UserResponseDto
): Prisma.PlaceCreateInput => {
  const { sports: placeSports, covers: placeCovers, city, ...rest } = dto;
  const result = {
    ...rest,
    sports: { create: placeSports.map((el) => ({ sportId: el })) },
    city: { connect: { id: city } },
    owner: { connect: { id: creator.id } },
    covers: { create: placeCovers.map((el) => ({ id: el })) },
  };
  return result;
};

/** Обновление площадки */
export const mapUpdatePlaceDtoToPrismaInput = (
  dto: UpdatePlaceDto
): Prisma.PlaceUpdateInput => {
  const { sports: _placeSports, city, covers: _placeCovers, ...rest } = dto;
  const result: Prisma.PlaceUpdateInput = {
    ...rest,
    city: { connect: { id: city } },
    covers: {},
  };
  return result;
};
