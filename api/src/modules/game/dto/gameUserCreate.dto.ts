import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/** Добавление пользователя в игру */
export class GameUserCreateDto {
  @ApiProperty({
    description: 'ID пользователя',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'ID пользователя должен быть валидным UUID' })
  @IsNotEmpty({ message: 'ID пользователя обязателен для заполнения' })
  userId: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя пользователя обязательно для заполнения' })
  userName: string;
}
