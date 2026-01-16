import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { GameUserRole, GameUserStatus } from '@/prismaClient';

/** Участник игры */
export class GameUserDto {
  @ApiProperty({
    description: 'ID пользователя',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID(4, { message: 'ID пользователя должен быть валидным UUID' })
  @IsNotEmpty({ message: 'ID пользователя обязателен' })
  userId: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя пользователя обязательно' })
  userName: string;

  @ApiProperty({
    description: 'Роль игрока в игре',
    enum: GameUserRole,
    enumName: 'GameUserRole',
    example: GameUserRole.MEMBER,
  })
  @IsEnum(GameUserRole, { message: 'Некорректная роль игрока' })
  role: GameUserRole;

  @ApiProperty({
    description: 'Статус участия игрока в игре',
    enum: GameUserStatus,
    enumName: 'GameUserStatus',
    example: GameUserStatus.CONFIRMED,
  })
  @IsEnum(GameUserStatus, { message: 'Некорректный статус игрока' })
  status: GameUserStatus;
}
