import { BullModule } from "@nestjs/bullmq";
import { forwardRef, Module } from "@nestjs/common";
import { PrismaModule } from "@/database/prisma.module";
import { GameModule } from "@/modules/game/game.module";
import { UserModule } from "@/modules/user/user.module";
import { EmailQueueModule } from "../email/emailQueue.module";
import { registerGameQueueSettings } from "./constants/game.constants";
import { GameQueueProcessor } from "./gameQueue.processor";
import { GameQueueService } from "./gameQueue.service";

@Module({
  imports: [
    EmailQueueModule,
    BullModule.registerQueue(registerGameQueueSettings),
    forwardRef(() => GameModule),
    forwardRef(() => UserModule),
    PrismaModule,
  ],
  providers: [GameQueueService, GameQueueProcessor],
  exports: [GameQueueService],
})
export class GameQueueModule {}
