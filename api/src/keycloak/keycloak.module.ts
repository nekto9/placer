import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';

@Global()
@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      // Нужно импортировать ConfigModule, чтобы использовать ConfigService
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        authServerUrl: configService.get<string>('AUTH_SERVER_URL'),
        realm: configService.get<string>('APP_KC_REALM'),
        clientId: configService.get<string>('APP_KC_CLIENT_ID'),
        secret: configService.get<string>('APP_KC_SECRET'),
        policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
        tokenValidation: TokenValidation.ONLINE,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      // Благодаря этому ВСЕ запросы должны быть авторизованы
      // Если какой-то метод нужен публичным, нужно добавлять
      // ему декоратор @Public принудительно
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [KeycloakConnectModule],
})
export class KeycloakModule {}
