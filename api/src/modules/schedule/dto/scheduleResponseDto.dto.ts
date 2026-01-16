import { ApiProperty } from '@nestjs/swagger';
import {
  CalendarRepeatMode,
  ScheduleStatus,
  WorkTimeMode,
} from '@/prismaClient';
import { TimeSlotResponseDto } from './timeSlotResponse.dto';

/** Шаблон календарного расписания */
export class ScheduleResponseDto {
  @ApiProperty({ description: 'ID места', type: 'string', format: 'uuid' })
  placeId: string;

  @ApiProperty({ description: 'ID расписания', type: 'string', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Название шаблона' })
  name: string;

  @ApiProperty({
    description: 'Тип повтора',
    enum: CalendarRepeatMode,
    enumName: 'CalendarRepeatMode',
  })
  repeatMode: CalendarRepeatMode;

  @ApiProperty({ description: 'Дата начала', type: 'string', format: 'date' })
  startDate: string;

  @ApiProperty({
    description: 'Дата окончания',
    type: 'string',
    format: 'date',
  })
  stopDate: string;

  @ApiProperty({ description: 'Шаг повтора' })
  repeatStep: number;

  @ApiProperty({ required: false, description: 'Январь' })
  m1?: boolean;
  @ApiProperty({ required: false, description: 'Февраль' })
  m2?: boolean;
  @ApiProperty({ required: false, description: 'Март' })
  m3?: boolean;
  @ApiProperty({ required: false, description: 'Апрель' })
  m4?: boolean;
  @ApiProperty({ required: false, description: 'Май' })
  m5?: boolean;
  @ApiProperty({ required: false, description: 'Июнь' })
  m6?: boolean;
  @ApiProperty({ required: false, description: 'Июль' })
  m7?: boolean;
  @ApiProperty({ required: false, description: 'Август' })
  m8?: boolean;
  @ApiProperty({ required: false, description: 'Сентябрь' })
  m9?: boolean;
  @ApiProperty({ required: false, description: 'Октябрь' })
  m10?: boolean;
  @ApiProperty({ required: false, description: 'Ноябрь' })
  m11?: boolean;
  @ApiProperty({ required: false, description: 'Декабрь' })
  m12?: boolean;

  @ApiProperty({ required: false, description: 'Первая неделя месяца' })
  w1?: boolean;
  @ApiProperty({ required: false, description: 'Вторая неделя месяца' })
  w2?: boolean;
  @ApiProperty({ required: false, description: 'Третья неделя месяца' })
  w3?: boolean;
  @ApiProperty({ required: false, description: 'Четвертая неделя месяца' })
  w4?: boolean;
  @ApiProperty({ required: false, description: 'Последняя неделя месяца' })
  wLast?: boolean;

  @ApiProperty({ required: false, description: 'Понедельник' })
  wd1?: boolean;
  @ApiProperty({ required: false, description: 'Вторник' })
  wd2?: boolean;
  @ApiProperty({ required: false, description: 'Среда' })
  wd3?: boolean;
  @ApiProperty({ required: false, description: 'Четверг' })
  wd4?: boolean;
  @ApiProperty({ required: false, description: 'Пятница' })
  wd5?: boolean;
  @ApiProperty({ required: false, description: 'Суббота' })
  wd6?: boolean;
  @ApiProperty({ required: false, description: 'Воскресенье' })
  wd7?: boolean;

  /** Число месяца */
  @ApiProperty({ required: false, description: '1 число' })
  d1?: boolean;
  @ApiProperty({ required: false, description: '2 число' })
  d2?: boolean;
  @ApiProperty({ required: false, description: '3 число' })
  d3?: boolean;
  @ApiProperty({ required: false, description: '4 число' })
  d4?: boolean;
  @ApiProperty({ required: false, description: '5 число' })
  d5?: boolean;
  @ApiProperty({ required: false, description: '6 число' })
  d6?: boolean;
  @ApiProperty({ required: false, description: '7 число' })
  d7?: boolean;
  @ApiProperty({ required: false, description: '8 число' })
  d8?: boolean;
  @ApiProperty({ required: false, description: '9 число' })
  d9?: boolean;
  @ApiProperty({ required: false, description: '10 число' })
  d10?: boolean;
  @ApiProperty({ required: false, description: '11 число' })
  d11?: boolean;
  @ApiProperty({ required: false, description: '12 число' })
  d12?: boolean;
  @ApiProperty({ required: false, description: '13 число' })
  d13?: boolean;
  @ApiProperty({ required: false, description: '14 число' })
  d14?: boolean;
  @ApiProperty({ required: false, description: '15 число' })
  d15?: boolean;
  @ApiProperty({ required: false, description: '16 число' })
  d16?: boolean;
  @ApiProperty({ required: false, description: '17 число' })
  d17?: boolean;
  @ApiProperty({ required: false, description: '18 число' })
  d18?: boolean;
  @ApiProperty({ required: false, description: '19 число' })
  d19?: boolean;
  @ApiProperty({ required: false, description: '20 число' })
  d20?: boolean;
  @ApiProperty({ required: false, description: '21 число' })
  d21?: boolean;
  @ApiProperty({ required: false, description: '22 число' })
  d22?: boolean;
  @ApiProperty({ required: false, description: '23 число' })
  d23?: boolean;
  @ApiProperty({ required: false, description: '24 число' })
  d24?: boolean;
  @ApiProperty({ required: false, description: '25 число' })
  d25?: boolean;
  @ApiProperty({ required: false, description: '26 число' })
  d26?: boolean;
  @ApiProperty({ required: false, description: '27 число' })
  d27?: boolean;
  @ApiProperty({ required: false, description: '28 число' })
  d28?: boolean;
  @ApiProperty({ required: false, description: '29 число' })
  d29?: boolean;
  @ApiProperty({ required: false, description: '30 число' })
  d30?: boolean;
  @ApiProperty({ required: false, description: '31 число' })
  d31?: boolean;
  @ApiProperty({ required: false, description: 'Последний день месяца' })
  dLast?: boolean;

  @ApiProperty({
    description: 'Тип рабочего времени',
    enum: WorkTimeMode,
    enumName: 'WorkTimeMode',
    required: false,
  })
  workTimeMode?: WorkTimeMode;

  @ApiProperty({
    description: 'Минимальная длительность, часы',
    required: false,
  })
  minDurationHours?: number;

  @ApiProperty({
    description: 'Минимальная длительность, минуты',
    required: false,
  })
  minDurationMinutes?: number;

  @ApiProperty({
    description: 'Максимальная длительность, часы',
    required: false,
  })
  maxDurationHours?: number;

  @ApiProperty({
    description: 'Максимальная длительность, минуты',
    required: false,
  })
  maxDurationMinutes?: number;

  @ApiProperty({
    description: 'Возможное начало слота (минуты в часе)',
    required: false,
  })
  timeStart?: number;

  @ApiProperty({
    description: 'Фиксированные сеансы/Рабочие часы',
    isArray: true,
    type: () => TimeSlotResponseDto,
    required: false,
  })
  timeSlots?: TimeSlotResponseDto[];

  @ApiProperty({
    description: 'Статус',
    enum: ScheduleStatus,
    enumName: 'ScheduleStatus',
  })
  status: ScheduleStatus;

  @ApiProperty({
    description: 'Вес расписания (чем меньше цифра, тем выше приоритет)',
  })
  rank: number;
}
