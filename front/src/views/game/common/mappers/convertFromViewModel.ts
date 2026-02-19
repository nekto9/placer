import {
  GameLevel,
  GameStatus,
  GameUserDto,
  GameUserRole,
  GameUserStatus,
  UpdateGameDto,
} from "@/store/api";
import { DATE_SERV_FORMAT } from "@/tools/constants";
import { parseEmptyNumberToUndefined } from "@/tools/parse";
import {
  GameStep1Data,
  GameStep2Data,
  GameUserViewModel,
  GameViewModel,
} from "../types";

export const convertToGameUserUpdateDto = (
  data: GameUserViewModel
): GameUserDto => {
  return {
    status: (data.status[0] as GameUserStatus) || GameUserStatus.Invited,
    role: data.role || GameUserRole.Member,
    userId: data.userId,
    userName: data.userName,
  };
};

export const convertToGameUpdateDto = (data: GameViewModel): UpdateGameDto => {
  const {
    meta: _mata,
    level,
    placeId,
    sportId,
    date,
    gameUsers,
    countMembersMax,
    countMembersMin,
    ...rest
  } = data;
  const dtoData: UpdateGameDto = {
    ...rest,
    placeId: placeId[0],
    sportId: sportId[0],
    date: date.format(DATE_SERV_FORMAT),
    gameUsers: gameUsers.map(convertToGameUserUpdateDto) || [],
    status: GameStatus.Aproved,
    level: (level[0] as GameLevel) || GameLevel.Easy,
    countMembersMax: parseEmptyNumberToUndefined(countMembersMax),
    countMembersMin: parseEmptyNumberToUndefined(countMembersMin),
    requestMode: data.requestMode,
  };

  return dtoData;
};

/**
 * Объединяет данные шага 1, шага 2 и оригинальные данные в полную модель игры
 * @param originalData - оригинальные данные игры
 * @param step1Data - данные первого шага (площадка, дата, время)
 * @param step2Data - данные второго шага (остальные поля)
 * @returns полная модель игры
 */
export const mergeStepDataToViewModel = (
  originalData: GameViewModel,
  step1Data: GameStep1Data,
  step2Data: GameStep2Data
): GameViewModel => {
  return {
    ...originalData,
    ...step2Data,
    placeId: step1Data.placeId,
    date: step1Data.date,
    timeStart: step1Data.timeStart,
    timeEnd: step1Data.timeEnd,
  };
};
