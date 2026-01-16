import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/** Обновление вида спорта */
export class UpdateSportDto {
  @ApiProperty({
    description: 'Название вида спорта',
    example: 'Футбол',
    minLength: 1,
    maxLength: 50,
    required: false,
  })
  @IsString({ message: 'Название вида спорта должно быть строкой' })
  @MinLength(1, { message: 'Название вида спорта не может быть пустым' })
  @MaxLength(50, {
    message: 'Название вида спорта не может быть длиннее 50 символов',
  })
  @IsOptional()
  name?: string;
}
