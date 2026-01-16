import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailSenderService } from './mailSender.service';

/**
 * Модуль отправки электропочты
 */
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule], // нужно для доступа к ConfigService
      useFactory: (configService: ConfigService) => ({
        defaults: {
          from: `"Splacer" <${configService.get('MAIL_USER')}>`,
        },
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT', 587),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        pool: true, // Использовать пул соединений (быстрее при массовой отправке)
        maxConnections: 5,
        rateLimit: 5, // Максимум 5 писем в секунду
        tls: {
          rejectUnauthorized: false, // Для разработки
        },
        debug: configService.get<string>('NODE_ENV') === 'development', // Включить отладку в dev режиме
        logger: configService.get<string>('NODE_ENV') === 'development', // Логирование SMTP,
        template: {
          dir: join(__dirname, '..', 'templates', 'email'),
          adapter: new EjsAdapter({
            // Настройка inline CSS для EJS
            inlineCssEnabled: true,
            inlineCssOptions: {
              keepStyleTags: false,
              keepLinkTags: false,
            },
          }),
        },
        options: {
          strict: true,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    MailSenderService, // Сервис для отправки сообщений
  ],
  exports: [MailSenderService], // Экспортируем сервис для использования в других модулях
})
export class MailSenderModule {}
