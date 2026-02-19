import { RoutesConst } from "../routeConstant";

// /profile
const mainProfileURL = `${RoutesConst.ROOT}${RoutesConst.PROFILE}`;

/** Урлы роутов для профиля пользователя */
export const RoutesListProfile = {
  /** Профиль юзера */
  getUserProfile: () => mainProfileURL,

  /** Редактирование профиля */
  getUserProfileEdit: () => `${mainProfileURL}/${RoutesConst.EDIT}`,
};
