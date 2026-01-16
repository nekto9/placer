import { ApiProperty } from '@nestjs/swagger';

/** Вид спорта */
export class SportResponseDto {
  @ApiProperty({
    description: 'ID вида спорта',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174009',
  })
  id: string;

  @ApiProperty({
    description: 'Название вида спорта',
  })
  name: string;
}
