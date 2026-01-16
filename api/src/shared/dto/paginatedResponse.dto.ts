import { ApiProperty, ApiQueryOptions } from '@nestjs/swagger';

/**
 * Метаданные пагинации для ответов API
 *
 * Содержит информацию о текущем состоянии пагинации:
 * общее количество элементов, текущая страница, лимит и общее количество страниц.
 *
 */
export class PaginationMeta {
  /**
   * Общее количество элементов в коллекции
   */
  @ApiProperty({
    description: 'Общее количество элементов в коллекции',
    type: Number,
    example: 150,
    minimum: 0,
  })
  total: number;

  /**
   * Номер текущей страницы
   */
  @ApiProperty({
    description: 'Номер текущей страницы',
    type: Number,
    example: 1,
    minimum: 1,
  })
  page: number;

  /**
   * Количество элементов на текущей странице
   */
  @ApiProperty({
    description: 'Количество элементов на текущей странице',
    type: Number,
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  limit: number;

  /**
   * Общее количество страниц
   */
  @ApiProperty({
    description: 'Общее количество страниц',
    type: Number,
    example: 15,
    minimum: 0,
  })
  pages: number;
}

/**
 * Стандартный DTO для пагинированных ответов API
 *
 * Используется для всех эндпоинтов, которые возвращают списки с пагинацией.
 * Обеспечивает единообразный формат ответов во всем приложении.
 */
export class PaginatedResponseDto<T> {
  /**
   * Массив элементов текущей страницы
   */
  @ApiProperty({
    description: 'Массив элементов текущей страницы',
    isArray: true,
  })
  items: T[];

  /**
   * Метаданные пагинации
   */
  @ApiProperty({
    description: 'Метаданные пагинации (информация о страницах)',
    type: PaginationMeta,
  })
  meta: PaginationMeta;
}

/**
 * Предопределенные опции для Swagger документации пагинированных запросов
 *
 * Используется в декораторах @ApiQuery для стандартизации документации
 * параметров пагинации во всех контроллерах.
 */
export const PaginatedQueryOptions: Record<string, ApiQueryOptions> = {
  /** Опции для параметра page */
  page: {
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы (по умолчанию 1, минимум 1, максимум 10000)',
    example: 1,
  },
  /** Опции для параметра limit */
  limit: {
    name: 'limit',
    required: false,
    type: Number,
    description:
      'Количество элементов на странице (по умолчанию 10, минимум 1, максимум 100)',
    example: 10,
  },
  /** Опции для параметра text (поиск) */
  text: {
    name: 'text',
    required: false,
    type: String,
    description: 'Поисковый запрос для фильтрации результатов',
    example: 'поиск',
  },
};
