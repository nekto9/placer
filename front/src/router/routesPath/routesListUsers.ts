import { RoutesConst } from '../routeConstant';

// /users
const mainUsersURL = `${RoutesConst.ROOT}${RoutesConst.USERS}`;

/** Урлы роутов для списка пользователей */
export const RoutesListUsers = {
  /** Список пользователей */
  getUsersList: () => mainUsersURL,

  /** Избранные пользователи */
  getUsersFavorites: () => `${mainUsersURL}/favorites`,

  getUserDetails: (id: string) => `${mainUsersURL}/${id}`,

  getUserEdit: (id: string) => `${mainUsersURL}/${id}/${RoutesConst.EDIT}`,
};
