import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarDto {
  @ApiProperty({
    description: 'Файл для загрузки',
    type: 'string',
    format: 'binary',
  })
  avatar: Express.Multer.File;

  @ApiProperty({
    description: 'Id файла для загрузки',
    type: 'string',
    format: 'uuid',
  })
  fileId: string;
}
