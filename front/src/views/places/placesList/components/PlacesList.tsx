import { Flex } from '@gravity-ui/uikit';
import { PlaceCardShort } from '@/components/ui/PlaceCard';
import { GetPlacesApiResponse, PlaceResponseDto } from '@/store/api';

interface PlacesListProps {
  data: GetPlacesApiResponse;
  onEditClick: (id: string) => void;
  onDetailsClick: (id: string) => void;
  onSchedulesClick: (id: string) => void;
}

export const PlacesList = (props: PlacesListProps) => {
  return (
    <Flex direction="column" gap={3}>
      {props.data.items.map((el: PlaceResponseDto) => (
        <PlaceCardShort
          place={el}
          onDetailsClick={props.onDetailsClick}
          key={el.id}
        />
      ))}
    </Flex>
  );
};
