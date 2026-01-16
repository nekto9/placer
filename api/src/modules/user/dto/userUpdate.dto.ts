import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/** Обновление данных пользователя */
export class UserUpdateDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'ivan_petrov',
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя пользователя обязательно для заполнения' })
  @MinLength(1, { message: 'Имя пользователя не может быть пустым' })
  @MaxLength(50, {
    message: 'Имя пользователя не может быть длиннее 50 символов',
  })
  username: string;

  @ApiProperty({
    description: 'Аватар (id файла)',
    required: false,
    format: 'uuid',
  })
  avatar?: string;
}
