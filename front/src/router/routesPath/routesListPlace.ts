import { RoutesConst } from '../routeConstant';

// /places
const mainPlacesURL = `${RoutesConst.ROOT}${RoutesConst.PLACES}`;

/** Урлы роутов для площадок */
export const RoutesListPlace = {
  /** Список площадок */
  getPlacesList: () => mainPlacesURL,

  /** Детали площадки */
  getPlaceDetails: (placeId: string) => `${mainPlacesURL}/${placeId}`,

  /** Редактирование площадки */
  getPlaceEdit: (placeId: string) =>
    `${mainPlacesURL}/${placeId}/${RoutesConst.EDIT}`,

  /** Добавление площадки */
  getPlaceAdd: () => `${mainPlacesURL}/${RoutesConst.ADD}`,

  /** Расписания площадки */
  getPlaceSchedules: (placeId: string) =>
    `${mainPlacesURL}/${placeId}/${RoutesConst.SCHEDULES}`,

  /** Шаблоны расписаний площадки */
  getPlaceScheduleTemplates: (placeId: string) =>
    `${mainPlacesURL}/${placeId}/${RoutesConst.SCHEDULE_TEMPLATES}`,

  /** Добавление расписания */
  getScheduleAdd: (placeId: string) =>
    `${mainPlacesURL}/${placeId}/${RoutesConst.SCHEDULES}/${RoutesConst.ADD}`,

  /** Редактирование расписания */
  getScheduleEdit: (placeId: string, scheduleId: string) =>
    `${mainPlacesURL}/${placeId}/${RoutesConst.SCHEDULES}/${scheduleId}/${RoutesConst.EDIT}`,
};
