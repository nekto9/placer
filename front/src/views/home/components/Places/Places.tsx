import { useNavigate } from 'react-router';
import { Text } from '@gravity-ui/uikit';
import { PageBlock } from '@/components/ui/PageBlock';
import { PlaceCardShort } from '@/components/ui/PlaceCard';
import { RoutesList } from '@/router/routesList';
import { PlaceResponseDto } from '@/store/api';

interface PlacesProps {
  places: PlaceResponseDto[];
}
export const Places = (props: PlacesProps) => {
  const navigate = useNavigate();

  const onDetailsClickHandler = (placeId: string) => {
    navigate(RoutesList.Place.getPlaceDetails(placeId));
  };

  // const onSchedulesClickHandler = (placeId: string) => {
  //   navigate(RoutesList.Place.getPlaceSchedules(placeId));
  // };
  return (
    <PageBlock header="Избранные площадки" isCard={!props.places.length}>
      {props.places.length === 0 ? (
        <Text>Нет площадок</Text>
      ) : (
        props.places.map((place) => (
          <PlaceCardShort
            place={place}
            key={place.id}
            onDetailsClick={onDetailsClickHandler}
            // onSchedulesClick={onSchedulesClickHandler}
            // showFavoriteActions={true}
          />
        ))
      )}
    </PageBlock>
  );
};
