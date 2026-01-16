import { RouteObject } from 'react-router';
import ProfilePage from '@/views/profile';
import { RoutesList } from '../routesList';

/** Роуты для профиля пользователя */
export const routesProfile: RouteObject[] = [
  {
    path: RoutesList.Profile.getUserProfile(),
    element: <ProfilePage />,
  },
];
