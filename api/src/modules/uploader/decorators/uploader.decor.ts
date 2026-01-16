import {
  ApiBodyOptions,
  ApiOperationOptions,
  ApiResponseNoStatusOptions,
} from '@nestjs/swagger';

type UploaderDecor = {
  uploadAvatar: {
    operation: ApiOperationOptions;
    body: ApiBodyOptions;
    responseOk: ApiResponseNoStatusOptions;
  };
  uploadCover: {
    operation: ApiOperationOptions;
    body: ApiBodyOptions;
    responseOk: ApiResponseNoStatusOptions;
  };
};

export const uploaderDecor: UploaderDecor = {
  uploadAvatar: {
    operation: {
      summary: 'Загрузка аватара',
    },
    body: {
      description: 'Файл для загрузки',
      required: true,
      schema: {
        type: 'object',
        properties: {
          avatar: {
            type: 'string',
            format: 'binary', // Важно для отображения файлового поля в Swagger
            description: 'Файл для загрузки',
          },
          fileId: {
            type: 'string',
            description: 'Id файла для загрузки',
            format: 'uuid',
          },
        },
      },
    },
    responseOk: {
      type: String,
    },
  },

  uploadCover: {
    operation: {
      summary: 'Загрузка обложек площадки',
    },
    body: {
      description: 'Файлы для загрузки',
      required: true,
      schema: {
        type: 'object',
        properties: {
          cover: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
            description: 'Файлы для загрузки',
          },
          fileIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid',
            },
            description: 'id файлов для загрузки',
          },
        },
      },
    },
    responseOk: {
      type: String,
      isArray: true,
    },
  },
};
