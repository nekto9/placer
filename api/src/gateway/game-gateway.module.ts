import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';

/**
 * Модуль WebSocket шлюза для событий игр
 */
@Module({
  providers: [GameGateway],
  exports: [GameGateway],
})
export class GameGatewayModule {}
