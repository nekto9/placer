import { ApiType, updateHandler } from '../utils';

export const getGameEndpoints = (api: ApiType) => ({
  getGames: {
    providesTags: ['getGames'],
  },
  updateGame: {
    invalidatesTags: ['getGames', 'getPlaceSlots'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  createGameForSlot: {
    invalidatesTags: ['getGames', 'getPlaceSlots'],
  },
  createGameForCustomSlot: {
    invalidatesTags: ['getGames', 'getPlaceSlots'],
  },
  deleteGame: {
    invalidatesTags: ['getGames', 'getPlaceSlots'],
  },
  acceptInvite: {
    invalidatesTags: ['getGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  rejectInvite: {
    invalidatesTags: ['getGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  requesrJoin: {
    invalidatesTags: ['getGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  unJoin: {
    invalidatesTags: ['getGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  declineJoin: {
    invalidatesTags: ['getGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  allowJoin: {
    invalidatesTags: ['getGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
});
