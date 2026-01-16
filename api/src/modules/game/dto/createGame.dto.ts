import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { GameLevel, GameStatus } from '@/prismaClient';

/** Создание игры */
export class CreateGameDto {
  @ApiProperty({
    description: 'ID вида спорта',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsUUID(4, { message: 'ID вида спорта должен быть валидным UUID' })
  @IsOptional()
  sportId?: string;

  @ApiProperty({
    description: 'Время начала (в минутах от начала дня)',
    example: 600,
    minimum: 0,
    maximum: 1439,
  })
  @IsNumber({}, { message: 'Время начала должно быть числом' })
  @Min(0, { message: 'Время начала не может быть меньше 0' })
  @Max(1439, { message: 'Время начала не может быть больше 1439' })
  timeStart: number;

  @ApiProperty({
    description: 'Время окончания (в минутах от начала дня)',
    example: 720,
    minimum: 0,
    maximum: 1439,
  })
  @IsNumber({}, { message: 'Время окончания должно быть числом' })
  @Min(0, { message: 'Время окончания не может быть меньше 0' })
  @Max(1439, { message: 'Время окончания не может быть больше 1439' })
  timeEnd: number;

  @ApiProperty({
    description: 'Дата игры',
    type: 'string',
    format: 'date',
    example: '2024-12-25',
  })
  @IsDateString({}, { message: 'Дата должна быть в формате YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Дата обязательна для заполнения' })
  date: string;

  @ApiProperty({
    description: 'Статус игры',
    enum: GameStatus,
    enumName: 'GameStatus',
    example: GameStatus.DRAFT,
  })
  @IsEnum(GameStatus, { message: 'Некорректный статус игры' })
  status: GameStatus;

  @ApiProperty({
    description: 'ID пользователя, создающего игру',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID(4, { message: 'ID пользователя должен быть валидным UUID' })
  createUserId?: string;

  @ApiProperty({
    description: 'Уровень сложности игры игры',
    enum: GameLevel,
    enumName: 'GameLevel',
    example: GameLevel.EASY,
    required: false,
  })
  @IsEnum(GameLevel, { message: 'Некорректный уровень сложности игры' })
  level?: GameLevel;

  @ApiProperty({
    description: 'Минимальное количество участников',
    example: 10,
    minimum: 0,
    maximum: 99,
    required: false,
  })
  @IsNumber({}, { message: 'Количество участников должно быть числом' })
  @Min(0, { message: 'Количество участников не может быть меньше 0' })
  @Max(99, { message: 'Количество участников не может быть больше 99' })
  countMembersMin?: number;

  @ApiProperty({
    description: 'Максимальное количество участников',
    example: 10,
    minimum: 0,
    maximum: 99,
    required: false,
  })
  @IsNumber({}, { message: 'Количество участников должно быть числом' })
  @Min(0, { message: 'Количество участников не может быть меньше 0' })
  @Max(99, { message: 'Количество участников не может быть больше 99' })
  countMembersMax?: number;
}
