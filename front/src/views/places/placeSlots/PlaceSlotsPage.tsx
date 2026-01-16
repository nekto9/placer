import { useParams } from 'react-router';
import { RoutesList } from '@/router/routesList';
import { useSetPageData } from '@/tools/hooks';
import { GridSchedule } from './components/GridSchedule';

/** Расписания площадки */
export const PlaceSlotsPage = () => {
  const { placeId } = useParams();

  useSetPageData({
    title: 'Расписания',
    backLink: RoutesList.Place.getPlaceDetails(placeId),
  });

  return <GridSchedule placeId={placeId} />;
};
