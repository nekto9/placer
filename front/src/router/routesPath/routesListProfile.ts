import { RoutesConst } from '../routeConstant';

// /profile
const mainProfileURL = `${RoutesConst.ROOT}${RoutesConst.PROFILE}`;

/** Урлы роутов для профиля пользователя */
export const RoutesListProfile = {
  /** Профиль юзера */
  getUserProfile: () => mainProfileURL,

  /** Редактирование профиля */
  getUserProfileEdit: () => `${mainProfileURL}/${RoutesConst.EDIT}`,

  /** Список игр с участием юзера */
  getUserProfileGamesList: (
    timeFrame?: RoutesConst.UPCOMING | RoutesConst.PAST
  ) => (timeFrame ? `${mainProfileURL}/${timeFrame}` : mainProfileURL),
};
