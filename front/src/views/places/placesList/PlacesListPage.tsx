import { useNavigate } from 'react-router';
import { Loading } from '@/layouts/components';
import { RoutesList } from '@/router/routesList';
import { useGetPlacesQuery } from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { PlacesList } from './components/PlacesList';

export const PlacesListPage = () => {
  const placeListGetState = useGetPlacesQuery({});

  const navigate = useNavigate();

  const onEditClickHandler = (placeId: string) => {
    navigate(RoutesList.Place.getPlaceEdit(placeId));
  };

  const onDetailsClickHandler = (placeId: string) => {
    navigate(RoutesList.Place.getPlaceDetails(placeId));
  };

  const onSchedulesClickHandler = (placeId: string) => {
    navigate(RoutesList.Place.getPlaceSchedules(placeId));
  };

  useSetPageData({ title: 'Список площадок' });

  return (
    <div>
      {placeListGetState.isSuccess && (
        <PlacesList
          data={placeListGetState.data}
          onDetailsClick={onDetailsClickHandler}
          onEditClick={onEditClickHandler}
          onSchedulesClick={onSchedulesClickHandler}
        />
      )}
      <Loading isActive={placeListGetState.isFetching} loadingKey="placeList" />
    </div>
  );
};
