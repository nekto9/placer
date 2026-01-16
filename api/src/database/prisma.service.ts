import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@/prismaClient';

/**
 * Сервис для работы с базой данных через Prisma ORM
 *
 * Расширяет PrismaClient и обеспечивает автоматическое подключение
 * к базе данных при инициализации модуля.
 *
 * @class PrismaService
 * @extends PrismaClient
 * @implements OnModuleInit
 * @description Основной сервис для всех операций с базой данных
 *
 *
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Метод жизненного цикла NestJS, вызывается при инициализации модуля
   *
   * Устанавливает соединение с базой данных при запуске приложения.
   * Если соединение не удается установить, приложение не запустится.
   *
   * @async
   * @method onModuleInit
   * @returns {Promise<void>} Promise, который разрешается после успешного подключения
   *
   * @throws {Error} Если не удается подключиться к базе данных
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    console.log('db connected');
  }
}
