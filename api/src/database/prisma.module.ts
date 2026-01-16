import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Модуль для работы с базой данных через Prisma ORM
 *
 * Предоставляет PrismaService для всех модулей приложения,
 * которые нуждаются в доступе к базе данных.
 */
@Module({
  providers: [PrismaService], // Регистрация PrismaService как провайдера
  exports: [PrismaService], // Экспорт для использования в других модулях
})
export class PrismaModule {}
