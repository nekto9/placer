import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailJobData } from '@/queue/email/interfaces/emailJob.interface';

@Injectable()
export class MailSenderService {
  private readonly logger = new Logger(MailSenderService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(data: EmailJobData) {
    try {
      this.logger.log(
        `Sending email to ${data.to} with template ${data.template}`
      );

      const result = await this.mailerService.sendMail({
        to: data.to,
        subject: data.subject,
        template: data.template,
        context: data.context,
      });

      this.logger.log(`Email sent successfully: ${result.messageId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${data.to}:`, error.message);
      this.logger.error('Error details:', error);
      throw error;
    }
  }
}
