import { ApiProperty } from '@nestjs/swagger';

/** Вид спорта */
export class CityResponseDto {
  @ApiProperty({
    description: 'ID города',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Название города',
  })
  name: string;
}
