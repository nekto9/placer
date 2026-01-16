import { ApiProperty } from '@nestjs/swagger';
import { CityResponseDto } from '@/modules/city/dto';
import { SportResponseDto } from '@/modules/sport/dto';
import { FileItemDto } from '@/modules/uploader/dto/FileItemDto';
import { PlaceMetaDto } from './PlaceMeta.dto';

/** Данные площадки */
export class PlaceResponseDto {
  @ApiProperty({
    description: 'ID площадки',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Название площадки',
    example: 'Стадион "Центральный"',
    minLength: 1,
    maxLength: 100,
  })
  name: string;

  @ApiProperty({
    description: 'Описание площадки',
    example: 'Современный футбольный стадион с искусственным покрытием',
    maxLength: 500,
  })
  description: string;

  @ApiProperty({
    description: 'Обложки площадки',
    isArray: true,
    type: FileItemDto,
  })
  covers?: FileItemDto[];

  @ApiProperty({
    description: 'Виды спорта площадки',
    isArray: true,
    type: SportResponseDto,
  })
  sports?: SportResponseDto[];

  @ApiProperty({
    description: 'Город площадки',
    type: CityResponseDto,
  })
  city?: CityResponseDto;

  @ApiProperty({
    description: 'Широта',
    type: Number,
  })
  latitude: number;

  @ApiProperty({
    description: 'Долгота',
    type: Number,
  })
  longitude: number;

  @ApiProperty({
    description: 'Флаг крытой площадки (true - крытая, false - открытая)',
    example: false,
  })
  isIndoor: boolean;

  @ApiProperty({
    description:
      'Флаг бесплатной площадки (true - бесплатная, false - платная)',
    example: true,
  })
  isFree: boolean;

  @ApiProperty({
    description: 'Метаданные',
    type: PlaceMetaDto,
    required: false,
  })
  meta?: PlaceMetaDto;
}
