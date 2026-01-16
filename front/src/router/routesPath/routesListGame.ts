import { RoutesConst } from '../routeConstant';

// /games
const mainGameURL = `${RoutesConst.ROOT}${RoutesConst.GAMES}`;

/** Урлы роутов для игр */
export const RoutesListGame = {
  // #region All
  /** Список ближайших игр всех юзеров */
  getGamesList: () => mainGameURL,

  /** Список всех игр всех юзеров */
  getAllGamesList: () => `${mainGameURL}/${RoutesConst.ALL}`,

  /** Список прошлых игр всех юзеров */
  getPastGamesList: () => `${mainGameURL}/${RoutesConst.PAST}`,
  // #endregion

  // #region Personal
  /** Список ближайших игр авторизованного юзера */
  getPersonalGamesList: () => `${mainGameURL}/${RoutesConst.PERSONAL}`,

  /** Список всех игр авторизованного юзера */
  getPersonalAllGamesList: () =>
    `${mainGameURL}/${RoutesConst.PERSONAL}/${RoutesConst.ALL}`,

  /** Список прошлых игр авторизованного юзера */
  getPersonalPastGamesList: () =>
    `${mainGameURL}/${RoutesConst.PERSONAL}/${RoutesConst.PAST}`,

  // #endregion

  /** Детали игры */
  getGameDetails: (gameId: string) => `${mainGameURL}/${gameId}`,

  /** Редактирование игры */
  getGameEdit: (gameId: string) =>
    `${mainGameURL}/${gameId}/${RoutesConst.EDIT}`,

  /** Добавление игры */
  getGameAdd: () => `${mainGameURL}/${RoutesConst.ADD}`,

  // #region Actions

  /** Принятие приглашения */
  getGameAcceptInvite: (gameId: string) => `${mainGameURL}/accept/${gameId}`,

  /** Отклонение приглашения */
  getGameRejectInvite: (gameId: string) => `${mainGameURL}/reject/${gameId}`,

  /** Принятие запроса на участие */
  getGameJoinAllow: (gameId: string) => `${mainGameURL}/allow/${gameId}`,

  /** Отклонение запроса на участие */
  getGameJoinDecline: (gameId: string) => `${mainGameURL}/decline/${gameId}`,

  // #endregion
};
