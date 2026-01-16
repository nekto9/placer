import { Module } from '@nestjs/common';
import { PlaceModule } from '@/modules/place/place.module';
import { UserModule } from '@/modules/user/user.module';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';

@Module({
  imports: [UserModule, PlaceModule],
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}
