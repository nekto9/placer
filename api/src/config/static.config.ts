import { join } from 'path';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';

/** Константы путей */
export enum StaticPath {
  PUBLIC = 'public',

  UPLOADS = 'uploads',

  AVATAR = 'avatar',

  COVER = 'cover',

  RAW = 'raw',

  SMALL = 'small',
}

const serveStaticOptionsDefault = {
  index: false, // отключаем index.html по умолчанию
  dotfiles: 'deny', // запрещаем доступ к файлам, начинающимся с точки
  cacheControl: true, // включаем кэширование
  maxAge: 3600000, // время кэширования (1 час)
  etag: true, // включаем ETag
};

/** Настройки папок со статикой для app.module */
export const staticFolderOptions: Record<string, ServeStaticModuleOptions> = {
  Public: {
    rootPath: join(process.cwd(), StaticPath.PUBLIC), // путь до папки
    serveRoot: `/${StaticPath.PUBLIC}`, // по какому URL будет доступно
  },
  Avatar: {
    rootPath: join(
      process.cwd(),
      StaticPath.UPLOADS,
      StaticPath.AVATAR,
      StaticPath.SMALL
    ), // путь до папки
    serveRoot: `/${StaticPath.AVATAR}`, // по какому URL будет доступно
    serveStaticOptions: serveStaticOptionsDefault,
  },
  Cover: {
    rootPath: join(
      process.cwd(),
      StaticPath.UPLOADS,
      StaticPath.COVER,
      StaticPath.SMALL
    ), // путь до папки
    serveRoot: `/${StaticPath.COVER}`, // по какому URL будет доступно
    serveStaticOptions: serveStaticOptionsDefault,
  },
};
