import { ApiType, updateHandler } from '../utils';

export const getManageEndpoints = (api: ApiType) => ({
  getSports: {
    providesTags: ['getSports'],
  },
  updateSport: {
    invalidatesTags: ['getPlaces', 'getSports'],
    onQueryStarted: updateHandler('getSportById', 'id', api),
  },
  createSport: {
    invalidatesTags: ['getSports'],
  },
  deleteSport: {
    invalidatesTags: ['getSports'],
  },

  getCities: {
    providesTags: ['getCities'],
  },
  updateCity: {
    invalidatesTags: ['getPlaces', 'getCities'],
    onQueryStarted: updateHandler('getCityById', 'id', api),
  },
  createCity: {
    invalidatesTags: ['getCities'],
  },
  deleteCity: {
    invalidatesTags: ['getCities'],
  },
});
