import { RouteObject } from 'react-router';
import { UserDetailsPage } from '@/views/users/userDetails/UserDetailsPage';
import { UserEditPage } from '@/views/users/userEdit/UserEditPage';
import UserListPage from '@/views/users/userList';
import { RoutesList } from '../routesList';

/** Роуты для списка пользователей */
export const routesUsers: RouteObject[] = [
  {
    path: RoutesList.Users.getUsersList(),
    element: <UserListPage />,
  },
  {
    path: RoutesList.Users.getUsersFavorites(),
    element: <UserListPage isFavorites />,
  },
  {
    path: RoutesList.Users.getUserDetails(':userId'),
    element: <UserDetailsPage />,
  },
  {
    path: RoutesList.Users.getUserEdit(':userId'),
    element: <UserEditPage />,
  },
];
