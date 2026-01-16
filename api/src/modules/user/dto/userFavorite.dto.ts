import { ApiProperty } from '@nestjs/swagger';

/** DTO для ответа с информацией об избранном пользователе */
export class UserFavoriteResponseDto {
  @ApiProperty({
    description: 'ID записи избранного',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID пользователя, который добавил в избранное',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string;

  @ApiProperty({
    description: 'ID избранного пользователя',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  favoriteId: string;

  @ApiProperty({
    description: 'Дата добавления в избранное',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;
}
