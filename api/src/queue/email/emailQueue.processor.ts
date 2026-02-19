import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailSenderService } from '@/mailSender/mailSender.service';
import {
  EMAIL_JOB_NAMES,
  EMAIL_RESULT_STATUSES,
  QUEUE_NAMES,
} from './constants/email.constants';
import { EmailJobData, EmailJobResult } from './interfaces/emailJob.interface';

@Processor(QUEUE_NAMES.EMAIL)
export class EmailQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailQueueProcessor.name);

  constructor(private readonly emailService: MailSenderService) {
    super();
  }

  async process(
    job: Job<EmailJobData, EmailJobResult, string>
  ): Promise<EmailJobResult> {
    // Валидация входных данных
    if (!job.data?.to || !this.isValidEmail(job.data.to)) {
      throw new Error('Invalid email address');
    }

    try {
      let result: EmailJobResult;

      switch (job.name) {
        case EMAIL_JOB_NAMES.SEND_INVITE:
          result = await this.sendInvite(job.data);
          break;
        case EMAIL_JOB_NAMES.SEND_JOIN_REQUEST:
          result = await this.sendJoinRequest(job.data);
          break;
        case EMAIL_JOB_NAMES.SEND_MESSAGE:
          result = await this.sendMessage(job.data);
          break;
        default:
          throw new Error(`Unknown job name: ${job.name}`);
      }

      return result;
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  private async sendInvite(data: EmailJobData): Promise<EmailJobResult> {
    await this.emailService.sendEmail(data);

    return {
      status: EMAIL_RESULT_STATUSES.SENT,
      messageId: `invite-${Date.now()}`,
      timestamp: Date.now(),
    };
  }

  private async sendJoinRequest(data: EmailJobData): Promise<EmailJobResult> {
    await this.emailService.sendEmail(data);

    return {
      status: EMAIL_RESULT_STATUSES.SENT,
      messageId: `request-${Date.now()}`,
      timestamp: Date.now(),
    };
  }

  private async sendMessage(data: EmailJobData): Promise<EmailJobResult> {
    await this.emailService.sendEmail(data);

    return {
      status: EMAIL_RESULT_STATUSES.SENT,
      messageId: `message-${Date.now()}`,
      timestamp: Date.now(),
    };
  }
}
