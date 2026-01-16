import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma.module';
import { HelperQueueModule } from '@/queue/helper/helperQueue.module';
import { GameModule } from '../game/game.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, forwardRef(() => GameModule), HelperQueueModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
