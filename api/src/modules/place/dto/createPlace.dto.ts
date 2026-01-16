import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Создание площадки */
export class CreatePlaceDto {
  @ApiProperty({
    description: 'Название площадки',
    example: 'Стадион "Центральный"',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'Название площадки должно быть строкой' })
  @IsNotEmpty({ message: 'Название площадки обязательно для заполнения' })
  @MinLength(1, { message: 'Название площадки не может быть пустым' })
  @MaxLength(100, {
    message: 'Название площадки не может быть длиннее 100 символов',
  })
  name: string;

  @ApiProperty({
    description: 'Описание площадки',
    example: 'Современный футбольный стадион с искусственным покрытием',
    maxLength: 500,
  })
  @IsString({ message: 'Описание площадки должно быть строкой' })
  @IsNotEmpty({ message: 'Описание площадки обязательно для заполнения' })
  @MaxLength(500, {
    message: 'Описание площадки не может быть длиннее 500 символов',
  })
  description: string;

  @ApiProperty({
    description: 'Флаг крытой площадки (true - крытая, false - открытая)',
    example: false,
  })
  @IsBoolean({ message: 'Флаг крытой площадки должен быть булевым значением' })
  isIndoor: boolean;

  @ApiProperty({
    description:
      'Флаг бесплатной площадки (true - бесплатная, false - платная)',
    example: true,
  })
  @IsBoolean({
    message: 'Флаг бесплатной площадки должен быть булевым значением',
  })
  isFree: boolean;

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
