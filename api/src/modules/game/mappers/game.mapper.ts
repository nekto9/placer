import { $Enums, User } from '@/prismaClient';
import { dateToString } from '@/tools/dateUtils';
import { GameResponseDto } from '../dto';
import { GameMetaDto } from '../dto/gameMeta.dto';
import { GameExtended } from '../types/gameExtended';

export const mapGameToResponseDto = (
  game: GameExtended,
  /** Если нужны метеданные, нужно сюда передать юзера */
  userRequest?: Omit<
    User,
    | 'createdAt'
    | 'updatedAt'
    | 'telegramId'
    | 'avatar'
    | 'keycloakId'
    | 'email'
    | 'idx'
  >
): GameResponseDto => {
  const resultGame: GameResponseDto = {
    id: game.id,
    date: dateToString(game.date),
    createdAt: game.createdAt.toISOString(),
    timeStart: game.timeStart,
    timeEnd: game.timeEnd,
    status: game.status,
    level: game.level,
    countMembersMax: game.countMembersMax,
    countMembersMin: game.countMembersMin,
    description: game.description,
    requestMode: game.requestMode,
    place: {
      id: game.place.id,
      name: game.place.name,
      description: game.place.description,
      isFree: game.place.isFree,
      isIndoor: game.place.isIndoor,
      latitude: game.place.latitude,
      longitude: game.place.longitude,
    },
    sport: game.sport
      ? {
          id: game.sport?.id,
          name: game.sport.name,
        }
      : undefined,
    gameUsers:
      game.users?.map((el) => ({
        userName: el.user?.username || '',
        userId: el.userId,
        role: el.role,
        status: el.status,
        avatar: el.user?.avatar || '',
      })) || [],
  };

  if (userRequest) {
    const currentGameUser = resultGame.gameUsers.find(
      (el) => el.userId === userRequest.id
    );

    // Критерии для прав добавим позже, пока права только у создателя
    const isCreator = currentGameUser?.role === $Enums.GameUserRole.CREATOR;

    const meta: GameMetaDto = {
      canEdit: isCreator,
      canJoin:
        !currentGameUser &&
        resultGame.requestMode !== $Enums.RequestMode.PRIVATE,
      isMember: !!currentGameUser,
      memberStatus: currentGameUser?.status,
    };

    resultGame.meta = meta;
  }

  return resultGame;
};
