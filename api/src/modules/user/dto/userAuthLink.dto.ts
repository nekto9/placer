import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Связывание пользователя с Keycloak */
export class UserAuthLinkDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'ivan_petrov',
    minLength: 1,
    maxLength: 50,
    required: false,
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @MinLength(1, { message: 'Имя пользователя не может быть пустым' })
  @MaxLength(50, {
    message: 'Имя пользователя не может быть длиннее 50 символов',
  })
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'ID учетной записи Keycloak (поле sub)',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, {
    message: 'ID учетной записи Keycloak должен быть валидным UUID',
  })
  @IsNotEmpty({
    message: 'ID учетной записи Keycloak обязателен для заполнения',
  })
  sub: string;
}
