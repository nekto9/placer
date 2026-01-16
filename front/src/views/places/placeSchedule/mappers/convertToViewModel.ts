import { dateTime } from '@gravity-ui/date-utils';
import { ScheduleResponseDto } from '@/store/api';
import { timeConvertToDateTime } from '@/tools/dateTools';
import { ScheduleViewModel } from '../types';

export const convertToScheduleViewModel = (
  data: ScheduleResponseDto
): ScheduleViewModel => {
  const viewData: ScheduleViewModel = {
    ...data,
    repeatMode: [data.repeatMode],
    startDate: data.startDate
      ? dateTime({ input: data.startDate })
      : dateTime(),
    stopDate: data.stopDate ? dateTime({ input: data.stopDate }) : dateTime(),

    workTimeMode: [data.workTimeMode],
    maxDurationHours: [String(data.maxDurationHours)],
    maxDurationMinutes: [String(data.maxDurationMinutes)],
    minDurationHours: [String(data.minDurationHours)],
    minDurationMinutes: [String(data.minDurationMinutes)],
    timeSlots: data.timeSlots.map((slot) => ({
      timeStart: timeConvertToDateTime(slot.timeStart),
      timeEnd: timeConvertToDateTime(slot.timeEnd),
      id: slot.id,
    })),
    status: [data.status],
  };

  return viewData;
};
