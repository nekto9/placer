import { RouteObject } from 'react-router';
import { GameTimeFrame } from '@/store/api';
import { GameAction } from '@/views/game/gameAction/GameAction';
import GameDetailsPage from '@/views/game/gameDetails';
import GameEditPage from '@/views/game/gameEdit';
import GamesListPage from '@/views/game/gamesList';
import { RoutesList } from '../routesList';

// ВНИМАТЕЛЬНО!!!
// Структура пути для типа списка игр и id игры совпадает, поэтому порядок важен
// /games/upcoming ~ /games/personal ~ /games/gameId

/** Роуты для игр */
export const routesGame: RouteObject[] = [
  {
    path: RoutesList.Game.getGamesList(),
    element: <GamesListPage />,
  },
  {
    path: RoutesList.Game.getAllGamesList(),
    element: <GamesListPage timeFrame={GameTimeFrame.All} />,
  },
  {
    path: RoutesList.Game.getPastGamesList(),
    element: <GamesListPage timeFrame={GameTimeFrame.Past} />,
  },
  {
    path: RoutesList.Game.getPersonalGamesList(),
    element: <GamesListPage isPersonal />,
  },
  {
    path: RoutesList.Game.getPersonalAllGamesList(),
    element: <GamesListPage isPersonal timeFrame={GameTimeFrame.All} />,
  },
  {
    path: RoutesList.Game.getPersonalPastGamesList(),
    element: <GamesListPage isPersonal timeFrame={GameTimeFrame.Past} />,
  },
  {
    path: RoutesList.Game.getGameDetails(':gameId'),
    element: <GameDetailsPage />,
  },
  {
    path: RoutesList.Game.getGameEdit(':gameId'),
    element: <GameEditPage />,
  },
  {
    path: RoutesList.Game.getGameAcceptInvite(':gameId'),
    element: <GameAction action="accept" />,
  },
];
