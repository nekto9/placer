import { RouteObject } from 'react-router';
import { RoutesList } from '@/router/routesList';
import PlaceDetailsPage from '@/views/places/placeDetails';
import { PlaceCreatePage, PlaceUpdatePage } from '@/views/places/placeEdit';
import {
  ScheduleCreatePage,
  ScheduleTemplatesPage,
  ScheduleUpdatePage,
} from '@/views/places/placeSchedule';
import PlacesListPage from '@/views/places/placesList';
import { PlaceSlotsPage } from '@/views/places/placeSlots';
import { ProtectedRoute } from '../ProtectedRoute';

/** Роуты для площадок */
export const routesPlace: RouteObject[] = [
  {
    path: RoutesList.Place.getPlacesList(),
    element: <PlacesListPage />,
  },
  {
    path: RoutesList.Place.getPlaceDetails(':placeId'),
    element: <PlaceDetailsPage />,
  },
  {
    path: RoutesList.Place.getPlaceAdd(),
    element: (
      <ProtectedRoute
        component={PlaceCreatePage}
        allowedRoles={['place-manager']}
      />
    ),
  },
  {
    path: RoutesList.Place.getPlaceEdit(':placeId'),
    element: (
      <ProtectedRoute
        component={PlaceUpdatePage}
        allowedRoles={['place-manager']}
      />
    ),
  },
  {
    path: RoutesList.Place.getPlaceSchedules(':placeId'),
    element: <PlaceSlotsPage />,
  },
  {
    path: RoutesList.Place.getPlaceScheduleTemplates(':placeId'),
    element: <ScheduleTemplatesPage />,
  },
  {
    path: RoutesList.Place.getScheduleAdd(':placeId'),
    element: <ScheduleCreatePage />,
  },
  {
    path: RoutesList.Place.getScheduleEdit(':placeId', ':scheduleId'),
    element: <ScheduleUpdatePage />,
  },
];
