import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/** Обновление города */
export class UpdateCityDto {
  @ApiProperty({
    description: 'Название города',
    example: 'Футбол',
    minLength: 1,
    maxLength: 50,
    required: false,
  })
  @IsString({ message: 'Название города должно быть строкой' })
  @MinLength(1, { message: 'Название города не может быть пустым' })
  @MaxLength(50, {
    message: 'Название города не может быть длиннее 50 символов',
  })
  @IsOptional()
  name?: string;
}
