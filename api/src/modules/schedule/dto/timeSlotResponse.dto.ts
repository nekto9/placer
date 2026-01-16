import { ApiProperty } from '@nestjs/swagger';

/** Временной слот в расписании */
export class TimeSlotResponseDto {
  @ApiProperty({
    description: 'ID временного слота',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Время начала слота (в минутах от начала дня)',
  })
  timeStart: number;

  @ApiProperty({
    description: 'Время окончания слота (в минутах от начала дня)',
  })
  timeEnd: number;
}
