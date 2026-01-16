import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailSenderModule } from '@/mailSender/mailSender.module';
import { registerEmailQueueSettings } from './constants/email.constants';
import { EmailQueueProcessor } from './emailQueue.processor';
import { EmailQueueService } from './emailQueue.service';

@Module({
  imports: [
    BullModule.registerQueue(registerEmailQueueSettings),
    MailSenderModule,
  ],
  providers: [EmailQueueService, EmailQueueProcessor],
  exports: [EmailQueueService],
})
export class EmailQueueModule {}
