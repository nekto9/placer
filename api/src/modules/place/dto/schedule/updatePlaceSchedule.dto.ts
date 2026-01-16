import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';

/** Обновление веса расписания площадки */
export class UpdateScheduleRankDto {
  @ApiProperty({
    description: 'ID расписания',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'ID расписания должен быть валидным UUID' })
  @IsNotEmpty({ message: 'ID расписания обязателен для заполнения' })
  id: string;

  @ApiProperty({
    description: 'Вес расписания (чем меньше цифра, тем выше приоритет)',
    example: 1,
    minimum: 0,
    maximum: 1000,
  })
  @IsNumber({}, { message: 'Вес расписания должен быть числом' })
  @Min(0, { message: 'Вес расписания не может быть отрицательным' })
  @Max(1000, { message: 'Вес расписания не может быть больше 1000' })
  rank: number;
}
