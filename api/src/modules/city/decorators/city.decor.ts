import {
  ApiOperationOptions,
  ApiParamOptions,
  ApiResponseNoStatusOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from '@/shared/dto/paginatedResponse.dto';
import { CityResponseDto } from '../dto';

const idParam: ApiParamOptions = {
  name: 'id',
  description: 'ID города',
  required: true,
  type: 'string',
  format: 'uuid',
  example: '123e4567-e89b-12d3-a456-426614174000',
};

type CityDecor = {
  createCity: {
    operation: ApiOperationOptions;
    responseCreated: ApiResponseNoStatusOptions;
  };
  getCities: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
  };
  getCityById: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
  updateCity: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
  deleteCity: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
};

export const cityDecor: CityDecor = {
  createCity: {
    operation: {
      summary: 'Создание города',
    },
    responseCreated: {
      description: 'Город успешно создан',
      type: CityResponseDto,
    },
  },
  getCities: {
    operation: {
      summary: 'Получение списка городов',
    },
    responseOk: {
      description: 'Список городов',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto<CityResponseDto>) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(CityResponseDto) },
              },
            },
          },
        ],
      },
    },
  },
  getCityById: {
    operation: {
      summary: 'Получение города по ID',
    },
    params: { id: idParam },
    responseOk: {
      description: 'Город найден',
      type: CityResponseDto,
    },
  },
  updateCity: {
    operation: {
      summary: 'Обновление города',
    },
    params: { id: idParam },
    responseOk: {
      description: 'Город успешно обновлен',
      type: CityResponseDto,
    },
  },
  deleteCity: {
    operation: {
      summary: 'Удаление города',
    },
    params: { id: idParam },
    responseOk: {
      description: 'Город успешно удален',
    },
  },
};
