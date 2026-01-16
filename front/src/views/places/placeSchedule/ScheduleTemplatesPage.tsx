import { useParams } from 'react-router';
import { RoutesList } from '@/router/routesList';
import { useSetPageData } from '@/tools/hooks';
import { ScheduleList } from './components/ScheduleList';

export const ScheduleTemplatesPage = () => {
  const { placeId } = useParams();

  useSetPageData({
    title: 'Шаблоны расписаний',
    backLink: RoutesList.Place.getPlaceDetails(placeId),
  });
  return <ScheduleList />;
};
