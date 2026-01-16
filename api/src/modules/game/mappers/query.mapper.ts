import {
  GameStatus,
  GameUserRole,
  GameUserStatus,
  Prisma,
} from '@/prismaClient';
import { stringToDate } from '@/tools/dateUtils';
import { CreateGameDto, UpdateGameDto } from '../dto';

export const mapCreateGameDtoToPrismaInput = (
  placeId: string,
  dto: CreateGameDto
): Prisma.GameCreateInput => {
  const { createUserId, sportId, status: _status, ...rest } = dto;
  return {
    ...rest,
    date: stringToDate(dto.date),
    place: { connect: { id: placeId } },
    sport: sportId ? { connect: { id: sportId } } : undefined,
    status: GameStatus.DRAFT,
    users: {
      create: {
        role: GameUserRole.CREATOR,
        status: GameUserStatus.CONFIRMED,
        user: { connect: { id: createUserId } },
      },
    },
  };
};

export const mapUpdateGameDtoToPrismaInput = (
  dto: UpdateGameDto
): Prisma.GameUpdateInput => {
  const { placeId, sportId, gameUsers: _gameUsers, ...rest } = dto;
  return {
    ...rest,
    date: stringToDate(dto.date),
    place: { connect: { id: placeId } },
    sport: sportId ? { connect: { id: sportId } } : undefined,
  };
};
