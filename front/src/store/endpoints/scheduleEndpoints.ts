import { ApiType, updateHandler } from '../utils';

export const getScheduleEndpoints = (api: ApiType) => {
  return {
    updateSchedule: {
      invalidatesTags: ['getPlaceSlots', 'getPlaceSchedules'],
      onQueryStarted: updateHandler('getScheduleById', 'id', api),
    },
    createSchedule: {
      invalidatesTags: ['getPlaceSlots', 'getPlaceSchedules'],
    },
    deleteSchedule: {
      invalidatesTags: ['getPlaceSlots', 'getPlaceSchedules'],
    },
  };
};
