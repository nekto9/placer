import {
  ApiOperationOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiResponseNoStatusOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { GameResponseDto } from '@/modules/game/dto';
import { GameTimeFrame, GameUserStatus } from '@/prismaClient';
import { PaginatedResponseDto } from '@/shared/dto/paginatedResponse.dto';
import { UserResponseDto } from '../dto';
import { DeepLinkDto } from '../dto/deepLink.dto';

const idParam = {
  name: 'id',
  description: 'ID пользователя',
  required: true,
  type: 'string',
  format: 'uuid',
};

const subParam = {
  name: 'sub',
  description: 'Sub пользователя',
  required: true,
  type: 'string',
  format: 'uuid',
};

const favoriteIdParam = {
  name: 'favoriteId',
  description: 'ID пользователя для операций с избранным',
  required: true,
  type: 'string',
  format: 'uuid',
};

type UserDecor = {
  getUserById: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      id: ApiParamOptions;
    };
  };
  getUserBySub: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      sub: ApiParamOptions;
    };
  };
  getUsers: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
  };

  updateUser: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      id: ApiParamOptions;
    };
  };
  deleteUser: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      id: ApiParamOptions;
    };
  };
  linkAuthUser: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      id: ApiParamOptions;
    };
  };
  deepLink: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
  };
  removeTgLink: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
  };
  addUserToFavorites: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      favoriteId: ApiParamOptions;
    };
  };
  removeUserFromFavorites: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      favoriteId: ApiParamOptions;
    };
  };
  getUserFavorites: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
  };
  checkUserInFavorites: {
    operation: ApiOperationOptions;
    responseOk: ApiResponseNoStatusOptions;
    params: {
      favoriteId: ApiParamOptions;
    };
  };
  getUserGames: {
    operation: ApiOperationOptions;
    params: {
      id: ApiParamOptions;
    };
    query: {
      startDate: ApiQueryOptions;
      stopDate: ApiQueryOptions;
      timeframe: ApiQueryOptions;
      memberStatuses: ApiQueryOptions;
    };
    responseOk: ApiResponseNoStatusOptions;
  };
};

/** Параметры декораторов для операций с пользователем */
export const userDecor: UserDecor = {
  getUserById: {
    operation: {
      summary: 'Получение пользователя по ID',
    },
    responseOk: {
      description: 'Пользователь',
      type: UserResponseDto,
    },
    params: {
      id: idParam,
    },
  },
  getUserBySub: {
    operation: {
      summary: 'Получение пользователя по sub',
    },
    responseOk: {
      description: 'Пользователь',
      type: UserResponseDto,
    },
    params: {
      sub: subParam,
    },
  },
  getUsers: {
    operation: {
      summary: 'Список пользователей',
    },
    responseOk: {
      description: 'Пагинированный список пользователей',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto<UserResponseDto>) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UserResponseDto) },
              },
            },
          },
        ],
      },
    },
  },

  updateUser: {
    operation: {
      summary: 'Обновление пользователя',
    },
    responseOk: {
      description: 'Пользователь обновлен',
      type: UserResponseDto,
    },
    params: {
      id: idParam,
    },
  },
  deleteUser: {
    operation: {
      summary: 'Удаление пользователя',
    },
    responseOk: {
      description: 'Пользователь удален',
      type: UserResponseDto,
    },
    params: {
      id: idParam,
    },
  },
  linkAuthUser: {
    operation: {
      summary: 'Привязка пользователя к auth',
    },
    responseOk: {
      description: 'Пользователь привязан',
      type: UserResponseDto,
    },
    params: {
      id: idParam,
    },
  },
  deepLink: {
    operation: {
      summary: 'Получение deepLink для связи с аккаунтом телеги',
    },
    responseOk: {
      description: 'deepLink отправлен',
      type: DeepLinkDto,
    },
  },
  removeTgLink: {
    operation: {
      summary: 'Удаление связи аккаунта с телегой',
    },
    responseOk: {
      description: 'Связь удалена',
      type: UserResponseDto,
    },
  },
  addUserToFavorites: {
    operation: {
      summary: 'Добавить пользователя в избранное',
      description:
        'Добавляет указанного пользователя в список избранных текущего пользователя',
    },
    responseOk: {
      description: 'Пользователь успешно добавлен в избранное',
      type: UserResponseDto,
    },
    params: {
      favoriteId: favoriteIdParam,
    },
  },
  removeUserFromFavorites: {
    operation: {
      summary: 'Удалить пользователя из избранного',
      description:
        'Удаляет указанного пользователя из списка избранных текущего пользователя',
    },
    responseOk: {
      description: 'Пользователь успешно удален из избранного',
      type: UserResponseDto,
    },
    params: {
      favoriteId: favoriteIdParam,
    },
  },
  getUserFavorites: {
    operation: {
      summary: 'Получить список избранных пользователей',
      description:
        'Возвращает список всех пользователей, добавленных в избранное текущим пользователем',
    },
    responseOk: {
      description: 'Пагинированный список избранных пользователей',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto<UserResponseDto>) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UserResponseDto) },
              },
            },
          },
        ],
      },
    },
  },
  checkUserInFavorites: {
    operation: {
      summary: 'Проверить, находится ли пользователь в избранном',
      description:
        'Проверяет, добавлен ли указанный пользователь в избранное текущего пользователя',
    },
    responseOk: {
      description: 'Результат проверки',
      schema: {
        type: 'object',
        properties: {
          isFavorite: { type: 'boolean', example: true },
        },
      },
    },
    params: {
      favoriteId: favoriteIdParam,
    },
  },

  getUserGames: {
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
      memberStatuses: {
        name: 'memberStatuses',
        description: 'Фильтр по статусам участников',
        required: false,
        type: [String],
        enum: GameUserStatus,
        enumName: 'GameUserStatus',
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
