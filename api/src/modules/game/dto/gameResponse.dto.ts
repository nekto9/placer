import { ApiProperty } from '@nestjs/swagger';
import { PlaceResponseDto } from '@/modules/place/dto';
import { SportResponseDto } from '@/modules/sport/dto';
import { GameLevel, GameStatus, RequestMode } from '@/prismaClient';
import { GameMetaDto } from './gameMeta.dto';
import { GameUserDto } from './gameUser.dto';

/** Игра */
export class GameResponseDto {
  @ApiProperty({ description: 'ID периода', type: 'string', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Площадка', type: PlaceResponseDto })
  place: PlaceResponseDto;

  @ApiProperty({
    description: 'Вид спорта',
    type: SportResponseDto,
    required: false,
  })
  sport?: SportResponseDto;

  @ApiProperty({ description: 'Время начала' })
  timeStart: number;

  @ApiProperty({ description: 'Время окончания' })
  timeEnd: number;

  @ApiProperty({
    description: 'Дата',
    type: 'string',
    format: 'date',
  })
  date: string;

  @ApiProperty({
    description: 'Дата создания',
    type: 'string',
    format: 'date',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Статус',
    enum: GameStatus,
    enumName: 'GameStatus',
  })
  status: GameStatus;

  @ApiProperty({
    description: 'Участники игры',
    type: () => GameUserDto,
    isArray: true,
  })
  gameUsers: GameUserDto[];

  @ApiProperty({
    description: 'Уровень сложности игры игры',
    enum: GameLevel,
    enumName: 'GameLevel',
  })
  level: GameLevel;

  @ApiProperty({
    description: 'Минимальное количество участников',
  })
  countMembersMin: number;

  @ApiProperty({
    description: 'Максимальное количество участников',
  })
  countMembersMax: number;

  @ApiProperty({
    description: 'Комментарий к игре',
  })
  description: string;

  @ApiProperty({
    description: 'Режим набора участников',
    enum: RequestMode,
    enumName: 'RequestMode',
  })
  requestMode: RequestMode;

  @ApiProperty({
    description: 'Метаданные',
    type: GameMetaDto,
    required: false,
  })
  meta?: GameMetaDto;
}
