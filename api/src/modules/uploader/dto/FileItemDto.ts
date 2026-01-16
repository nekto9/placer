import { ApiProperty } from '@nestjs/swagger';

export class FileItemDto {
  @ApiProperty({
    description: 'Id файла',
    type: 'string',
    format: 'uuid',
  })
  fileId: string;

  @ApiProperty({
    description: 'Публичный url файла',
    type: 'string',
  })
  fileUrl: string;
}
