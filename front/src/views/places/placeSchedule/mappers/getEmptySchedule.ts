import { CalendarRepeatMode, ScheduleStatus, WorkTimeMode } from '@/store/api';
import { ScheduleViewModel, TimeSlotViewModel } from '../types';

export const getEmptySchedule = (placeId: string): ScheduleViewModel => {
  const resultViewData: ScheduleViewModel = {
    placeId,
    name: '',
    repeatMode: [CalendarRepeatMode.Weekdays],
    startDate: null,
    stopDate: null,
    repeatStep: 1,

    m1: false,
    m2: false,
    m3: false,
    m4: false,
    m5: false,
    m6: false,
    m7: false,
    m8: false,
    m9: false,
    m10: false,
    m11: false,
    m12: false,

    w1: false,
    w2: false,
    w3: false,
    w4: false,
    wLast: false,

    wd1: false,
    wd2: false,
    wd3: false,
    wd4: false,
    wd5: false,
    wd6: false,
    wd7: false,

    d1: false,
    d2: false,
    d3: false,
    d4: false,
    d5: false,
    d6: false,
    d7: false,
    d8: false,
    d9: false,
    d10: false,
    d11: false,
    d12: false,
    d13: false,
    d14: false,
    d15: false,
    d16: false,
    d17: false,
    d18: false,
    d19: false,
    d20: false,
    d21: false,
    d22: false,
    d23: false,
    d24: false,
    d25: false,
    d26: false,
    d27: false,
    d28: false,
    d29: false,
    d30: false,
    d31: false,
    dLast: false,

    workTimeMode: [WorkTimeMode.Timegrid],
    timeSlots: [],
    minDurationHours: [],
    minDurationMinutes: [],
    maxDurationHours: [],
    maxDurationMinutes: [],
    timeStart: 0,

    status: [ScheduleStatus.Active],

    rank: 0,
  };

  return resultViewData;
};

export const getEmptyTimeSlot = (): TimeSlotViewModel => {
  return {
    id: '',
    timeEnd: null,
    timeStart: null,
  };
};
