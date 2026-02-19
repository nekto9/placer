import {
  CalendarRepeatMode,
  ScheduleStatus,
  WorkTimeMode,
} from "@/prismaClient";
import { DateParams, getDateParams } from "./dateUtils";
import dayjs from "./dayjs";

type ScheduleLike = {
  repeatMode: CalendarRepeatMode;
  repeatStep?: number | null;
  startDate?: Date | null;
  stopDate?: Date | null;
  status?: ScheduleStatus | null;
  placeId?: string | null;
  workTimeMode?: WorkTimeMode | null;
  [key: string]: unknown;
};

const monthKeys = Array.from(
  { length: 12 },
  (_value, index) => `m${index + 1}`
);
const weekKeys = ["w1", "w2", "w3", "w4", "wLast"];
const weekDayKeys = Array.from(
  { length: 7 },
  (_value, index) => `wd${index + 1}`
);
const calendarDayKeys = [
  ...Array.from({ length: 31 }, (_value, index) => `d${index + 1}`),
  "dLast",
];

const isSelected = (schedule: ScheduleLike, key: string) =>
  schedule[key] === true;

const hasAnySelected = (schedule: ScheduleLike, keys: string[]) =>
  keys.some((key) => isSelected(schedule, key));

const matchesStartStopRange = (schedule: ScheduleLike, currentDate: Date) => {
  if (
    schedule.startDate &&
    currentDate.getTime() < schedule.startDate.getTime()
  ) {
    return false;
  }

  if (
    schedule.stopDate &&
    currentDate.getTime() > schedule.stopDate.getTime()
  ) {
    return false;
  }

  return true;
};

const matchesRepeatStepByDays = (
  schedule: ScheduleLike,
  currentDateDayjs: dayjs.Dayjs
) => {
  const repeatStep = schedule.repeatStep ?? 1;

  if (!schedule.startDate || repeatStep <= 1) {
    return true;
  }

  return (
    currentDateDayjs.diff(dayjs(schedule.startDate), "day") % repeatStep === 0
  );
};

const matchesRepeatStepByWeeks = (
  schedule: ScheduleLike,
  currentDateDayjs: dayjs.Dayjs
) => {
  const repeatStep = schedule.repeatStep ?? 1;

  if (!schedule.startDate || repeatStep <= 1) {
    return true;
  }

  return (
    currentDateDayjs.diff(dayjs(schedule.startDate), "week") % repeatStep === 0
  );
};

const matchesSelectedMonths = (schedule: ScheduleLike, month: number) => {
  if (!hasAnySelected(schedule, monthKeys)) {
    return true;
  }

  return isSelected(schedule, `m${month}`);
};

const matchesSelectedWeekDays = (schedule: ScheduleLike, weekDay: number) => {
  if (!hasAnySelected(schedule, weekDayKeys)) {
    return true;
  }

  return isSelected(schedule, `wd${weekDay}`);
};

const matchesSelectedCalendarDays = (
  schedule: ScheduleLike,
  dateParams: DateParams
) => {
  if (!hasAnySelected(schedule, calendarDayKeys)) {
    return true;
  }

  return (
    isSelected(schedule, `d${dateParams.monthDay}`) ||
    (dateParams.isLastMonthDay && isSelected(schedule, "dLast"))
  );
};

const matchesSelectedWeeks = (
  schedule: ScheduleLike,
  dateParams: DateParams
) => {
  if (!hasAnySelected(schedule, weekKeys)) {
    return true;
  }

  if (dateParams.isLastWeekOfMonth && isSelected(schedule, "wLast")) {
    return true;
  }

  if (dateParams.weekOfMonth > 4) {
    return false;
  }

  return isSelected(schedule, `w${dateParams.weekOfMonth}`);
};

export const isScheduleActive = (schedule: ScheduleLike) =>
  schedule.status !== ScheduleStatus.DISABLED;

export const getScheduleDateParams = (currentDate: Date) =>
  getDateParams(dayjs(currentDate));

export const isScheduleAppliedToDate = (
  schedule: ScheduleLike,
  currentDate: Date
) => {
  if (!matchesStartStopRange(schedule, currentDate)) {
    return false;
  }

  const currentDateDayjs = dayjs(currentDate);
  const dateParams = getDateParams(currentDateDayjs);
  const month = currentDateDayjs.month() + 1;

  switch (schedule.repeatMode) {
    case CalendarRepeatMode.ONCE:
      return (
        !!schedule.startDate &&
        schedule.startDate.getTime() === currentDate.getTime()
      );

    case CalendarRepeatMode.DAILY:
      return matchesRepeatStepByDays(schedule, currentDateDayjs);

    case CalendarRepeatMode.WEEKLY:
      return (
        matchesRepeatStepByWeeks(schedule, currentDateDayjs) &&
        matchesSelectedWeekDays(schedule, dateParams.weekDay)
      );

    case CalendarRepeatMode.CALENDDAYS:
      return (
        matchesSelectedMonths(schedule, month) &&
        matchesSelectedCalendarDays(schedule, dateParams)
      );

    case CalendarRepeatMode.WEEKDAYS:
      return (
        matchesSelectedMonths(schedule, month) &&
        matchesSelectedWeekDays(schedule, dateParams.weekDay) &&
        matchesSelectedWeeks(schedule, dateParams)
      );

    default:
      return false;
  }
};
