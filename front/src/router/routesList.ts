import { RoutesConst } from './routeConstant';
import { RoutesListGame } from './routesPath/routesListGame';
import { RoutesListManage } from './routesPath/routesListManage';
import { RoutesListPlace } from './routesPath/routesListPlace';
import { RoutesListProfile } from './routesPath/routesListProfile';
import { RoutesListUsers } from './routesPath/routesListUsers';

export const RoutesList = {
  /** Корень */
  Root: RoutesConst.ROOT,

  Profile: RoutesListProfile,

  Place: RoutesListPlace,

  Game: RoutesListGame,

  Users: RoutesListUsers,

  Manage: RoutesListManage,
};
