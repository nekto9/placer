import { ApiProperty } from '@nestjs/swagger';

/**
 * Метаданные для площадки
 */
export class PlaceMetaDto {
  @ApiProperty({ description: 'Права на редактирование' })
  canEdit: boolean;

  @ApiProperty({
    description: 'Флаг избранной площадки по отношению к автору запроса',
  })
  isFavorite?: boolean;
}
