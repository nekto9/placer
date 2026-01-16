import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Обновление площадки */
export class UpdatePlaceDto {
  @ApiProperty({
    description: 'Название площадки',
    example: 'Стадион "Центральный"',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @IsString({ message: 'Название площадки должно быть строкой' })
  @MinLength(1, { message: 'Название площадки не может быть пустым' })
  @MaxLength(100, {
    message: 'Название площадки не может быть длиннее 100 символов',
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Описание площадки',
    example: 'Современный футбольный стадион с искусственным покрытием',
    maxLength: 500,
    required: false,
  })
  @IsString({ message: 'Описание площадки должно быть строкой' })
  @MaxLength(500, {
    message: 'Описание площадки не может быть длиннее 500 символов',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Флаг крытой площадки (true - крытая, false - открытая)',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'Флаг крытой площадки должен быть булевым значением' })
  @IsOptional()
  isIndoor?: boolean;

  @ApiProperty({
    description:
      'Флаг бесплатной площадки (true - бесплатная, false - платная)',
    example: true,
    required: false,
  })
  @IsBoolean({
    message: 'Флаг бесплатной площадки должен быть булевым значением',
  })
  @IsOptional()
  isFree?: boolean;

  @ApiProperty({
    description: 'Виды спорта площадки',
    type: 'string',
    isArray: true,
  })
  sports: string[];

  @ApiProperty({
    description: 'Фотографии площадки (id файлов)',
    type: 'string',
    isArray: true,
    required: false,
  })
  covers?: string[];

  @ApiProperty({
    description: 'Город площадки',
    type: 'string',
  })
  city: string;

  @ApiProperty({
    description: 'Широта',
    type: Number,
  })
  @IsNumber({}, { message: 'Широта должна быть числом' })
  latitude: number;

  @ApiProperty({
    description: 'Долгота',
    type: Number,
  })
  @IsNumber({}, { message: 'Долгота должна быть числом' })
  longitude: number;
}
