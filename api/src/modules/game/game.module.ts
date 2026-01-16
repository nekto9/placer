import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma.module';
import { GameQueueModule } from '@/queue/game/gameQueue.module';
import { UserModule } from '../user/user.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

/**
 * Модуль управления играми
 *
 * Предоставляет функциональность для создания, управления и участия в играх.
 * Включает в себя создание игр на основе существующих временных слотов или
 * кастомных слотов, управление участниками, отправку приглашений и уведомлений.
 */
@Module({
  imports: [
    PrismaModule, // Доступ к базе данных
    forwardRef(() => UserModule),
    forwardRef(() => GameQueueModule), // Очередь для игровых уведомлений и задач
  ],
  controllers: [GameController], // REST API контроллер для игр
  providers: [GameService], // Бизнес-логика работы с играми
  exports: [GameService],
})
export class GameModule {}
