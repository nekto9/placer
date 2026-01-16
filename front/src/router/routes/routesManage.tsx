import { RouteObject } from 'react-router';
import { ManagePage } from '@/views/manage';
import { CityCreatePage } from '@/views/manage/cities/CityCreatePage';
import { CityEditPage } from '@/views/manage/cities/CityEditPage';
import { CityListPage } from '@/views/manage/cities/CityListPage';
import { SportCreatePage } from '@/views/manage/sports/SportCreatePage';
import { SportEditPage } from '@/views/manage/sports/SportEditPage';
import { SportListPage } from '@/views/manage/sports/SportListPage';
import { ProtectedRoute } from '../ProtectedRoute';
import { RoutesList } from '../routesList';

/** Роуты для упавления */
export const routesManage: RouteObject[] = [
  {
    path: RoutesList.Manage.getManage(),
    element: (
      <ProtectedRoute component={ManagePage} allowedRoles={['place-manager']} />
    ),
  },
  {
    path: RoutesList.Manage.getSportsList(),
    element: (
      <ProtectedRoute
        component={SportListPage}
        allowedRoles={['place-manager']}
      />
    ),
  },
  {
    path: RoutesList.Manage.getSportAdd(),
    element: (
      <ProtectedRoute
        component={SportCreatePage}
        allowedRoles={['place-manager']}
      />
    ),
  },
  {
    path: RoutesList.Manage.getSportEdit(':sportId'),
    element: (
      <ProtectedRoute
        component={SportEditPage}
        allowedRoles={['place-manager']}
      />
    ),
  },

  {
    path: RoutesList.Manage.getCitiesList(),
    element: (
      <ProtectedRoute
        component={CityListPage}
        allowedRoles={['place-manager']}
      />
    ),
  },
  {
    path: RoutesList.Manage.getCityAdd(),
    element: (
      <ProtectedRoute
        component={CityCreatePage}
        allowedRoles={['place-manager']}
      />
    ),
  },
  {
    path: RoutesList.Manage.getCityEdit(':cityId'),
    element: (
      <ProtectedRoute
        component={CityEditPage}
        allowedRoles={['place-manager']}
      />
    ),
  },
];
