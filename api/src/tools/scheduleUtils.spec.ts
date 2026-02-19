import { CalendarRepeatMode, ScheduleStatus, WorkTimeMode } from '@/prismaClient';
import { getDateParams, stringToDate } from './dateUtils';
import dayjs from './dayjs';
import { isScheduleAppliedToDate } from './scheduleUtils';

const createBaseSchedule = () => ({
  repeatMode: CalendarRepeatMode.DAILY,
  repeatStep: 1,
  startDate: stringToDate('2026-03-01'),
  stopDate: null,
  status: ScheduleStatus.ACTIVE,
  workTimeMode: WorkTimeMode.TIMEGRID,
});

describe('scheduleUtils', () => {
  it('использует вхождение дня недели в месяце, а не номер календарной недели', () => {
    const firstMonday = getDateParams(dayjs(stringToDate('2026-03-02')));
    const lastMonday = getDateParams(dayjs(stringToDate('2026-03-30')));

    expect(firstMonday.weekOfMonth).toBe(1);
    expect(firstMonday.isLastWeekOfMonth).toBe(false);
    expect(lastMonday.weekOfMonth).toBe(5);
    expect(lastMonday.isLastWeekOfMonth).toBe(true);
  });

  it('учитывает repeatStep для еженедельных расписаний', () => {
    const schedule = {
      ...createBaseSchedule(),
      repeatMode: CalendarRepeatMode.WEEKLY,
      startDate: stringToDate('2026-03-02'),
      repeatStep: 2,
      wd1: true,
    };

    expect(isScheduleAppliedToDate(schedule, stringToDate('2026-03-02'))).toBe(true);
    expect(isScheduleAppliedToDate(schedule, stringToDate('2026-03-09'))).toBe(false);
    expect(isScheduleAppliedToDate(schedule, stringToDate('2026-03-16'))).toBe(true);
  });

  it('корректно применяет шаблон по выбранным месяцам и неделям месяца', () => {
    const schedule = {
      ...createBaseSchedule(),
      repeatMode: CalendarRepeatMode.WEEKDAYS,
      m3: true,
      w2: true,
      wd1: true,
    };

    expect(isScheduleAppliedToDate(schedule, stringToDate('2026-03-09'))).toBe(true);
    expect(isScheduleAppliedToDate(schedule, stringToDate('2026-03-02'))).toBe(false);
    expect(isScheduleAppliedToDate(schedule, stringToDate('2026-04-13'))).toBe(false);
  });

  it('применяет wLast для последнего вхождения дня недели в месяце', () => {
    const schedule = {
      ...createBaseSchedule(),
      repeatMode: CalendarRepeatMode.WEEKDAYS,
      wLast: true,
      wd1: true,
    };

    expect(isScheduleAppliedToDate(schedule, stringToDate('2026-03-30'))).toBe(true);
    expect(isScheduleAppliedToDate(schedule, stringToDate('2026-03-23'))).toBe(false);
  });

  it('считает пустой выбор календарных дней как каждый день выбранных месяцев', () => {
    const schedule = {
      ...createBaseSchedule(),
      repeatMode: CalendarRepeatMode.CALENDDAYS,
      m1: true,
      startDate: stringToDate('2026-01-01'),
    };

    expect(isScheduleAppliedToDate(schedule, stringToDate('2026-01-10'))).toBe(true);
    expect(isScheduleAppliedToDate(schedule, stringToDate('2026-02-10'))).toBe(false);
  });
});
