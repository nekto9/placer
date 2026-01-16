import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/** Создание города */
export class CreateCityDto {
  @ApiProperty({
    description: 'Название города',
    example: 'Футбол',
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: 'Название города должно быть строкой' })
  @IsNotEmpty({ message: 'Название города обязательно для заполнения' })
  @MinLength(1, { message: 'Название города не может быть пустым' })
  @MaxLength(50, {
    message: 'Название города не может быть длиннее 50 символов',
  })
  name: string;
}
