import { ApiType, updateHandler } from '../utils';

export const getGameEndpoints = (api: ApiType) => ({
  getGames: {
    providesTags: ['getGames'],
  },
  updateGame: {
    invalidatesTags: ['getGames', 'getPlaceSlots', 'getUserGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  createGameForSlot: {
    invalidatesTags: ['getGames', 'getPlaceSlots', 'getUserGames'],
  },
  createGameForCustomSlot: {
    invalidatesTags: ['getGames', 'getPlaceSlots', 'getUserGames'],
  },
  deleteGame: {
    invalidatesTags: ['getGames', 'getPlaceSlots', 'getUserGames'],
  },
  acceptInvite: {
    invalidatesTags: ['getGames', 'getUserGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  rejectInvite: {
    invalidatesTags: ['getGames', 'getUserGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  requesrJoin: {
    invalidatesTags: ['getGames', 'getUserGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  unJoin: {
    invalidatesTags: ['getGames', 'getUserGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  declineJoin: {
    invalidatesTags: ['getGames', 'getUserGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
  allowJoin: {
    invalidatesTags: ['getGames', 'getUserGames'],
    onQueryStarted: updateHandler('getGameById', 'id', api),
  },
});
