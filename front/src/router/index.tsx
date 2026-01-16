import { createBrowserRouter } from 'react-router';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { routes } from '@/router/routes';
import { RoutesList } from './routesList';

export const getRouter = () =>
  createBrowserRouter([
    {
      path: RoutesList.Root,
      element: <DefaultLayout />,
      children: routes,
    },
  ]);
