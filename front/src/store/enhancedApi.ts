import { api } from './api';
import {
  getGameEndpoints,
  getManageEndpoints,
  getPlaceEndpoints,
  getScheduleEndpoints,
  getUploaderEndpoints,
  getUsersEndpoints,
} from './endpoints';
import { getTags } from './utils';

// https://redux-toolkit.js.org/rtk-query/api/created-api/code-splitting#enhanceendpoints

const placeEndpoints = getPlaceEndpoints(api);
const scheduleEndpoints = getScheduleEndpoints(api);
const gameEndpoints = getGameEndpoints(api);
const usersEndpoints = getUsersEndpoints(api);
const uploaderEndpoints = getUploaderEndpoints();
const manageEndpoints = getManageEndpoints(api);

const endpoints = {
  ...placeEndpoints,
  ...scheduleEndpoints,
  ...gameEndpoints,
  ...usersEndpoints,
  ...uploaderEndpoints,
  ...manageEndpoints,
};

export const enhancedApi = api.enhanceEndpoints({
  addTagTypes: getTags(endpoints),
  endpoints,
});
