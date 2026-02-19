import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * WebSocket шлюз для real-time событий игр
 *
 * Предоставляет события:
 * - game:reserved — слот забронирован
 * - game:released — слот освобождён
 * - game:updated — игра обновлена
 */
@WebSocketGateway({
  cors: {
    origin: process.env.WS_CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  },
  namespace: 'games',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  /**
   * Обработка подключения клиента
   */
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  /**
   * Обработка отключения клиента
   */
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Подписка на комнату площадки
   *
   * Клиенты подписываются на события конкретной площадки
   */
  @SubscribeMessage('subscribe:place')
  handleSubscribeToPlace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { placeId: string }
  ) {
    console.log('[WebSocket] Received subscribe:place:', data.placeId, 'from client:', client.id);
    client.join(`place:${data.placeId}`);
    console.log('[WebSocket] Client', client.id, 'joined room:', `place:${data.placeId}`);
  }

  /**
   * Отписка от комнаты площадки
   */
  @SubscribeMessage('unsubscribe:place')
  handleUnsubscribeFromPlace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { placeId: string }
  ) {
    client.leave(`place:${data.placeId}`);
    console.log(`Client ${client.id} unsubscribed from place:${data.placeId}`);
  }

  /**
   * Отправка события о бронировании игры
   *
   * @param placeId ID площадки
   * @param data Данные о забронированной игре
   */
  sendGameReserved(
    placeId: string,
    data: { gameId: string; date: string; timeStart: number; timeEnd: number }
  ) {
    this.server.to(`place:${placeId}`).emit('game:reserved', data);
  }

  /**
   * Отправка события об освобождении слота
   *
   * @param placeId ID площадки
   * @param data Данные об освобождённом слоте
   */
  sendGameReleased(placeId: string, data: { gameId: string; date: string }) {
    this.server.to(`place:${placeId}`).emit('game:released', data);
  }

  /**
   * Отправка события об обновлении игры
   *
   * @param placeId ID площадки
   * @param data Обновлённые данные игры
   */
  sendGameUpdated(
    placeId: string,
    data: {
      gameId: string;
      date: string;
      timeStart: number;
      timeEnd: number;
      status: string;
    }
  ) {
    this.server.to(`place:${placeId}`).emit('game:updated', data);
  }
}
