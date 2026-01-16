import { templateApi as api } from '../../openapi/templateApi';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    createPlace: build.mutation<CreatePlaceApiResponse, CreatePlaceApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/places`,
        method: 'POST',
        body: queryArg.createPlaceDto,
      }),
    }),
    getPlaces: build.query<GetPlacesApiResponse, GetPlacesApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/places`,
        params: {
          limit: queryArg.limit,
          page: queryArg.page,
        },
      }),
    }),
    getPlaceById: build.query<GetPlaceByIdApiResponse, GetPlaceByIdApiArg>({
      query: (queryArg) => ({ url: `/api/v1/places/${queryArg.id}` }),
    }),
    updatePlace: build.mutation<UpdatePlaceApiResponse, UpdatePlaceApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/places/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updatePlaceDto,
      }),
    }),
    deletePlace: build.mutation<DeletePlaceApiResponse, DeletePlaceApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/places/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    getPlaceSchedules: build.query<
      GetPlaceSchedulesApiResponse,
      GetPlaceSchedulesApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/places/${queryArg.id}/schedules` }),
    }),
    updateRankPlaceSchedules: build.mutation<
      UpdateRankPlaceSchedulesApiResponse,
      UpdateRankPlaceSchedulesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/places/${queryArg.id}/schedules`,
        method: 'PATCH',
        body: queryArg.body,
      }),
    }),
    getPlaceSlots: build.query<GetPlaceSlotsApiResponse, GetPlaceSlotsApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/places/${queryArg.id}/slots`,
        params: {
          startDate: queryArg.startDate,
          stopDate: queryArg.stopDate,
        },
      }),
    }),
    addPlaceToFavorites: build.mutation<
      AddPlaceToFavoritesApiResponse,
      AddPlaceToFavoritesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/places/favorites/${queryArg.favoriteId}`,
        method: 'POST',
      }),
    }),
    removePlaceFromFavorites: build.mutation<
      RemovePlaceFromFavoritesApiResponse,
      RemovePlaceFromFavoritesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/places/favorites/${queryArg.favoriteId}`,
        method: 'DELETE',
      }),
    }),
    getPlaceFavorites: build.query<
      GetPlaceFavoritesApiResponse,
      GetPlaceFavoritesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/places/favorites/list`,
        params: {
          text: queryArg.text,
          limit: queryArg.limit,
          page: queryArg.page,
        },
      }),
    }),
    getPlaceGames: build.query<GetPlaceGamesApiResponse, GetPlaceGamesApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/places/${queryArg.id}/games`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          startDate: queryArg.startDate,
          stopDate: queryArg.stopDate,
          timeframe: queryArg.timeframe,
        },
      }),
    }),
    createGameForSlot: build.mutation<
      CreateGameForSlotApiResponse,
      CreateGameForSlotApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.placeId}/slot/${queryArg.slotId}/${queryArg.date}`,
        method: 'POST',
      }),
    }),
    createGameForCustomSlot: build.mutation<
      CreateGameForCustomSlotApiResponse,
      CreateGameForCustomSlotApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.placeId}/customslot`,
        method: 'POST',
        body: queryArg.createGameDto,
      }),
    }),
    updateGame: build.mutation<UpdateGameApiResponse, UpdateGameApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateGameDto,
      }),
    }),
    deleteGame: build.mutation<DeleteGameApiResponse, DeleteGameApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    getGameById: build.query<GetGameByIdApiResponse, GetGameByIdApiArg>({
      query: (queryArg) => ({ url: `/api/v1/games/${queryArg.id}` }),
    }),
    getGames: build.query<GetGamesApiResponse, GetGamesApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/games`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          startDate: queryArg.startDate,
          stopDate: queryArg.stopDate,
          timeframe: queryArg.timeframe,
        },
      }),
    }),
    acceptInvite: build.mutation<AcceptInviteApiResponse, AcceptInviteApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.id}/accept`,
        method: 'PATCH',
      }),
    }),
    rejectInvite: build.mutation<RejectInviteApiResponse, RejectInviteApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.id}/reject`,
        method: 'PATCH',
      }),
    }),
    requestJoin: build.mutation<RequestJoinApiResponse, RequestJoinApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.id}/request`,
        method: 'PATCH',
      }),
    }),
    declineJoin: build.mutation<DeclineJoinApiResponse, DeclineJoinApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.id}/decline/${queryArg.userId}`,
        method: 'PATCH',
      }),
    }),
    allowJoin: build.mutation<AllowJoinApiResponse, AllowJoinApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.id}/allow/${queryArg.userId}`,
        method: 'PATCH',
      }),
    }),
    unJoin: build.mutation<UnJoinApiResponse, UnJoinApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.id}/unjoin`,
        method: 'PATCH',
      }),
    }),
    join: build.mutation<JoinApiResponse, JoinApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/games/${queryArg.id}/join`,
        method: 'PATCH',
      }),
    }),
    getUserById: build.query<GetUserByIdApiResponse, GetUserByIdApiArg>({
      query: (queryArg) => ({ url: `/api/v1/users/${queryArg.id}` }),
    }),
    updateUser: build.mutation<UpdateUserApiResponse, UpdateUserApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/users/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.userUpdateDto,
      }),
    }),
    linkAuthUser: build.mutation<LinkAuthUserApiResponse, LinkAuthUserApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/users`,
        method: 'POST',
        body: queryArg.userAuthLinkDto,
      }),
    }),
    getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/users`,
        params: {
          text: queryArg.text,
          limit: queryArg.limit,
          page: queryArg.page,
        },
      }),
    }),
    deepLink: build.mutation<DeepLinkApiResponse, DeepLinkApiArg>({
      query: () => ({ url: `/api/v1/users/deepLink`, method: 'POST' }),
    }),
    removeTgLink: build.mutation<RemoveTgLinkApiResponse, RemoveTgLinkApiArg>({
      query: () => ({ url: `/api/v1/users/removeTgLink`, method: 'PATCH' }),
    }),
    addUserToFavorites: build.mutation<
      AddUserToFavoritesApiResponse,
      AddUserToFavoritesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/users/favorites/${queryArg.favoriteId}`,
        method: 'POST',
      }),
    }),
    removeUserFromFavorites: build.mutation<
      RemoveUserFromFavoritesApiResponse,
      RemoveUserFromFavoritesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/users/favorites/${queryArg.favoriteId}`,
        method: 'DELETE',
      }),
    }),
    getUserFavorites: build.query<
      GetUserFavoritesApiResponse,
      GetUserFavoritesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/users/favorites/list`,
        params: {
          text: queryArg.text,
          limit: queryArg.limit,
          page: queryArg.page,
        },
      }),
    }),
    getUserGames: build.query<GetUserGamesApiResponse, GetUserGamesApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/users/${queryArg.id}/games`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          startDate: queryArg.startDate,
          stopDate: queryArg.stopDate,
          timeframe: queryArg.timeframe,
          memberStatuses: queryArg.memberStatuses,
        },
      }),
    }),
    getScheduleById: build.query<
      GetScheduleByIdApiResponse,
      GetScheduleByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/schedules/${queryArg.id}` }),
    }),
    updateSchedule: build.mutation<
      UpdateScheduleApiResponse,
      UpdateScheduleApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/schedules/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateScheduleDto,
      }),
    }),
    deleteSchedule: build.mutation<
      DeleteScheduleApiResponse,
      DeleteScheduleApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/schedules/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    createSchedule: build.mutation<
      CreateScheduleApiResponse,
      CreateScheduleApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/schedules`,
        method: 'POST',
        body: queryArg.createScheduleDto,
      }),
    }),
    createSport: build.mutation<CreateSportApiResponse, CreateSportApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/sports`,
        method: 'POST',
        body: queryArg.createSportDto,
      }),
    }),
    getSports: build.query<GetSportsApiResponse, GetSportsApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/sports`,
        params: {
          text: queryArg.text,
          limit: queryArg.limit,
          page: queryArg.page,
        },
      }),
    }),
    getSportById: build.query<GetSportByIdApiResponse, GetSportByIdApiArg>({
      query: (queryArg) => ({ url: `/api/v1/sports/${queryArg.id}` }),
    }),
    updateSport: build.mutation<UpdateSportApiResponse, UpdateSportApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/sports/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateSportDto,
      }),
    }),
    deleteSport: build.mutation<DeleteSportApiResponse, DeleteSportApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/sports/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    createCity: build.mutation<CreateCityApiResponse, CreateCityApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/cities`,
        method: 'POST',
        body: queryArg.createCityDto,
      }),
    }),
    getCities: build.query<GetCitiesApiResponse, GetCitiesApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/cities`,
        params: {
          text: queryArg.text,
          limit: queryArg.limit,
          page: queryArg.page,
        },
      }),
    }),
    getCityById: build.query<GetCityByIdApiResponse, GetCityByIdApiArg>({
      query: (queryArg) => ({ url: `/api/v1/cities/${queryArg.id}` }),
    }),
    updateCity: build.mutation<UpdateCityApiResponse, UpdateCityApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/cities/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.updateCityDto,
      }),
    }),
    deleteCity: build.mutation<DeleteCityApiResponse, DeleteCityApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/cities/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
    uploadAvatar: build.mutation<UploadAvatarApiResponse, UploadAvatarApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/upload/avatar`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    uploadCover: build.mutation<UploadCoverApiResponse, UploadCoverApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/upload/cover`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type CreatePlaceApiResponse = unknown;
export type CreatePlaceApiArg = {
  createPlaceDto: CreatePlaceDto;
};
export type GetPlacesApiResponse =
  /** status 200 Пагинированный список площадок */ PaginatedResponseDto & {
    items?: PlaceResponseDto[];
  };
export type GetPlacesApiArg = {
  /** Количество элементов на странице (по умолчанию 10, минимум 1, максимум 100) */
  limit?: number;
  /** Номер страницы (по умолчанию 1, минимум 1, максимум 10000) */
  page?: number;
};
export type GetPlaceByIdApiResponse =
  /** status 200 Найденная площадка */ PlaceResponseDto;
export type GetPlaceByIdApiArg = {
  /** ID площадки */
  id: string;
};
export type UpdatePlaceApiResponse =
  /** status 200 Обновлённая площадка */ PlaceResponseDto;
export type UpdatePlaceApiArg = {
  /** ID площадки */
  id: string;
  updatePlaceDto: UpdatePlaceDto;
};
export type DeletePlaceApiResponse =
  /** status 200 Площадка удалена */ PlaceResponseDto;
export type DeletePlaceApiArg = {
  /** ID площадки */
  id: string;
};
export type GetPlaceSchedulesApiResponse =
  /** status 200 Ok. */ ScheduleShortResponseDto[];
export type GetPlaceSchedulesApiArg = {
  /** ID площадки */
  id: string;
};
export type UpdateRankPlaceSchedulesApiResponse =
  /** status 200 Ok. */ ScheduleShortResponseDto[];
export type UpdateRankPlaceSchedulesApiArg = {
  /** ID площадки */
  id: string;
  body: UpdateScheduleRankDto[];
};
export type GetPlaceSlotsApiResponse =
  /** status 200 Список слотов */ GridScheduleResponseDto;
export type GetPlaceSlotsApiArg = {
  /** ID площадки */
  id: string;
  /** Начало диапазона */
  startDate: string;
  /** Конец диапазона */
  stopDate: string;
};
export type AddPlaceToFavoritesApiResponse =
  /** status 201 Площадка успешно добавлена в избранное */ PlaceResponseDto;
export type AddPlaceToFavoritesApiArg = {
  /** ID площадки для операций с избранным */
  favoriteId: string;
};
export type RemovePlaceFromFavoritesApiResponse =
  /** status 200 Площадка успешно удален из избранного */ PlaceResponseDto;
export type RemovePlaceFromFavoritesApiArg = {
  /** ID площадки для операций с избранным */
  favoriteId: string;
};
export type GetPlaceFavoritesApiResponse =
  /** status 200 Пагинированный список избранных площадок */ PaginatedResponseDto & {
    items?: PlaceResponseDto[];
  };
export type GetPlaceFavoritesApiArg = {
  /** Поисковый запрос для фильтрации результатов */
  text?: string;
  /** Количество элементов на странице (по умолчанию 10, минимум 1, максимум 100) */
  limit?: number;
  /** Номер страницы (по умолчанию 1, минимум 1, максимум 10000) */
  page?: number;
};
export type GetPlaceGamesApiResponse =
  /** status 200 Пагинированный список игр */ PaginatedResponseDto & {
    items?: GameResponseDto[];
  };
export type GetPlaceGamesApiArg = {
  /** ID площадки */
  id: string;
  /** Номер страницы (по умолчанию 1, минимум 1, максимум 10000) */
  page?: number;
  /** Количество элементов на странице (по умолчанию 10, минимум 1, максимум 100) */
  limit?: number;
  /** Начало диапазона */
  startDate?: string;
  /** Конец диапазона */
  stopDate?: string;
  /** Фильтр по датам игр */
  timeframe?: GameTimeFrame;
};
export type CreateGameForSlotApiResponse = /** status 201  */ GameResponseDto;
export type CreateGameForSlotApiArg = {
  /** ID площадки */
  placeId: string;
  /** ID слота */
  slotId: string;
  /** Дата брони */
  date: string;
};
export type CreateGameForCustomSlotApiResponse =
  /** status 201  */ GameResponseDto;
export type CreateGameForCustomSlotApiArg = {
  /** ID площадки */
  placeId: string;
  createGameDto: CreateGameDto;
};
export type UpdateGameApiResponse = /** status 200  */ GameResponseDto;
export type UpdateGameApiArg = {
  /** ID игры */
  id: string;
  updateGameDto: UpdateGameDto;
};
export type DeleteGameApiResponse = /** status 200  */ GameResponseDto;
export type DeleteGameApiArg = {
  /** ID игры */
  id: string;
};
export type GetGameByIdApiResponse = /** status 200  */ GameResponseDto;
export type GetGameByIdApiArg = {
  /** ID игры */
  id: string;
};
export type GetGamesApiResponse =
  /** status 200 Пагинированный список игр */ PaginatedResponseDto & {
    items?: GameResponseDto[];
  };
export type GetGamesApiArg = {
  /** Номер страницы (по умолчанию 1, минимум 1, максимум 10000) */
  page?: number;
  /** Количество элементов на странице (по умолчанию 10, минимум 1, максимум 100) */
  limit?: number;
  /** Начало диапазона */
  startDate?: string;
  /** Конец диапазона */
  stopDate?: string;
  /** Фильтр по датам игр */
  timeframe?: GameTimeFrame;
};
export type AcceptInviteApiResponse = /** status 200  */ GameResponseDto;
export type AcceptInviteApiArg = {
  /** ID игры */
  id: string;
};
export type RejectInviteApiResponse = /** status 200  */ GameResponseDto;
export type RejectInviteApiArg = {
  /** ID игры */
  id: string;
};
export type RequestJoinApiResponse = /** status 200  */ GameResponseDto;
export type RequestJoinApiArg = {
  /** ID игры */
  id: string;
};
export type DeclineJoinApiResponse = /** status 200  */ GameResponseDto;
export type DeclineJoinApiArg = {
  /** ID игры */
  id: string;
  /** ID пользователя */
  userId: string;
};
export type AllowJoinApiResponse = /** status 200  */ GameResponseDto;
export type AllowJoinApiArg = {
  /** ID игры */
  id: string;
  /** ID пользователя */
  userId: string;
};
export type UnJoinApiResponse = /** status 200  */ GameResponseDto;
export type UnJoinApiArg = {
  /** ID игры */
  id: string;
};
export type JoinApiResponse = /** status 200  */ GameResponseDto;
export type JoinApiArg = {
  /** ID игры */
  id: string;
};
export type GetUserByIdApiResponse =
  /** status 200 Пользователь */ UserResponseDto;
export type GetUserByIdApiArg = {
  /** ID пользователя */
  id: string;
};
export type UpdateUserApiResponse =
  /** status 200 Пользователь обновлен */ UserResponseDto;
export type UpdateUserApiArg = {
  /** ID пользователя */
  id: string;
  userUpdateDto: UserUpdateDto;
};
export type LinkAuthUserApiResponse =
  /** status 201 Пользователь привязан */ UserResponseDto;
export type LinkAuthUserApiArg = {
  userAuthLinkDto: UserAuthLinkDto;
};
export type GetUsersApiResponse =
  /** status 200 Пагинированный список пользователей */ PaginatedResponseDto & {
    items?: UserResponseDto[];
  };
export type GetUsersApiArg = {
  /** Поисковый запрос для фильтрации результатов */
  text?: string;
  /** Количество элементов на странице (по умолчанию 10, минимум 1, максимум 100) */
  limit?: number;
  /** Номер страницы (по умолчанию 1, минимум 1, максимум 10000) */
  page?: number;
};
export type DeepLinkApiResponse =
  /** status 200 deepLink отправлен */ DeepLinkDto;
export type DeepLinkApiArg = void;
export type RemoveTgLinkApiResponse =
  /** status 200 Связь удалена */ UserResponseDto;
export type RemoveTgLinkApiArg = void;
export type AddUserToFavoritesApiResponse =
  /** status 201 Пользователь успешно добавлен в избранное */ UserResponseDto;
export type AddUserToFavoritesApiArg = {
  /** ID пользователя для операций с избранным */
  favoriteId: string;
};
export type RemoveUserFromFavoritesApiResponse =
  /** status 200 Пользователь успешно удален из избранного */ UserResponseDto;
export type RemoveUserFromFavoritesApiArg = {
  /** ID пользователя для операций с избранным */
  favoriteId: string;
};
export type GetUserFavoritesApiResponse =
  /** status 200 Пагинированный список избранных пользователей */ PaginatedResponseDto & {
    items?: UserResponseDto[];
  };
export type GetUserFavoritesApiArg = {
  /** Поисковый запрос для фильтрации результатов */
  text?: string;
  /** Количество элементов на странице (по умолчанию 10, минимум 1, максимум 100) */
  limit?: number;
  /** Номер страницы (по умолчанию 1, минимум 1, максимум 10000) */
  page?: number;
};
export type GetUserGamesApiResponse =
  /** status 200 Пагинированный список игр */ PaginatedResponseDto & {
    items?: GameResponseDto[];
  };
export type GetUserGamesApiArg = {
  /** ID пользователя */
  id: string;
  /** Номер страницы (по умолчанию 1, минимум 1, максимум 10000) */
  page?: number;
  /** Количество элементов на странице (по умолчанию 10, минимум 1, максимум 100) */
  limit?: number;
  /** Начало диапазона */
  startDate?: string;
  /** Конец диапазона */
  stopDate?: string;
  /** Фильтр по датам игр */
  timeframe?: GameTimeFrame;
  /** Фильтр по статусам участников */
  memberStatuses?: GameUserStatus[];
};
export type GetScheduleByIdApiResponse = /** status 200  */ ScheduleResponseDto;
export type GetScheduleByIdApiArg = {
  /** ID шаблона */
  id: string;
};
export type UpdateScheduleApiResponse = /** status 200  */ ScheduleResponseDto;
export type UpdateScheduleApiArg = {
  /** ID шаблона */
  id: string;
  updateScheduleDto: UpdateScheduleDto;
};
export type DeleteScheduleApiResponse = /** status 200  */ ScheduleResponseDto;
export type DeleteScheduleApiArg = {
  /** ID шаблона */
  id: string;
};
export type CreateScheduleApiResponse = /** status 201  */ ScheduleResponseDto;
export type CreateScheduleApiArg = {
  createScheduleDto: CreateScheduleDto;
};
export type CreateSportApiResponse =
  /** status 201 Вид спорта успешно создан */ SportResponseDto;
export type CreateSportApiArg = {
  createSportDto: CreateSportDto;
};
export type GetSportsApiResponse =
  /** status 200 Список видов спорта */ PaginatedResponseDto & {
    items?: SportResponseDto[];
  };
export type GetSportsApiArg = {
  /** Поисковый запрос для фильтрации результатов */
  text?: string;
  /** Количество элементов на странице (по умолчанию 10, минимум 1, максимум 100) */
  limit?: number;
  /** Номер страницы (по умолчанию 1, минимум 1, максимум 10000) */
  page?: number;
};
export type GetSportByIdApiResponse =
  /** status 200 Вид спорта найден */ SportResponseDto;
export type GetSportByIdApiArg = {
  /** ID вида спорта */
  id: string;
};
export type UpdateSportApiResponse =
  /** status 200 Вид спорта успешно обновлен */ SportResponseDto;
export type UpdateSportApiArg = {
  /** ID вида спорта */
  id: string;
  updateSportDto: UpdateSportDto;
};
export type DeleteSportApiResponse = unknown;
export type DeleteSportApiArg = {
  /** ID вида спорта */
  id: string;
};
export type CreateCityApiResponse =
  /** status 201 Город успешно создан */ CityResponseDto;
export type CreateCityApiArg = {
  createCityDto: CreateCityDto;
};
export type GetCitiesApiResponse =
  /** status 200 Список городов */ PaginatedResponseDto & {
    items?: CityResponseDto[];
  };
export type GetCitiesApiArg = {
  /** Поисковый запрос для фильтрации результатов */
  text?: string;
  /** Количество элементов на странице (по умолчанию 10, минимум 1, максимум 100) */
  limit?: number;
  /** Номер страницы (по умолчанию 1, минимум 1, максимум 10000) */
  page?: number;
};
export type GetCityByIdApiResponse =
  /** status 200 Город найден */ CityResponseDto;
export type GetCityByIdApiArg = {
  /** ID города */
  id: string;
};
export type UpdateCityApiResponse =
  /** status 200 Город успешно обновлен */ CityResponseDto;
export type UpdateCityApiArg = {
  /** ID города */
  id: string;
  updateCityDto: UpdateCityDto;
};
export type DeleteCityApiResponse = unknown;
export type DeleteCityApiArg = {
  /** ID города */
  id: string;
};
export type UploadAvatarApiResponse = /** status 200  */ string;
export type UploadAvatarApiArg = {
  /** Файл для загрузки */
  body: {
    /** Файл для загрузки */
    avatar?: Blob;
    /** Id файла для загрузки */
    fileId?: string;
  };
};
export type UploadCoverApiResponse = /** status 200  */ string[];
export type UploadCoverApiArg = {
  /** Файлы для загрузки */
  body: {
    /** Файлы для загрузки */
    cover?: Blob[];
    /** id файлов для загрузки */
    fileIds?: string[];
  };
};
export type FileItemDto = {
  /** Id файла */
  fileId: string;
  /** Публичный url файла */
  fileUrl: string;
};
export type SportResponseDto = {
  /** ID вида спорта */
  id: string;
  /** Название вида спорта */
  name: string;
};
export type CityResponseDto = {
  /** ID города */
  id: string;
  /** Название города */
  name: string;
};
export type PlaceMetaDto = {
  /** Права на редактирование */
  canEdit: boolean;
  /** Флаг избранной площадки по отношению к автору запроса */
  isFavorite: boolean;
};
export type PlaceResponseDto = {
  /** ID площадки */
  id: string;
  /** Название площадки */
  name: string;
  /** Описание площадки */
  description: string;
  /** Обложки площадки */
  covers: FileItemDto[];
  /** Виды спорта площадки */
  sports: SportResponseDto[];
  /** Город площадки */
  city: CityResponseDto;
  /** Широта */
  latitude: number;
  /** Долгота */
  longitude: number;
  /** Флаг крытой площадки (true - крытая, false - открытая) */
  isIndoor: boolean;
  /** Флаг бесплатной площадки (true - бесплатная, false - платная) */
  isFree: boolean;
  /** Метаданные */
  meta?: PlaceMetaDto;
};
export type CreatePlaceDto = {
  /** Название площадки */
  name: string;
  /** Описание площадки */
  description: string;
  /** Флаг крытой площадки (true - крытая, false - открытая) */
  isIndoor: boolean;
  /** Флаг бесплатной площадки (true - бесплатная, false - платная) */
  isFree: boolean;
  /** Виды спорта площадки */
  sports: string[];
  /** Фотографии площадки (id файлов) */
  covers?: string[];
  /** Город площадки */
  city: string;
  /** Широта */
  latitude: number;
  /** Долгота */
  longitude: number;
};
export type PaginationMeta = {
  /** Общее количество элементов в коллекции */
  total: number;
  /** Номер текущей страницы */
  page: number;
  /** Количество элементов на текущей странице */
  limit: number;
  /** Общее количество страниц */
  pages: number;
};
export type PaginatedResponseDto = {
  /** Массив элементов текущей страницы */
  items: any[];
  /** Метаданные пагинации (информация о страницах) */
  meta: PaginationMeta;
};
export type UpdatePlaceDto = {
  /** Название площадки */
  name?: string;
  /** Описание площадки */
  description?: string;
  /** Флаг крытой площадки (true - крытая, false - открытая) */
  isIndoor?: boolean;
  /** Флаг бесплатной площадки (true - бесплатная, false - платная) */
  isFree?: boolean;
  /** Виды спорта площадки */
  sports: string[];
  /** Фотографии площадки (id файлов) */
  covers?: string[];
  /** Город площадки */
  city: string;
  /** Широта */
  latitude: number;
  /** Долгота */
  longitude: number;
};
export type ScheduleShortResponseDto = {
  /** ID расписания */
  id: string;
  /** ID площадки */
  placeId: string;
  /** Дата начала действия расписания */
  startDate: string;
  /** Дата окончания действия расписания */
  stopDate: string;
  /** Название расписания */
  name: string;
  /** Вес расписания (чем меньше цифра, тем выше приоритет) */
  rank: number;
  /** Статус расписания */
  status: ScheduleStatus;
};
export type UpdateScheduleRankDto = {
  /** ID расписания */
  id: string;
  /** Вес расписания (чем меньше цифра, тем выше приоритет) */
  rank: number;
};
export type TimeSlotResponseDto = {
  /** ID временного слота */
  id: string;
  /** Время начала слота (в минутах от начала дня) */
  timeStart: number;
  /** Время окончания слота (в минутах от начала дня) */
  timeEnd: number;
};
export type GameUserDto = {
  /** ID пользователя */
  userId: string;
  /** Имя пользователя */
  userName: string;
  /** Роль игрока в игре */
  role: GameUserRole;
  /** Статус участия игрока в игре */
  status: GameUserStatus;
};
export type GameMetaDto = {
  /** Права на редактирование */
  canEdit: boolean;
  /** Права на участие */
  canJoin: boolean;
  /** Текущий юзер в списке участников */
  isMember: boolean;
  /** Статус участника */
  memberStatus: GameUserStatus;
};
export type GameResponseDto = {
  /** ID периода */
  id: string;
  /** Площадка */
  place: PlaceResponseDto;
  /** Вид спорта */
  sport?: SportResponseDto;
  /** Время начала */
  timeStart: number;
  /** Время окончания */
  timeEnd: number;
  /** Дата */
  date: string;
  /** Дата создания */
  createdAt: string;
  /** Статус */
  status: GameStatus;
  /** Участники игры */
  gameUsers: GameUserDto[];
  /** Уровень сложности игры игры */
  level: GameLevel;
  /** Минимальное количество участников */
  countMembersMin: number;
  /** Максимальное количество участников */
  countMembersMax: number;
  /** Комментарий к игре */
  description: string;
  /** Режим набора участников */
  requestMode: RequestMode;
  /** Метаданные */
  meta?: GameMetaDto;
};
export type GridDayResponseDto = {
  /** ID расписания */
  id: string;
  /** Дата дня расписания */
  date: string;
  /** Название расписания */
  scheduleName: string;
  /** Тип рабочего времени площадки */
  workTimeMode: WorkTimeMode;
  /** Фиксированные временные слоты для данного дня */
  timeSlots: TimeSlotResponseDto[];
  /** Игры, запланированные на данный день */
  games: GameResponseDto[];
};
export type GridScheduleResponseDto = {
  /** Дата начала диапазона расписания */
  startDate: string;
  /** Дата окончания диапазона расписания */
  stopDate: string;
  /** Дни с расписаниями и играми в указанном диапазоне */
  days: GridDayResponseDto[];
};
export type CreateGameDto = {
  /** ID вида спорта */
  sportId?: string;
  /** Время начала (в минутах от начала дня) */
  timeStart: number;
  /** Время окончания (в минутах от начала дня) */
  timeEnd: number;
  /** Дата игры */
  date: string;
  /** Статус игры */
  status: GameStatus;
  /** ID пользователя, создающего игру */
  createUserId?: string;
  /** Уровень сложности игры игры */
  level?: GameLevel;
  /** Минимальное количество участников */
  countMembersMin?: number;
  /** Максимальное количество участников */
  countMembersMax?: number;
};
export type UpdateGameDto = {
  /** ID игры */
  id: string;
  /** ID площадки */
  placeId?: string;
  /** ID вида спорта */
  sportId?: string;
  /** Время начала (в минутах от начала дня) */
  timeStart?: number;
  /** Время окончания (в минутах от начала дня) */
  timeEnd?: number;
  /** Дата игры */
  date?: string;
  /** Статус игры */
  status?: GameStatus;
  /** Участники игры */
  gameUsers?: GameUserDto[];
  /** Уровень сложности игры игры */
  level: GameLevel;
  /** Минимальное количество участников */
  countMembersMin?: number;
  /** Максимальное количество участников */
  countMembersMax?: number;
  /** Комментарий к игре */
  description?: string;
  /** Режим принятия запросов на участие */
  requestMode: RequestMode;
};
export type UserMetaDto = {
  /** Права на редактирование */
  canEdit: boolean;
  /** Флаг избранного пользователя по отношению к автору запроса */
  isFavorite: boolean;
};
export type UserResponseDto = {
  /** ID пользователя */
  id: string;
  /** Индекс пользователя */
  idx: number;
  /** ID учетной записи в Keycloak */
  keycloakId: string;
  /** Имя пользователя */
  username: string;
  /** Файл аватара */
  avatar?: FileItemDto;
  /** Электронная почта пользователя */
  email: string;
  /** ID пользователя в Telegram */
  telegramId?: string;
  /** Метаданные */
  meta?: UserMetaDto;
};
export type UserUpdateDto = {
  /** Имя пользователя */
  username: string;
  /** Аватар (id файла) */
  avatar?: string;
};
export type UserAuthLinkDto = {
  /** Имя пользователя */
  username?: string;
  /** ID учетной записи Keycloak (поле sub) */
  sub: string;
};
export type DeepLinkDto = {
  /** deepLink */
  deepLink: string;
};
export type ScheduleResponseDto = {
  /** ID места */
  placeId: string;
  /** ID расписания */
  id: string;
  /** Название шаблона */
  name: string;
  /** Тип повтора */
  repeatMode: CalendarRepeatMode;
  /** Дата начала */
  startDate: string;
  /** Дата окончания */
  stopDate: string;
  /** Шаг повтора */
  repeatStep: number;
  /** Январь */
  m1?: boolean;
  /** Февраль */
  m2?: boolean;
  /** Март */
  m3?: boolean;
  /** Апрель */
  m4?: boolean;
  /** Май */
  m5?: boolean;
  /** Июнь */
  m6?: boolean;
  /** Июль */
  m7?: boolean;
  /** Август */
  m8?: boolean;
  /** Сентябрь */
  m9?: boolean;
  /** Октябрь */
  m10?: boolean;
  /** Ноябрь */
  m11?: boolean;
  /** Декабрь */
  m12?: boolean;
  /** Первая неделя месяца */
  w1?: boolean;
  /** Вторая неделя месяца */
  w2?: boolean;
  /** Третья неделя месяца */
  w3?: boolean;
  /** Четвертая неделя месяца */
  w4?: boolean;
  /** Последняя неделя месяца */
  wLast?: boolean;
  /** Понедельник */
  wd1?: boolean;
  /** Вторник */
  wd2?: boolean;
  /** Среда */
  wd3?: boolean;
  /** Четверг */
  wd4?: boolean;
  /** Пятница */
  wd5?: boolean;
  /** Суббота */
  wd6?: boolean;
  /** Воскресенье */
  wd7?: boolean;
  /** 1 число */
  d1?: boolean;
  /** 2 число */
  d2?: boolean;
  /** 3 число */
  d3?: boolean;
  /** 4 число */
  d4?: boolean;
  /** 5 число */
  d5?: boolean;
  /** 6 число */
  d6?: boolean;
  /** 7 число */
  d7?: boolean;
  /** 8 число */
  d8?: boolean;
  /** 9 число */
  d9?: boolean;
  /** 10 число */
  d10?: boolean;
  /** 11 число */
  d11?: boolean;
  /** 12 число */
  d12?: boolean;
  /** 13 число */
  d13?: boolean;
  /** 14 число */
  d14?: boolean;
  /** 15 число */
  d15?: boolean;
  /** 16 число */
  d16?: boolean;
  /** 17 число */
  d17?: boolean;
  /** 18 число */
  d18?: boolean;
  /** 19 число */
  d19?: boolean;
  /** 20 число */
  d20?: boolean;
  /** 21 число */
  d21?: boolean;
  /** 22 число */
  d22?: boolean;
  /** 23 число */
  d23?: boolean;
  /** 24 число */
  d24?: boolean;
  /** 25 число */
  d25?: boolean;
  /** 26 число */
  d26?: boolean;
  /** 27 число */
  d27?: boolean;
  /** 28 число */
  d28?: boolean;
  /** 29 число */
  d29?: boolean;
  /** 30 число */
  d30?: boolean;
  /** 31 число */
  d31?: boolean;
  /** Последний день месяца */
  dLast?: boolean;
  /** Тип рабочего времени */
  workTimeMode?: WorkTimeMode;
  /** Минимальная длительность, часы */
  minDurationHours?: number;
  /** Минимальная длительность, минуты */
  minDurationMinutes?: number;
  /** Максимальная длительность, часы */
  maxDurationHours?: number;
  /** Максимальная длительность, минуты */
  maxDurationMinutes?: number;
  /** Возможное начало слота (минуты в часе) */
  timeStart?: number;
  /** Фиксированные сеансы/Рабочие часы */
  timeSlots?: TimeSlotResponseDto[];
  /** Статус */
  status: ScheduleStatus;
  /** Вес расписания (чем меньше цифра, тем выше приоритет) */
  rank: number;
};
export type UpdateScheduleDto = {
  /** ID площадки */
  placeId?: string;
  /** Название шаблона расписания */
  name?: string;
  /** Тип повтора расписания */
  repeatMode?: CalendarRepeatMode;
  /** Дата начала действия расписания */
  startDate?: string;
  /** Дата окончания действия расписания */
  stopDate?: string;
  /** Шаг повтора (например, каждые 2 недели) */
  repeatStep?: number;
  /** Январь */
  m1?: boolean;
  /** Февраль */
  m2?: boolean;
  /** Март */
  m3?: boolean;
  /** Апрель */
  m4?: boolean;
  /** Май */
  m5?: boolean;
  /** Июнь */
  m6?: boolean;
  /** Июль */
  m7?: boolean;
  /** Август */
  m8?: boolean;
  /** Сентябрь */
  m9?: boolean;
  /** Октябрь */
  m10?: boolean;
  /** Ноябрь */
  m11?: boolean;
  /** Декабрь */
  m12?: boolean;
  /** Первая неделя месяца */
  w1?: boolean;
  /** Вторая неделя месяца */
  w2?: boolean;
  /** Третья неделя месяца */
  w3?: boolean;
  /** Четвертая неделя месяца */
  w4?: boolean;
  /** Последняя неделя месяца */
  wLast?: boolean;
  /** Понедельник */
  wd1?: boolean;
  /** Вторник */
  wd2?: boolean;
  /** Среда */
  wd3?: boolean;
  /** Четверг */
  wd4?: boolean;
  /** Пятница */
  wd5?: boolean;
  /** Суббота */
  wd6?: boolean;
  /** Воскресенье */
  wd7?: boolean;
  /** Тип рабочего времени */
  workTimeMode?: WorkTimeMode;
  /** Минимальная длительность слота в часах */
  minDurationHours?: number;
  /** Минимальная длительность слота в минутах */
  minDurationMinutes?: number;
  /** Максимальная длительность слота в часах */
  maxDurationHours?: number;
  /** Максимальная длительность слота в минутах */
  maxDurationMinutes?: number;
  /** Возможное начало слота (минуты от начала дня) */
  timeStart?: number;
  /** Фиксированные временные слоты */
  timeSlots?: TimeSlotResponseDto[];
  /** Статус расписания */
  status?: ScheduleStatus;
  /** Вес расписания (чем меньше цифра, тем выше приоритет) */
  rank?: number;
};
export type CreateScheduleDto = {
  /** ID площадки */
  placeId: string;
  /** Название шаблона расписания */
  name: string;
  /** Тип повтора расписания */
  repeatMode: CalendarRepeatMode;
  /** Дата начала действия расписания */
  startDate: string;
  /** Дата окончания действия расписания */
  stopDate: string;
  /** Шаг повтора (например, каждые 2 недели) */
  repeatStep: number;
  /** Январь */
  m1?: boolean;
  /** Февраль */
  m2?: boolean;
  /** Март */
  m3?: boolean;
  /** Апрель */
  m4?: boolean;
  /** Май */
  m5?: boolean;
  /** Июнь */
  m6?: boolean;
  /** Июль */
  m7?: boolean;
  /** Август */
  m8?: boolean;
  /** Сентябрь */
  m9?: boolean;
  /** Октябрь */
  m10?: boolean;
  /** Ноябрь */
  m11?: boolean;
  /** Декабрь */
  m12?: boolean;
  /** Первая неделя месяца */
  w1?: boolean;
  /** Вторая неделя месяца */
  w2?: boolean;
  /** Третья неделя месяца */
  w3?: boolean;
  /** Четвертая неделя месяца */
  w4?: boolean;
  /** Последняя неделя месяца */
  wLast?: boolean;
  /** Понедельник */
  wd1?: boolean;
  /** Вторник */
  wd2?: boolean;
  /** Среда */
  wd3?: boolean;
  /** Четверг */
  wd4?: boolean;
  /** Пятница */
  wd5?: boolean;
  /** Суббота */
  wd6?: boolean;
  /** Воскресенье */
  wd7?: boolean;
  /** 1 число */
  d1?: boolean;
  /** 15 число */
  d15?: boolean;
  /** 31 число */
  d31?: boolean;
  /** Последний день месяца */
  dLast?: boolean;
  /** Тип рабочего времени */
  workTimeMode?: WorkTimeMode;
  /** Минимальная длительность слота в часах */
  minDurationHours?: number;
  /** Минимальная длительность слота в минутах */
  minDurationMinutes?: number;
  /** Максимальная длительность слота в часах */
  maxDurationHours?: number;
  /** Максимальная длительность слота в минутах */
  maxDurationMinutes?: number;
  /** Возможное начало слота (минуты от начала дня) */
  timeStart?: number;
  /** Фиксированные временные слоты */
  timeSlots?: TimeSlotResponseDto[];
  /** Статус расписания */
  status: ScheduleStatus;
  /** Вес расписания (чем меньше цифра, тем выше приоритет) */
  rank: number;
};
export type CreateSportDto = {
  /** Название вида спорта */
  name: string;
};
export type UpdateSportDto = {
  /** Название вида спорта */
  name?: string;
};
export type CreateCityDto = {
  /** Название города */
  name: string;
};
export type UpdateCityDto = {
  /** Название города */
  name?: string;
};
export enum ScheduleStatus {
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
}
export enum WorkTimeMode {
  Timegrid = 'TIMEGRID',
  Custom = 'CUSTOM',
  Daily = 'DAILY',
  None = 'NONE',
}
export enum GameStatus {
  Draft = 'DRAFT',
  Aproved = 'APROVED',
}
export enum GameUserRole {
  Member = 'MEMBER',
  Creator = 'CREATOR',
}
export enum GameUserStatus {
  Invited = 'INVITED',
  Confirmed = 'CONFIRMED',
  Rejected = 'REJECTED',
  Requested = 'REQUESTED',
  Allowed = 'ALLOWED',
  Declined = 'DECLINED',
}
export enum GameLevel {
  Easy = 'EASY',
  Medium = 'MEDIUM',
  Hard = 'HARD',
}
export enum RequestMode {
  Private = 'PRIVATE',
  Moderate = 'MODERATE',
  Public = 'PUBLIC',
}
export enum GameTimeFrame {
  Upcoming = 'UPCOMING',
  Past = 'PAST',
  All = 'ALL',
}
export enum CalendarRepeatMode {
  Once = 'ONCE',
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Calenddays = 'CALENDDAYS',
  Weekdays = 'WEEKDAYS',
}
export const {
  useCreatePlaceMutation,
  useGetPlacesQuery,
  useGetPlaceByIdQuery,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
  useGetPlaceSchedulesQuery,
  useUpdateRankPlaceSchedulesMutation,
  useGetPlaceSlotsQuery,
  useAddPlaceToFavoritesMutation,
  useRemovePlaceFromFavoritesMutation,
  useGetPlaceFavoritesQuery,
  useGetPlaceGamesQuery,
  useCreateGameForSlotMutation,
  useCreateGameForCustomSlotMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
  useGetGameByIdQuery,
  useGetGamesQuery,
  useAcceptInviteMutation,
  useRejectInviteMutation,
  useRequestJoinMutation,
  useDeclineJoinMutation,
  useAllowJoinMutation,
  useUnJoinMutation,
  useJoinMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useLinkAuthUserMutation,
  useGetUsersQuery,
  useDeepLinkMutation,
  useRemoveTgLinkMutation,
  useAddUserToFavoritesMutation,
  useRemoveUserFromFavoritesMutation,
  useGetUserFavoritesQuery,
  useGetUserGamesQuery,
  useGetScheduleByIdQuery,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useCreateScheduleMutation,
  useCreateSportMutation,
  useGetSportsQuery,
  useGetSportByIdQuery,
  useUpdateSportMutation,
  useDeleteSportMutation,
  useCreateCityMutation,
  useGetCitiesQuery,
  useGetCityByIdQuery,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useUploadAvatarMutation,
  useUploadCoverMutation,
} = injectedRtkApi;
