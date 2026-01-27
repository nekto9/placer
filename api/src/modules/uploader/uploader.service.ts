import fs from 'fs';
import path from 'path';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';
import { StaticPath } from '@/config/static.config';
import { PlaceService } from '@/modules/place/place.service';
import { UserService } from '@/modules/user/user.service';
import { getFileExtension } from '@/tools/file';

const AVATAR_SIZE = 150;
const COVER_WIDTH = 1200;
const COVER_HEIGHT = 400;
@Injectable()
export class UploaderService {
  constructor(
    private userService: UserService,
    private placeService: PlaceService
  ) {}

  /** Загрузка автатара */
  async uploadAvatar(
    file: Express.Multer.File,
    fileId: string
  ): Promise<string> {
    try {
      const fileExtension = getFileExtension(file.originalname);

      // Загружаемый файл переименовываем
      const fileUniqueId = fileId; //newGuid();

      // Исходник пишем без изменений типа
      const rawFileName = `${fileUniqueId}.${fileExtension}`;

      const rawDir = path.join(
        process.cwd(),
        StaticPath.UPLOADS,
        StaticPath.AVATAR,
        StaticPath.RAW
      );

      // Проверяем папки на наличие
      if (!fs.existsSync(rawDir)) {
        fs.mkdirSync(rawDir, { recursive: true });
      }

      // Пишем исходник
      const rawFilepath = path.join(rawDir, rawFileName);
      fs.writeFileSync(rawFilepath, file.buffer);

      const smallDir = path.join(
        process.cwd(),
        StaticPath.UPLOADS,
        StaticPath.AVATAR,
        StaticPath.SMALL
      );

      if (!fs.existsSync(smallDir)) {
        fs.mkdirSync(smallDir, { recursive: true });
      }

      // Генерим сам аватар
      const processedBuffer = await sharp(file.buffer)
        .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover' })
        .jpeg({ quality: 75 })
        .toBuffer();

      const smallFileName = `${fileUniqueId}.jpg`;

      // Пишем аватар
      const smallFilepath = path.join(smallDir, smallFileName);
      fs.writeFileSync(smallFilepath, processedBuffer);

      return fileUniqueId;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  /** Загрузка обложки */
  async uploadCover(
    files: Express.Multer.File[],
    fileIds: string[]
  ): Promise<string[]> {
    try {
      const result = await Promise.all(
        files.map(async (file, index) => {
          const fileExtension = getFileExtension(file.originalname);

          // Загружаемый файл переименовываем
          const fileUniqueId = fileIds[index]; //newGuid();

          // Исходник пишем без изменений типа
          const rawFileName = `${fileUniqueId}.${fileExtension}`;

          const rawDir = path.join(
            process.cwd(),
            StaticPath.UPLOADS,
            StaticPath.COVER,
            StaticPath.RAW
          );

          // Проверяем папки на наличие
          if (!fs.existsSync(rawDir)) {
            fs.mkdirSync(rawDir, { recursive: true });
          }

          // Пишем исходник
          const rawFilepath = path.join(rawDir, rawFileName);
          fs.writeFileSync(rawFilepath, file.buffer);

          const smallDir = path.join(
            process.cwd(),
            StaticPath.UPLOADS,
            StaticPath.COVER,
            StaticPath.SMALL
          );

          if (!fs.existsSync(smallDir)) {
            fs.mkdirSync(smallDir, { recursive: true });
          }

          // Генерим обложку для отображения
          const processedBuffer = await sharp(file.buffer)
            .resize(COVER_WIDTH, COVER_HEIGHT, { fit: 'cover' })
            .jpeg({ quality: 75 })
            .toBuffer();

          const smallFileName = `${fileUniqueId}.jpg`;

          // Пишем файл
          const smallFilepath = path.join(smallDir, smallFileName);
          fs.writeFileSync(smallFilepath, processedBuffer);

          return fileUniqueId;
        })
      );

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('File upload failed');
    }
  }
}
