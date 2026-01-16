import {
  ApiOperationOptions,
  ApiParamOptions,
  ApiResponseNoStatusOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from '@/shared/dto/paginatedResponse.dto';
import { SportResponseDto } from '../dto';

const idParam: ApiParamOptions = {
  name: 'id',
  description: 'ID вида спорта',
  required: true,
  type: 'string',
  format: 'uuid',
  example: '123e4567-e89b-12d3-a456-426614174000',
};

type SportDecor = {
  createSport: {
    operation: ApiOperationOptions;
    responseCreated: ApiResponseNoStatusOptions;
  };
  getSports: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
  };
  getSportById: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
  updateSport: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
  deleteSport: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
};

export const sportDecor: SportDecor = {
  createSport: {
    operation: {
      summary: 'Создание вида спорта',
    },
    responseCreated: {
      description: 'Вид спорта успешно создан',
      type: SportResponseDto,
    },
  },
  getSports: {
    operation: {
      summary: 'Получение списка видов спорта',
    },
    responseOk: {
      description: 'Список видов спорта',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto<SportResponseDto>) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(SportResponseDto) },
              },
            },
          },
        ],
      },
    },
  },
  getSportById: {
    operation: {
      summary: 'Получение вида спорта по ID',
    },
    params: { id: idParam },
    responseOk: {
      description: 'Вид спорта найден',
      type: SportResponseDto,
    },
  },
  updateSport: {
    operation: {
      summary: 'Обновление вида спорта',
    },
    params: { id: idParam },
    responseOk: {
      description: 'Вид спорта успешно обновлен',
      type: SportResponseDto,
    },
  },
  deleteSport: {
    operation: {
      summary: 'Удаление вида спорта',
    },
    params: { id: idParam },
    responseOk: {
      description: 'Вид спорта успешно удален',
    },
  },
};
