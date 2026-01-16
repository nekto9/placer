import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/** Создание вида спорта */
export class CreateSportDto {
  @ApiProperty({
    description: 'Название вида спорта',
    example: 'Футбол',
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: 'Название вида спорта должно быть строкой' })
  @IsNotEmpty({ message: 'Название вида спорта обязательно для заполнения' })
  @MinLength(1, { message: 'Название вида спорта не может быть пустым' })
  @MaxLength(50, {
    message: 'Название вида спорта не может быть длиннее 50 символов',
  })
  name: string;
}
