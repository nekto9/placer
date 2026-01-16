import { ApiType, updateHandler } from '../utils';

/** Площадки */
export const getPlaceEndpoints = (api: ApiType) => ({
  getPlaces: {
    providesTags: ['getPlaces'],
  },
  getPlaceSchedules: {
    providesTags: ['getPlaceSchedules'],
  },
  /** Сетка расписаний */
  getPlaceSlots: {
    providesTags: ['getPlaceSlots'],
  },
  updatePlace: {
    invalidatesTags: ['getPlaces', 'getGames'],
    onQueryStarted: updateHandler('getPlaceById', 'id', api),
  },
  // Возможно здесь нужно сбрсывать getPlaceById, т.к. там есть список расписаний
  updateRankPlaceSchedules: {
    invalidatesTags: ['getPlaceSchedules', 'getPlaceSlots'],
    onQueryStarted: updateHandler('getScheduleById', 'id', api),
  },
  createPlace: {
    invalidatesTags: ['getPlaces'],
  },
  deletePlace: {
    invalidatesTags: ['getPlaces'],
  },
  getPlaceFavorites: {
    providesTags: ['getPlaceFavorites'],
  },
  addPlaceToFavorites: {
    invalidatesTags: ['getPlaceFavorites', 'getPlaces'],
    onQueryStarted: updateHandler('getPlaceById', 'favoriteId', api, 'id'),
  },
  removePlaceFromFavorites: {
    invalidatesTags: ['getPlaceFavorites', 'getPlaces'],
    onQueryStarted: updateHandler('getPlaceById', 'favoriteId', api, 'id'),
  },
});
