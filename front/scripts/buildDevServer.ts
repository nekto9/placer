import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { BuildOptions } from './types';

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
  return {
    port: options.port ?? 3000,
    open: true,
    historyApiFallback: true,
    hot: true,

    // host: '0.0.0.0', // Обязательно для Docker

    // // Настройки сокета для работы через Traefik
    // client: {
    //   webSocketURL: {
    //     hostname: 'app.localhost', // Внешний адрес
    //     pathname: '/ws', // Стандартный путь для webpack-dev-server
    //     port: 443, // Порт, по которому открывается соединение в браузере
    //     protocol: 'wss', // Используем Secure WebSocket, для TLS в Traefik
    //   },
    //   overlay: true, // Показывать ошибки сборки прямо на экране
    // },

    // allowedHosts: [
    //   'app.localhost', // Разрешаем обращения по этому хосту
    // ],

    // // Настройка для Windows
    // watchFiles: {
    //   paths: ['src/**/*'],
    //   options: {
    //     usePolling: true, // Включаем опрос для Windows-хостов
    //   },
    // },
  };
}
