import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { GameLevel, GameStatus, RequestMode } from '@/prismaClient';
import { GameUserDto } from './gameUser.dto';

/** Обновление игры */
export class UpdateGameDto {
  @ApiProperty({
    description: 'ID игры',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'ID игры должен быть валидным UUID' })
  @IsNotEmpty({ message: 'ID игры обязателен для заполнения' })
  id: string;

  @ApiProperty({
    description: 'ID площадки',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsUUID(4, { message: 'ID площадки должен быть валидным UUID' })
  @IsOptional()
  placeId?: string;

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
    required: false,
  })
  @IsNumber({}, { message: 'Время начала должно быть числом' })
  @Min(0, { message: 'Время начала не может быть меньше 0' })
  @Max(1439, { message: 'Время начала не может быть больше 1439' })
  @IsOptional()
  timeStart?: number;

  @ApiProperty({
    description: 'Время окончания (в минутах от начала дня)',
    example: 720,
    minimum: 0,
    maximum: 1439,
    required: false,
  })
  @IsNumber({}, { message: 'Время окончания должно быть числом' })
  @Min(0, { message: 'Время окончания не может быть меньше 0' })
  @Max(1439, { message: 'Время окончания не может быть больше 1439' })
  @IsOptional()
  timeEnd?: number;

  @ApiProperty({
    description: 'Дата игры',
    type: 'string',
    format: 'date',
    example: '2024-12-25',
    required: false,
  })
  @IsDateString({}, { message: 'Дата должна быть в формате YYYY-MM-DD' })
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: 'Статус игры',
    enum: GameStatus,
    enumName: 'GameStatus',
    example: GameStatus.DRAFT,
    required: false,
  })
  @IsEnum(GameStatus, { message: 'Некорректный статус игры' })
  @IsOptional()
  status?: GameStatus;

  @ApiProperty({
    description: 'Участники игры',
    type: () => GameUserDto,
    isArray: true,
    required: false,
  })
  @IsOptional()
  gameUsers?: GameUserDto[];

  @ApiProperty({
    description: 'Уровень сложности игры игры',
    enum: GameLevel,
    enumName: 'GameLevel',
    example: GameLevel.EASY,
  })
  @IsEnum(GameLevel, { message: 'Некорректный уровень сложности игры' })
  level: GameLevel;

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
  @IsOptional()
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
  @IsOptional()
  countMembersMax?: number;

  @ApiProperty({
    description: 'Комментарий к игре',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Режим принятия запросов на участие',
    enum: RequestMode,
    enumName: 'RequestMode',
    example: RequestMode.PRIVATE,
  })
  @IsEnum(RequestMode, { message: 'Стратегия принятия запросов на участие' })
  requestMode: RequestMode;
}
