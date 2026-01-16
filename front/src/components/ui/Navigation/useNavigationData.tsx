import { useLocation, useNavigate } from 'react-router';
import { PaperPlane, Person, Persons, TargetDart } from '@gravity-ui/icons';
import { MenuItem } from '@gravity-ui/navigation';
import { useAuthContext } from '@/context/useAuthContext';
import { RoutesList } from '@/router/routesList';

export const useNavigationData = () => {
  const { isProfileComplete } = useAuthContext();

  const navigate = useNavigate();
  const location = useLocation();

  const itemClickHandler = (itemData: MenuItem, route: string) => {
    // console.log(route, itemData);
    if (isProfileComplete) {
      navigate(route);
    }
  };

  const checkRoute = (startPath: string) => {
    return location?.pathname.indexOf(startPath) === 0;
  };

  const navigationItems: MenuItem[] = [
    {
      id: 'places',
      title: 'Площадки',
      current: checkRoute(RoutesList.Place.getPlacesList()),
      onItemClick: (item) =>
        itemClickHandler(item, RoutesList.Place.getPlacesList()),
      icon: TargetDart,
    },
    {
      id: 'games',
      title: 'Игры',
      current: checkRoute(RoutesList.Game.getGamesList()),
      onItemClick: (item) =>
        itemClickHandler(item, RoutesList.Game.getGamesList()),
      icon: PaperPlane,
    },
    {
      id: 'users',
      title: 'Пользователи',
      current: checkRoute(RoutesList.Users.getUsersList()),
      onItemClick: (item) =>
        itemClickHandler(item, RoutesList.Users.getUsersList()),
      icon: Persons,
    },
    {
      id: 'profile',
      title: 'Профиль',
      current: checkRoute(RoutesList.Profile.getUserProfile()),
      onItemClick: (item) =>
        itemClickHandler(item, RoutesList.Profile.getUserProfile()),
      icon: Person,
    },
  ];

  return {
    navigationItems,
  };
};
