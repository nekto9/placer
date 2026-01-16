import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty } from 'class-validator';
import { GridDayResponseDto } from './';

/** Сетка расписания площадки с днями и слотами */
export class GridScheduleResponseDto {
  @ApiProperty({
    description: 'Дата начала диапазона расписания',
    type: 'string',
    format: 'date',
    example: '2024-12-01',
  })
  @IsDateString({}, { message: 'Дата начала должна быть в формате YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Дата начала обязательна' })
  startDate: string;

  @ApiProperty({
    description: 'Дата окончания диапазона расписания',
    type: 'string',
    format: 'date',
    example: '2024-12-31',
  })
  @IsDateString(
    {},
    { message: 'Дата окончания должна быть в формате YYYY-MM-DD' }
  )
  @IsNotEmpty({ message: 'Дата окончания обязательна' })
  stopDate: string;

  @ApiProperty({
    description: 'Дни с расписаниями и играми в указанном диапазоне',
    isArray: true,
    type: () => GridDayResponseDto,
  })
  @IsArray({ message: 'Дни должны быть массивом' })
  days: GridDayResponseDto[];
}
