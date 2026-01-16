import { ApiProperty } from '@nestjs/swagger';

/**
 * Метаданные для пользователя
 */
export class UserMetaDto {
  @ApiProperty({ description: 'Права на редактирование' })
  canEdit: boolean;

  @ApiProperty({
    description: 'Флаг избранного пользователя по отношению к автору запроса',
  })
  isFavorite?: boolean;
}
