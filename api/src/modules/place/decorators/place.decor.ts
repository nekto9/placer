import {
  ApiBodyOptions,
  ApiOperationOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiResponseNoStatusOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { GameResponseDto } from '@/modules/game/dto';
import { GameTimeFrame } from '@/prismaClient';
import { PaginatedResponseDto } from '@/shared/dto/paginatedResponse.dto';
import {
  PlaceResponseDto,
  ScheduleShortResponseDto,
  UpdateScheduleRankDto,
} from '../dto';
import { GridScheduleResponseDto } from '../dto/schedule/gridScheduleResponse.dto';

const idParam = {
  name: 'id',
  description: 'ID площадки',
  required: true,
  type: 'string',
  format: 'uuid',
};

const favoriteIdParam = {
  name: 'favoriteId',
  description: 'ID площадки для операций с избранным',
  required: true,
  type: 'string',
  format: 'uuid',
};

type PlaceDecor = {
  createPlace: {
    operation: ApiOperationOptions;
    responseCreated: ApiResponseNoStatusOptions;
  };
  getPlaces: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
  };
  getPlaceById: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
  updatePlace: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
  deletePlace: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
  getPlaceSchedules: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
  updateRankPlaceSchedules: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    body: ApiBodyOptions;
    responseOk: ApiResponseNoStatusOptions;
  };
  getPlaceSlots: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      id: ApiParamOptions;
    };
    query: {
      startDate: ApiQueryOptions;
      stopDate: ApiQueryOptions;
    };
  };
  addPlaceToFavorites: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      favoriteId: ApiParamOptions;
    };
  };
  removePlaceFromFavorites: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      favoriteId: ApiParamOptions;
    };
  };
  getPlaceFavorites: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
  };
  getPlaceGames: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
    };
    query: {
      startDate: ApiQueryOptions;
      stopDate: ApiQueryOptions;
      timeframe: ApiQueryOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
};

export const placeDecor: PlaceDecor = {
  createPlace: {
    operation: {
      summary: 'Создать новую площадку',
    },
    responseCreated: {
      description: 'Площадка создана',
      type: PlaceResponseDto,
    },
  },
  getPlaces: {
    operation: {
      summary: 'Получить список площадок с пагинацией',
    },
    responseOk: {
      description: 'Пагинированный список площадок',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto<PlaceResponseDto>) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(PlaceResponseDto) },
              },
            },
          },
        ],
      },
    },
  },
  getPlaceById: {
    operation: {
      summary: 'Получить площадку по ID',
    },
    params: { id: idParam },
    responseOk: {
      description: 'Найденная площадка',
      type: PlaceResponseDto,
    },
  },
  updatePlace: {
    operation: {
      summary: 'Обновить площадку по ID',
    },
    params: { id: idParam },
    responseOk: {
      description: 'Обновлённая площадка',
      type: PlaceResponseDto,
    },
  },
  deletePlace: {
    operation: {
      summary: 'Удалить площадку по ID',
    },
    params: { id: idParam },
    responseOk: {
      description: 'Площадка удалена',
      type: PlaceResponseDto,
    },
  },
  getPlaceSchedules: {
    operation: {
      summary: 'Расписания площадки',
    },
    params: { id: idParam },
    responseOk: {
      description: 'Ok.',
      type: () => ScheduleShortResponseDto,
      isArray: true,
    },
  },
  updateRankPlaceSchedules: {
    operation: {
      summary: 'Обновление приоритетов расписаний площадки',
      description: 'чем меньше rank, тем выше приоритет',
    },
    params: { id: idParam },
    body: { type: [UpdateScheduleRankDto] },
    responseOk: {
      description: 'Ok.',
      type: () => ScheduleShortResponseDto,
      isArray: true,
    },
  },
  getPlaceSlots: {
    operation: {
      summary: 'Дневные слоты',
    },
    params: {
      id: idParam,
    },
    query: {
      startDate: {
        name: 'startDate',
        description: 'Начало диапазона',
        required: true,
        type: 'string',
        format: 'date',
      },
      stopDate: {
        name: 'stopDate',
        description: 'Конец диапазона',
        required: true,
        type: 'string',
        format: 'date',
      },
    },
    responseOk: {
      type: GridScheduleResponseDto,
      description: 'Список слотов',
    },
  },
  addPlaceToFavorites: {
    operation: {
      summary: 'Добавить площадку в избранное',
      description:
        'Добавляет указанную площадку в список избранных текущего пользователя',
    },
    responseOk: {
      description: 'Площадка успешно добавлена в избранное',
      type: PlaceResponseDto,
    },
    params: {
      favoriteId: favoriteIdParam,
    },
  },
  removePlaceFromFavorites: {
    operation: {
      summary: 'Удалить площадку из избранного',
      description:
        'Удаляет указанную площадку из списка избранных текущего пользователя',
    },
    responseOk: {
      description: 'Площадка успешно удален из избранного',
      type: PlaceResponseDto,
    },
    params: {
      favoriteId: favoriteIdParam,
    },
  },
  getPlaceFavorites: {
    operation: {
      summary: 'Получить список избранных площадок',
      description:
        'Возвращает список всех площадок, добавленных в избранное текущим пользователем',
    },
    responseOk: {
      description: 'Пагинированный список избранных площадок',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto<PlaceResponseDto>) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(PlaceResponseDto) },
              },
            },
          },
        ],
      },
    },
  },
  getPlaceGames: {
    operation: {
      summary: 'Список игр',
    },
    params: {
      id: idParam,
    },
    query: {
      startDate: {
        name: 'startDate',
        description: 'Начало диапазона',
        required: false,
        type: 'string',
        format: 'date',
      },
      stopDate: {
        name: 'stopDate',
        description: 'Конец диапазона',
        required: false,
        type: 'string',
        format: 'date',
      },
      timeframe: {
        name: 'timeframe',
        description: 'Фильтр по датам игр',
        required: false,
        enum: GameTimeFrame,
        enumName: 'GameTimeFrame',
      },
    },
    responseOk: {
      description: 'Пагинированный список игр',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto<GameResponseDto>) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(GameResponseDto) },
              },
            },
          },
        ],
      },
    },
  },
};
