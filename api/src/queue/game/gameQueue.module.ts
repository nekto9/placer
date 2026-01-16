import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { GameModule } from '@/modules/game/game.module';
import { UserModule } from '@/modules/user/user.module';
import { TelegramModule } from '@/telegram/telegram.module';
import { EmailQueueModule } from '../email/emailQueue.module';
import { registerGameQueueSettings } from './constants/game.constants';
import { GameQueueProcessor } from './gameQueue.processor';
import { GameQueueService } from './gameQueue.service';

@Module({
  imports: [
    EmailQueueModule,
    TelegramModule,
    BullModule.registerQueue(registerGameQueueSettings),
    forwardRef(() => GameModule),
    forwardRef(() => UserModule),
  ],
  providers: [GameQueueService, GameQueueProcessor],
  exports: [GameQueueService],
})
export class GameQueueModule {}
