import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

export class UploadCoverDto {
  @ApiProperty({
    description: 'Массив файлов для загрузки',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  covers: Express.Multer.File[];

  @ApiProperty({
    description: 'Массив id файлов для загрузки',
    type: 'array',
    items: { type: 'string', format: 'uuid' },
  })
  @IsArray()
  @Transform(({ value }) => {
    // Если пришла строка (один ID), оборачиваем в массив
    if (typeof value === 'string') return [value];
    // Если пришел массив — возвращаем как есть
    return Array.isArray(value) ? value : [];
  })
  fileIds: string[];
}
