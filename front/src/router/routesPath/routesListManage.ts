import { RoutesConst } from '../routeConstant';

// /manage
const mainManageURL = `${RoutesConst.ROOT}${RoutesConst.MANAGE}`;

/** Урлы роутов для управоения */
export const RoutesListManage = {
  /** Страница управления */
  getManage: () => mainManageURL,

  /** Список видов спорта */
  getSportsList: () => `${mainManageURL}/${RoutesConst.SPORTS}`,

  getSportEdit: (id: string) =>
    `${mainManageURL}/${RoutesConst.SPORTS}/${id}/${RoutesConst.EDIT}`,

  getSportAdd: () =>
    `${mainManageURL}/${RoutesConst.SPORTS}/${RoutesConst.ADD}`,

  /** Список городов */
  getCitiesList: () => `${mainManageURL}/${RoutesConst.CITIES}`,

  getCityEdit: (id: string) =>
    `${mainManageURL}/${RoutesConst.CITIES}/${id}/${RoutesConst.EDIT}`,

  getCityAdd: () => `${mainManageURL}/${RoutesConst.CITIES}/${RoutesConst.ADD}`,
};
