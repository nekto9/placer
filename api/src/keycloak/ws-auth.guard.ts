import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

/**
 * Guard для аутентификации WebSocket подключений
 *
 * Проверяет JWT токен из заголовка Authorization
 */
@Injectable()
export class WsAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsAuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();

    // Получаем токен из заголовков
    const token =
      client.handshake.auth.token ||
      client.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new WsException('Unauthorized: Token is required');
    }

    try {
      // Проверяем токен через Keycloak
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.APP_KC_SECRET,
      });

      // Сохраняем данные пользователя в сокете
      client.data.user = payload;

      return true;
    } catch (error) {
      this.logger.log(error);
      throw new WsException('Unauthorized: Invalid token');
    }
  }
}
