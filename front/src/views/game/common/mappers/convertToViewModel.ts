import { dateTime } from '@gravity-ui/date-utils';
import {
  GameResponseDto,
  GameUserDto,
  GameUserRole,
  GameUserStatus,
} from '@/store/api';
import { parseEmptyString } from '@/tools/parse';
import { GameUserViewModel, GameViewModel } from '../types';

/** Модель игрока для игры */
export const convertGameUserToViewModel = (
  data: GameUserDto
): GameUserViewModel => {
  return {
    status: [data.status || GameUserStatus.Invited],
    userName: data.userName,
    userId: data.userId,
    role: data.role || GameUserRole.Member,
  };
};

/** Модель игры */
export const convertGameToViewModel = (
  data: GameResponseDto
): GameViewModel => {
  return {
    ...data,
    placeId: [data.place.id],
    sportId: data.sport ? [data.sport.id] : [],
    date: data.date ? dateTime({ input: data.date }) : dateTime(),
    gameUsers: data.gameUsers.map(convertGameUserToViewModel),
    level: [data.level],
    requestMode: data.requestMode,
    countMembersMax: parseEmptyString(data.countMembersMax),
    countMembersMin: parseEmptyString(data.countMembersMin),
    description: parseEmptyString(data.description),
  };
};
