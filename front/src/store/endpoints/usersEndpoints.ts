import { ApiType, updateHandler } from '../utils';

/** Пользователи */
export const getUsersEndpoints = (api: ApiType) => ({
  getUsers: {
    providesTags: ['getUsers'],
  },
  updateUser: {
    invalidatesTags: ['getUsers'],
    onQueryStarted: updateHandler('getUserById', 'id', api),
  },
  deleteUser: {
    invalidatesTags: ['getUsers'],
  },
  getUserFavorites: {
    providesTags: ['getUserFavorites'],
  },
  addUserToFavorites: {
    invalidatesTags: ['getUserFavorites', 'getUsers'],
    onQueryStarted: updateHandler('getUserById', 'favoriteId', api, 'id'),
  },
  removeUserFromFavorites: {
    invalidatesTags: ['getUserFavorites', 'getUsers'],
    onQueryStarted: updateHandler('getUserById', 'favoriteId', api, 'id'),
  },
  getUserGames: {
    providesTags: ['getUserGames'],
  },
});
