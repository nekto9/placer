import { CreateScheduleDto, UpdateScheduleDto } from '@/store/api';
import { DATE_SERV_FORMAT } from '@/tools/constants';
import { dateTimeConvertToMinutes } from '@/tools/dateTools';
import {
  parseEmptyNumberToUndefined,
  parseEmptyStringToUndefined,
} from '@/tools/parse';
import { ScheduleViewModel } from '../types';

export const convertToCreateScheduleDto = (
  placeId: string,
  data: ScheduleViewModel
): CreateScheduleDto => {
  const dtoData: CreateScheduleDto = {
    ...data,
    placeId,
    name: data.name,
    repeatMode: data.repeatMode[0],
    workTimeMode: data.workTimeMode[0],
    status: data.status[0],
    rank: parseEmptyNumberToUndefined(data.rank),
    repeatStep: data.repeatStep,
    startDate: data.startDate.format(DATE_SERV_FORMAT),
    stopDate: data.stopDate.format(DATE_SERV_FORMAT),

    maxDurationHours: parseEmptyNumberToUndefined(data.maxDurationHours?.[0]),
    maxDurationMinutes: parseEmptyNumberToUndefined(
      data.maxDurationMinutes?.[0]
    ),
    minDurationHours: parseEmptyNumberToUndefined(data.minDurationHours?.[0]),
    minDurationMinutes: parseEmptyNumberToUndefined(
      data.minDurationMinutes?.[0]
    ),
    timeStart: parseEmptyNumberToUndefined(data.timeStart),
    timeSlots: data.timeSlots.map((slot) => ({
      id: parseEmptyStringToUndefined(slot.id) || '',
      timeStart: dateTimeConvertToMinutes(slot.timeStart),
      timeEnd: dateTimeConvertToMinutes(slot.timeEnd),
    })),
  };

  return dtoData;
};

export const convertToUpdateScheduleDto = (
  data: ScheduleViewModel
): UpdateScheduleDto => {
  const dtoData: UpdateScheduleDto = {
    ...data,
    repeatMode: data.repeatMode[0],
    workTimeMode: data.workTimeMode[0],
    status: data.status[0],
    rank: parseEmptyNumberToUndefined(data.rank),
    repeatStep: data.repeatStep,
    startDate: data.startDate.format(DATE_SERV_FORMAT),
    stopDate: data.stopDate.format(DATE_SERV_FORMAT),

    maxDurationHours: parseEmptyNumberToUndefined(data.maxDurationHours?.[0]),
    maxDurationMinutes: parseEmptyNumberToUndefined(
      data.maxDurationMinutes?.[0]
    ),
    minDurationHours: parseEmptyNumberToUndefined(data.minDurationHours?.[0]),
    minDurationMinutes: parseEmptyNumberToUndefined(
      data.minDurationMinutes?.[0]
    ),
    timeStart: parseEmptyNumberToUndefined(data.timeStart),
    timeSlots: data.timeSlots.map((slot) => ({
      id: parseEmptyStringToUndefined(slot.id) || '',
      timeStart: dateTimeConvertToMinutes(slot.timeStart),
      timeEnd: dateTimeConvertToMinutes(slot.timeEnd),
    })),
  };

  return dtoData;
};
