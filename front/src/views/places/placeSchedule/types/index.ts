import { DateTime } from '@gravity-ui/date-utils';
import {
  CalendarRepeatMode,
  ScheduleResponseDto,
  ScheduleStatus,
  WorkTimeMode,
} from '@/store/api';

export type ScheduleViewModel = {
  /** Дата начала */
  startDate: DateTime | null;
  /** Дата окончания */
  stopDate: DateTime | null;
  /** Тип повтора */
  repeatMode: CalendarRepeatMode[];
  /** Режим суточного расписания */
  workTimeMode: WorkTimeMode[];
  /** Статус расписания */
  status: ScheduleStatus[];

  minDurationHours: string[];
  minDurationMinutes: string[];
  maxDurationHours: string[];
  maxDurationMinutes: string[];
  timeSlots: TimeSlotViewModel[];
} & Omit<
  ScheduleResponseDto,
  | 'startDate'
  | 'stopDate'
  | 'repeatMode'
  | 'workTimeMode'
  | 'status'
  | 'id'
  | 'minDurationHours'
  | 'minDurationMinutes'
  | 'maxDurationHours'
  | 'maxDurationMinutes'
  | 'timeSlots'
>;

export type TimeSlotViewModel = {
  /** ID периода */
  id: string;
  /** Дата начала */
  timeStart: DateTime;
  /** Дата окончания */
  timeEnd: DateTime;
};
