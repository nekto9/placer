import {
  ApiOperationOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiResponseNoStatusOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { GameTimeFrame } from '@/prismaClient';
import { PaginatedResponseDto } from '@/shared/dto/paginatedResponse.dto';
import { GameResponseDto } from '../dto';

const placeIdParam = {
  name: 'placeId',
  description: 'ID площадки',
  required: true,
  type: 'string',
  format: 'uuid',
};

const slotIdParam = {
  ...placeIdParam,
  name: 'slotId',
  description: 'ID слота',
};

const gameIdParam = {
  ...placeIdParam,
  name: 'id',
  description: 'ID игры',
};

const userIdParam = {
  name: 'userId',
  description: 'ID пользователя',
  required: true,
  type: 'string',
  format: 'uuid',
};

const dateParam = {
  name: 'date',
  description: 'Дата брони',
  required: true,
  type: 'string',
  format: 'date',
};

type GameDecor = {
  createGameForSlot: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      placeId: ApiParamOptions;
      slotId: ApiParamOptions;
      date: ApiParamOptions;
    };
  };
  createGameForCustomSlot: {
    operation: ApiOperationOptions;
    params: {
      placeId: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  updateGame: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  deleteGame: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  getGameById: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  getGames: {
    operation: ApiOperationOptions;
    query: {
      startDate: ApiQueryOptions;
      stopDate: ApiQueryOptions;
      timeframe: ApiQueryOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  acceptInvite: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  rejectInvite: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  requestJoin: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  join: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  unJoin: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  declineJoin: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
      userId: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
  allowJoin: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
      userId: ApiParamOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
};

export const gameDecor: GameDecor = {
  createGameForSlot: {
    operation: {
      summary: 'Создание игры на основе существующего слота',
    },
    params: {
      placeId: placeIdParam,
      slotId: slotIdParam,
      date: dateParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  createGameForCustomSlot: {
    operation: {
      summary: 'Создание игры на основе кастомного слота',
    },
    params: {
      placeId: placeIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  updateGame: {
    operation: {
      summary: 'Обновление игры',
      description: 'Приглашение участников пока тоже только здесь',
    },
    params: {
      id: gameIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  deleteGame: {
    operation: {
      summary: 'Удаление игры',
    },
    params: {
      id: gameIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  getGameById: {
    operation: {
      summary: 'Получение игры',
    },
    params: {
      id: gameIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  getGames: {
    operation: {
      summary: 'Список игр',
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
  acceptInvite: {
    operation: {
      summary: 'Принятие приглашения в игру',
    },
    params: {
      id: gameIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  rejectInvite: {
    operation: {
      summary: 'Отклонение приглашения в игру',
    },
    params: {
      id: gameIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  requestJoin: {
    operation: {
      summary: 'Запрос на участие в игре',
      description: 'Доступно только для игр со статусом MODERATE',
    },
    params: {
      id: gameIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  join: {
    operation: {
      summary: 'Добавление себя в список участников',
      description: 'Доступно только для игр со статусом PUBLIC',
    },
    params: {
      id: gameIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  unJoin: {
    operation: {
      summary: 'Выход из участников игры',
    },
    params: {
      id: gameIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  declineJoin: {
    operation: {
      summary: 'Отклонение запроса на участие в игре',
    },
    params: {
      id: gameIdParam,
      userId: userIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
  allowJoin: {
    operation: {
      summary: 'Принятие запроса на участие в игре',
    },
    params: {
      id: gameIdParam,
      userId: userIdParam,
    },
    responseOk: {
      type: GameResponseDto,
    },
  },
};
