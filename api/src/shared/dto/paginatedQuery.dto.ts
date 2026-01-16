import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

/**
 * DTO для параметров пагинации в запросах
 *
 * Используется как базовый класс для всех запросов, которые поддерживают пагинацию.
 * Обеспечивает стандартизированный подход к разбивке результатов на страницы.
 */
export class PaginatedQueryDto {
  /**
   * Номер страницы для пагинации
   */
  @ApiProperty({
    description: 'Номер страницы (начиная с 1)',
    type: Number,
    required: false,
    default: 1,
    minimum: 1,
    maximum: 10000,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Номер страницы должен быть числом' })
  @IsPositive({ message: 'Номер страницы должен быть положительным числом' })
  @Min(1, { message: 'Номер страницы не может быть меньше 1' })
  @Max(10000, { message: 'Номер страницы не может быть больше 10000' })
  page?: number = 1;

  /**
   * Количество элементов на странице
   */
  @ApiProperty({
    description: 'Количество элементов на странице',
    type: Number,
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Лимит должен быть числом' })
  @IsPositive({ message: 'Лимит должен быть положительным числом' })
  @Min(1, { message: 'Лимит не может быть меньше 1' })
  @Max(100, { message: 'Лимит не может быть больше 100' })
  limit?: number = 10;
}
