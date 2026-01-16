import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ScheduleStatus } from '@/prismaClient';

/** Краткие данные о расписании площадки */
export class ScheduleShortResponseDto {
  @ApiProperty({
    description: 'ID расписания',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'ID расписания должен быть валидным UUID' })
  @IsNotEmpty({ message: 'ID расписания обязателен' })
  id: string;

  @ApiProperty({
    description: 'ID площадки',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID(4, { message: 'ID площадки должен быть валидным UUID' })
  @IsNotEmpty({ message: 'ID площадки обязателен' })
  placeId: string;

  @ApiProperty({
    description: 'Дата начала действия расписания',
    type: 'string',
    format: 'date',
    example: '2024-12-01',
  })
  @IsDateString({}, { message: 'Дата начала должна быть в формате YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Дата начала обязательна' })
  startDate: string;

  @ApiProperty({
    description: 'Дата окончания действия расписания',
    type: 'string',
    format: 'date',
    example: '2024-12-31',
  })
  @IsDateString(
    {},
    { message: 'Дата окончания должна быть в формате YYYY-MM-DD' }
  )
  @IsNotEmpty({ message: 'Дата окончания обязательна' })
  stopDate: string;

  @ApiProperty({
    description: 'Название расписания',
    example: 'Рабочие дни',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'Название расписания должно быть строкой' })
  @IsNotEmpty({ message: 'Название расписания обязательно' })
  @MinLength(1, { message: 'Название расписания не может быть пустым' })
  @MaxLength(100, {
    message: 'Название расписания не может быть длиннее 100 символов',
  })
  name: string;

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

  @ApiProperty({
    description: 'Статус расписания',
    enum: ScheduleStatus,
    enumName: 'ScheduleStatus',
    example: ScheduleStatus.ACTIVE,
  })
  @IsEnum(ScheduleStatus, { message: 'Некорректный статус расписания' })
  status: ScheduleStatus;
}
