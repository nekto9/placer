import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { eventBus } from '@/context/shared/eventBus';
import { getKeycloakInstance } from '@/context/shared/keycloak';
import { MIN_VALIDITY_KEYCLOAK } from '@/tools/constants';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_HOST,
  prepareHeaders: async (headers) => {
    const keycloak = await getKeycloakInstance();

    if (keycloak?.token) {
      headers.set('Authorization', `Bearer ${keycloak.token}`);
    }

    return headers;
  },
  // Кастомный сериализатор параметров
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      const value = params[key];
      if (Array.isArray(value)) {
        // Для каждого элемента массива добавляем отдельный параметр
        value.forEach((item) => {
          // 'key' для ?ids=1&ids=2
          // или `${key}[]` для ?ids[]=1&ids[]=2
          searchParams.append(key, item);
        });
      } else if (value !== undefined) {
        searchParams.append(key, value);
      }
    }
    return searchParams.toString();
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const keycloak = await getKeycloakInstance();
    try {
      const refreshed = await keycloak.updateToken(MIN_VALIDITY_KEYCLOAK);
      if (refreshed) {
        // Retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Failed to refresh token - redirect to login
        keycloak?.login();
      }
    } catch {
      keycloak?.login();
    }
  } else if (typeof result.error?.status === 'number') {
    eventBus.emit('apiError', { error: result.error });
  }

  return result;
};

/** Шаблон апи */
export const templateApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
