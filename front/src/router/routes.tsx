import { RouteObject } from 'react-router';
import HomePage from '@/views/home';
import { routesGame } from './routes/routesGame';
import { routesManage } from './routes/routesManage';
import { routesPlace } from './routes/routesPlace';
import { routesProfile } from './routes/routesProfile';
import { routesUsers } from './routes/routesUsers';
import { RoutesList } from './routesList';

export const routes: RouteObject[] = [
  {
    path: RoutesList.Root,
    element: <HomePage />,
  },
  ...routesPlace,
  ...routesProfile,
  ...routesGame,
  ...routesUsers,
  ...routesManage,
];
