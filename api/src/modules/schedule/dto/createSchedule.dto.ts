import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  CalendarRepeatMode,
  ScheduleStatus,
  WorkTimeMode,
} from '@/prismaClient';
import { TimeSlotResponseDto } from './timeSlotResponse.dto';

/** Создание шаблона календарного расписания */
export class CreateScheduleDto {
  @ApiProperty({
    description: 'ID площадки',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'ID площадки должен быть валидным UUID' })
  @IsNotEmpty({ message: 'ID площадки обязателен для заполнения' })
  placeId: string;

  @ApiProperty({
    description: 'Название шаблона расписания',
    example: 'Рабочие дни',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название обязательно для заполнения' })
  @MinLength(1, { message: 'Название не может быть пустым' })
  @MaxLength(100, { message: 'Название не может быть длиннее 100 символов' })
  name: string;

  @ApiProperty({
    description: 'Тип повтора расписания',
    enum: CalendarRepeatMode,
    enumName: 'CalendarRepeatMode',
    example: CalendarRepeatMode.WEEKLY,
  })
  @IsEnum(CalendarRepeatMode, { message: 'Некорректный тип повтора' })
  repeatMode: CalendarRepeatMode;

  @ApiProperty({
    description: 'Дата начала действия расписания',
    type: 'string',
    format: 'date',
    example: '2024-12-25',
  })
  @IsDateString({}, { message: 'Дата начала должна быть в формате YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Дата начала обязательна для заполнения' })
  startDate: string;

  @ApiProperty({
    description: 'Дата окончания действия расписания',
    type: 'string',
    format: 'date',
    example: '2025-12-25',
  })
  @IsDateString(
    {},
    { message: 'Дата окончания должна быть в формате YYYY-MM-DD' }
  )
  @IsNotEmpty({ message: 'Дата окончания обязательна для заполнения' })
  stopDate: string;

  @ApiProperty({
    description: 'Шаг повтора (например, каждые 2 недели)',
    example: 1,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber({}, { message: 'Шаг повтора должен быть числом' })
  @Min(1, { message: 'Шаг повтора должен быть больше 0' })
  @Max(100, { message: 'Шаг повтора не может быть больше 100' })
  repeatStep: number;

  // Месяцы
  @ApiProperty({ required: false, description: 'Январь' })
  @IsBoolean({ message: 'Значение для января должно быть булевым' })
  @IsOptional()
  m1?: boolean;

  @ApiProperty({ required: false, description: 'Февраль' })
  @IsBoolean({ message: 'Значение для февраля должно быть булевым' })
  @IsOptional()
  m2?: boolean;

  @ApiProperty({ required: false, description: 'Март' })
  @IsBoolean({ message: 'Значение для марта должно быть булевым' })
  @IsOptional()
  m3?: boolean;

  @ApiProperty({ required: false, description: 'Апрель' })
  @IsBoolean({ message: 'Значение для апреля должно быть булевым' })
  @IsOptional()
  m4?: boolean;

  @ApiProperty({ required: false, description: 'Май' })
  @IsBoolean({ message: 'Значение для мая должно быть булевым' })
  @IsOptional()
  m5?: boolean;

  @ApiProperty({ required: false, description: 'Июнь' })
  @IsBoolean({ message: 'Значение для июня должно быть булевым' })
  @IsOptional()
  m6?: boolean;

  @ApiProperty({ required: false, description: 'Июль' })
  @IsBoolean({ message: 'Значение для июля должно быть булевым' })
  @IsOptional()
  m7?: boolean;

  @ApiProperty({ required: false, description: 'Август' })
  @IsBoolean({ message: 'Значение для августа должно быть булевым' })
  @IsOptional()
  m8?: boolean;

  @ApiProperty({ required: false, description: 'Сентябрь' })
  @IsBoolean({ message: 'Значение для сентября должно быть булевым' })
  @IsOptional()
  m9?: boolean;

  @ApiProperty({ required: false, description: 'Октябрь' })
  @IsBoolean({ message: 'Значение для октября должно быть булевым' })
  @IsOptional()
  m10?: boolean;

  @ApiProperty({ required: false, description: 'Ноябрь' })
  @IsBoolean({ message: 'Значение для ноября должно быть булевым' })
  @IsOptional()
  m11?: boolean;

  @ApiProperty({ required: false, description: 'Декабрь' })
  @IsBoolean({ message: 'Значение для декабря должно быть булевым' })
  @IsOptional()
  m12?: boolean;

  // Недели месяца
  @ApiProperty({ required: false, description: 'Первая неделя месяца' })
  @IsBoolean({ message: 'Значение для первой недели должно быть булевым' })
  @IsOptional()
  w1?: boolean;

  @ApiProperty({ required: false, description: 'Вторая неделя месяца' })
  @IsBoolean({ message: 'Значение для второй недели должно быть булевым' })
  @IsOptional()
  w2?: boolean;

  @ApiProperty({ required: false, description: 'Третья неделя месяца' })
  @IsBoolean({ message: 'Значение для третьей недели должно быть булевым' })
  @IsOptional()
  w3?: boolean;

  @ApiProperty({ required: false, description: 'Четвертая неделя месяца' })
  @IsBoolean({ message: 'Значение для четвертой недели должно быть булевым' })
  @IsOptional()
  w4?: boolean;

  @ApiProperty({ required: false, description: 'Последняя неделя месяца' })
  @IsBoolean({ message: 'Значение для последней недели должно быть булевым' })
  @IsOptional()
  wLast?: boolean;

  // Дни недели
  @ApiProperty({ required: false, description: 'Понедельник' })
  @IsBoolean({ message: 'Значение для понедельника должно быть булевым' })
  @IsOptional()
  wd1?: boolean;

  @ApiProperty({ required: false, description: 'Вторник' })
  @IsBoolean({ message: 'Значение для вторника должно быть булевым' })
  @IsOptional()
  wd2?: boolean;

  @ApiProperty({ required: false, description: 'Среда' })
  @IsBoolean({ message: 'Значение для среды должно быть булевым' })
  @IsOptional()
  wd3?: boolean;

  @ApiProperty({ required: false, description: 'Четверг' })
  @IsBoolean({ message: 'Значение для четверга должно быть булевым' })
  @IsOptional()
  wd4?: boolean;

  @ApiProperty({ required: false, description: 'Пятница' })
  @IsBoolean({ message: 'Значение для пятницы должно быть булевым' })
  @IsOptional()
  wd5?: boolean;

  @ApiProperty({ required: false, description: 'Суббота' })
  @IsBoolean({ message: 'Значение для субботы должно быть булевым' })
  @IsOptional()
  wd6?: boolean;

  @ApiProperty({ required: false, description: 'Воскресенье' })
  @IsBoolean({ message: 'Значение для воскресенья должно быть булевым' })
  @IsOptional()
  wd7?: boolean;

  // Числа месяца (сокращенная версия для экономии места)
  @ApiProperty({ required: false, description: '1 число' })
  @IsBoolean({ message: 'Значение для 1 числа должно быть булевым' })
  @IsOptional()
  d1?: boolean;

  @ApiProperty({ required: false, description: '15 число' })
  @IsBoolean({ message: 'Значение для 15 числа должно быть булевым' })
  @IsOptional()
  d15?: boolean;

  @ApiProperty({ required: false, description: '31 число' })
  @IsBoolean({ message: 'Значение для 31 числа должно быть булевым' })
  @IsOptional()
  d31?: boolean;

  @ApiProperty({ required: false, description: 'Последний день месяца' })
  @IsBoolean({ message: 'Значение для последнего дня должно быть булевым' })
  @IsOptional()
  dLast?: boolean;

  @ApiProperty({
    description: 'Тип рабочего времени',
    enum: WorkTimeMode,
    enumName: 'WorkTimeMode',
    required: false,
    example: WorkTimeMode.TIMEGRID,
  })
  @IsEnum(WorkTimeMode, { message: 'Некорректный тип рабочего времени' })
  @IsOptional()
  workTimeMode?: WorkTimeMode;

  @ApiProperty({
    description: 'Минимальная длительность слота в часах',
    required: false,
    example: 1,
    minimum: 0,
    maximum: 24,
  })
  @IsNumber(
    {},
    { message: 'Минимальная длительность в часах должна быть числом' }
  )
  @Min(0, {
    message: 'Минимальная длительность в часах не может быть отрицательной',
  })
  @Max(24, {
    message: 'Минимальная длительность в часах не может быть больше 24',
  })
  @IsOptional()
  minDurationHours?: number;

  @ApiProperty({
    description: 'Минимальная длительность слота в минутах',
    required: false,
    example: 30,
    minimum: 0,
    maximum: 59,
  })
  @IsNumber(
    {},
    { message: 'Минимальная длительность в минутах должна быть числом' }
  )
  @Min(0, {
    message: 'Минимальная длительность в минутах не может быть отрицательной',
  })
  @Max(59, {
    message: 'Минимальная длительность в минутах не может быть больше 59',
  })
  @IsOptional()
  minDurationMinutes?: number;

  @ApiProperty({
    description: 'Максимальная длительность слота в часах',
    required: false,
    example: 3,
    minimum: 0,
    maximum: 24,
  })
  @IsNumber(
    {},
    { message: 'Максимальная длительность в часах должна быть числом' }
  )
  @Min(0, {
    message: 'Максимальная длительность в часах не может быть отрицательной',
  })
  @Max(24, {
    message: 'Максимальная длительность в часах не может быть больше 24',
  })
  @IsOptional()
  maxDurationHours?: number;

  @ApiProperty({
    description: 'Максимальная длительность слота в минутах',
    required: false,
    example: 0,
    minimum: 0,
    maximum: 59,
  })
  @IsNumber(
    {},
    { message: 'Максимальная длительность в минутах должна быть числом' }
  )
  @Min(0, {
    message: 'Максимальная длительность в минутах не может быть отрицательной',
  })
  @Max(59, {
    message: 'Максимальная длительность в минутах не может быть больше 59',
  })
  @IsOptional()
  maxDurationMinutes?: number;

  @ApiProperty({
    description: 'Возможное начало слота (минуты от начала дня)',
    required: false,
    example: 480,
    minimum: 0,
    maximum: 1439,
  })
  @IsNumber({}, { message: 'Время начала должно быть числом' })
  @Min(0, { message: 'Время начала не может быть отрицательным' })
  @Max(1439, { message: 'Время начала не может быть больше 1439' })
  @IsOptional()
  timeStart?: number;

  @ApiProperty({
    description: 'Фиксированные временные слоты',
    isArray: true,
    type: () => TimeSlotResponseDto,
    required: false,
  })
  @IsOptional()
  timeSlots?: TimeSlotResponseDto[];

  @ApiProperty({
    description: 'Статус расписания',
    enum: ScheduleStatus,
    enumName: 'ScheduleStatus',
    example: ScheduleStatus.ACTIVE,
  })
  @IsEnum(ScheduleStatus, { message: 'Некорректный статус расписания' })
  status: ScheduleStatus;

  @ApiProperty({
    description: 'Вес расписания (чем меньше цифра, тем выше приоритет)',
    example: 1,
    minimum: 0,
    maximum: 1000,
  })
  @IsNumber({}, { message: 'Вес расписания должен быть числом' })
  @Min(0, { message: 'Вес расписания не может быть отрицательным' })
  @Max(1000, { message: 'Вес расписания не может быть больше 1000' })
  rank: number;
}
