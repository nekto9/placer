import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { uploaderDecor } from './decorators';
import { UploadAvatarDto } from './dto/UploadAvatarDto';
import { UploadCoverDto } from './dto/UploadCoverDto';
import { UploaderService } from './uploader.service';

@Controller('upload')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  /** Загрузка аватара */
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation(uploaderDecor.uploadAvatar.operation)
  @ApiConsumes('multipart/form-data')
  @ApiBody(uploaderDecor.uploadAvatar.body)
  @ApiOkResponse(uploaderDecor.uploadAvatar.responseOk)
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      })
    )
    file: Express.Multer.File,
    @Body() dto: UploadAvatarDto
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const result = await this.uploaderService.uploadAvatar(file, dto.fileId);

    return result;
  }

  /** Загрузка обложки для площадки (мультифайл) */
  @Post('cover')
  @UseInterceptors(FilesInterceptor('cover', 10))
  @ApiOperation(uploaderDecor.uploadCover.operation)
  @ApiConsumes('multipart/form-data')
  @ApiBody(uploaderDecor.uploadCover.body)
  @ApiOkResponse(uploaderDecor.uploadCover.responseOk)
  async uploadCover(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          // new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      })
    )
    files: Express.Multer.File[],
    @Body() dto: UploadCoverDto
  ): Promise<string[]> {
    if (!files.length) {
      throw new BadRequestException('File is required');
    }

    const result = await this.uploaderService.uploadCover(files, dto.fileIds);

    return result;
  }
}
