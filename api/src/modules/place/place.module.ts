import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma.module';
import { GameModule } from '../game/game.module';
import { UserModule } from '../user/user.module';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';

@Module({
  imports: [PrismaModule, GameModule, forwardRef(() => UserModule)],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [PlaceService],
})
export class PlaceModule {}
