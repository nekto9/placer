import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

/** Продление бронирования игры */
export class ExtendReservationDto {
  @ApiProperty({
    description: 'Время продления в минутах (по умолчанию 15)',
    example: 15,
    minimum: 1,
    required: false,
  })
  @IsInt({ message: 'Время продления должно быть целым числом' })
  @Min(1, { message: 'Время продления не может быть меньше 1 минуты' })
  @IsOptional()
  extendMinutes?: number = 15;
}
