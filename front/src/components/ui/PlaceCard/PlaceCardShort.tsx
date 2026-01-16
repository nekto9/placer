import { Card, Text, User } from '@gravity-ui/uikit';
import { PlaceResponseDto } from '@/store/api';

interface PlaceCardShortProps {
  place: PlaceResponseDto;
  onDetailsClick: (id: string) => void;
}

export const PlaceCardShort = (props: PlaceCardShortProps) => {
  return (
    <Card
      className="g-s__p_2"
      onClick={() => props.onDetailsClick(props.place.id)}
      type="action"
      view="outlined"
      theme="normal"
    >
      <User
        avatar={
          props.place.covers?.length > 0
            ? { imgUrl: props.place.covers[0].fileUrl, shape: 'square' }
            : { text: props.place.name, theme: 'brand', shape: 'square' }
        }
        name={<Text variant="header-1">{props.place.name}</Text>}
        description={props.place.city.name}
        size="xl"
      />
    </Card>
  );
};
