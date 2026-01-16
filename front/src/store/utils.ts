import { reactHooksModuleName } from '@reduxjs/toolkit/dist/query/react';
import {
  Api,
  BaseQueryApi,
  coreModuleName,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query';

export type ApiType = Api<
  (
    args: unknown,
    api: BaseQueryApi,
    extraOptions: Record<string, unknown>
  ) => Promise<
    QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
  >,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {},
  'api',
  never,
  typeof coreModuleName | typeof reactHooksModuleName
>;

/** Т.к. при редактировании объекта бэк нам возвращает измененный объект,
 * мы в деталях самого объекта подменяем данные вместо перезапроса к серверу */
export const updateHandler = (
  /** Эндпоинт, который нужно обновить */
  detailsEndpointName: string,
  /** Ключи аргументов, которые нужно извлечь из запроса, который вызывает обновление кеша для эндпоинта */
  argKeys: string | string[],
  /** Ссылка на api */
  api: ApiType,
  /**
   * Если имена аргументов не совпадают, то можно переопределить
   * Пример: запрос на добавление площадки в избранное в качестве идентификатора передает аргумент `favoriteId`.
   * При выполнении этого запроса нам нужно обновить кеш для эндпоинта `getPlaceById`, у которого аргумент идентификатора `id`.
   * Тогда в argKeys нужно передать `favoriteId`, а в mappedArgKeys нужно передать `id`.
   * Если аргументы совпадают, то передавать mappedArgKeys не нужно.
   */
  mappedArgKeys?: string | string[]
) => {
  const extractArgs = (
    queryArg: Record<string, unknown>
  ): Record<string, unknown> => {
    const extractedArgs: Record<string, unknown> = {};
    if (Array.isArray(argKeys)) {
      argKeys.forEach((key, idx) => {
        const resultKey = mappedArgKeys?.[idx] ?? key;
        extractedArgs[resultKey] = queryArg[key];
      });
    } else {
      const resultKey = String(mappedArgKeys ?? argKeys);
      extractedArgs[resultKey] = queryArg[argKeys];
    }
    return extractedArgs;
  };

  return async (
    queryArg: Record<string, unknown>,
    {
      dispatch,
      queryFulfilled,
    }: {
      dispatch: (action: unknown) => void;
      queryFulfilled: Promise<{ data: unknown }>;
    }
  ) => {
    try {
      const { data } = await queryFulfilled;
      const args = extractArgs(queryArg);

      dispatch(
        api.util.updateQueryData(
          detailsEndpointName as keyof ApiType['endpoints'],
          args as never, // Cast to never to satisfy TypeScript
          (draft: Record<string, unknown>) => {
            Object.assign(draft, data);
          }
        )
      );
    } catch (error) {
      console.error('Failed to update query data:', error);
    }
  };
};

/** Достаем все теги из всех эндпоинтов, чтобы сформировать список для enhancedApi */
export const getTags = (
  endpoints: Record<
    string,
    { invalidatesTags?: string[]; providesTags?: string[] }
  >
) => {
  const result = new Set<string>();
  Object.entries(endpoints).forEach((el) => {
    el[1].invalidatesTags?.forEach((t) => result.add(t));
    el[1].providesTags?.forEach((t) => result.add(t));
  });

  return Array.from(result);
};
