import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@/prismaClient';

/**
 * Сервис для работы с базой данных через Prisma ORM
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  /**
   * Подключение к базе данных при инициализации модуля
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('db connected');
  }
}
