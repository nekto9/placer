import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { GameResponseDto } from '@/modules/game/dto';
import { TimeSlotResponseDto } from '@/modules/schedule/dto';
import { WorkTimeMode } from '@/prismaClient';

/** День с данными расписаний площадки */
export class GridDayResponseDto {
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
    description: 'Дата дня расписания',
    type: 'string',
    format: 'date',
    example: '2024-12-25',
  })
  @IsDateString({}, { message: 'Дата должна быть в формате YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Дата обязательна' })
  date: string;

  @ApiProperty({
    description: 'Название расписания',
    example: 'Рабочие дни',
    maxLength: 100,
  })
  @IsString({ message: 'Название расписания должно быть строкой' })
  @IsNotEmpty({ message: 'Название расписания обязательно' })
  @MaxLength(100, {
    message: 'Название расписания не может быть длиннее 100 символов',
  })
  scheduleName: string;

  @ApiProperty({
    description: 'Тип рабочего времени площадки',
    enum: WorkTimeMode,
    enumName: 'WorkTimeMode',
    example: WorkTimeMode.TIMEGRID,
  })
  @IsEnum(WorkTimeMode, { message: 'Некорректный тип рабочего времени' })
  workTimeMode: WorkTimeMode;

  @ApiProperty({
    description: 'Фиксированные временные слоты для данного дня',
    isArray: true,
    type: () => TimeSlotResponseDto,
  })
  @IsArray({ message: 'Временные слоты должны быть массивом' })
  timeSlots: TimeSlotResponseDto[];

  @ApiProperty({
    description: 'Игры, запланированные на данный день',
    type: () => GameResponseDto,
    isArray: true,
  })
  @IsArray({ message: 'Игры должны быть массивом' })
  games: GameResponseDto[];
}
