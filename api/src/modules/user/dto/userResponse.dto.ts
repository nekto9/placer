import { ApiProperty } from '@nestjs/swagger';
import { FileItemDto } from '@/modules/uploader/dto/FileItemDto';
import { UserMetaDto } from './UserMetaDto';

/** Данные пользователя */
export class UserResponseDto {
  @ApiProperty({
    description: 'ID пользователя',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Индекс пользователя',
    type: 'number',
  })
  idx?: number;

  @ApiProperty({
    description: 'ID учетной записи в Keycloak',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  keycloakId?: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'ivan_petrov',
    minLength: 1,
    maxLength: 50,
  })
  username: string;

  @ApiProperty({
    description: 'Файл аватара',
    required: false,
    type: FileItemDto,
  })
  avatar?: FileItemDto;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    format: 'email',
  })
  email?: string;

  @ApiProperty({
    description: 'ID пользователя в Telegram',
    type: 'string',
    example: '123456789',
    required: false,
  })
  telegramId?: string;

  @ApiProperty({
    description: 'Метаданные',
    type: UserMetaDto,
    required: false,
  })
  meta?: UserMetaDto;
}
