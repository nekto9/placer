import { House, Pencil, Star, StarFill } from '@gravity-ui/icons';
import { Button, Card, Icon } from '@gravity-ui/uikit';
import { useNotification } from '@/components/Notify';
import {
  PlaceResponseDto,
  useAddPlaceToFavoritesMutation,
  useRemovePlaceFromFavoritesMutation,
} from '@/store/api';

interface PlaceCardProps {
  place: PlaceResponseDto;

  onEditClick?: (id: string) => void;
  onDetailsClick?: (id: string) => void;
  onSchedulesClick?: (id: string) => void;

  /** Показывать ли кнопки избранного */
  showFavoriteActions?: boolean;
}

export const PlaceCard = (props: PlaceCardProps) => {
  const [addToFavorites, addToFavoritesState] =
    useAddPlaceToFavoritesMutation();
  const [removeFromFavorites, removeFromFavoritesState] =
    useRemovePlaceFromFavoritesMutation();
  const { showSuccess, showError } = useNotification();

  const isLoadingFavoriteAction =
    addToFavoritesState.isLoading || removeFromFavoritesState.isLoading;

  const handleToggleFavorite = async () => {
    try {
      if (props.place.meta?.isFavorite) {
        await removeFromFavorites({ favoriteId: props.place.id }).unwrap();
        showSuccess({
          title: 'Успешно',
          message: `Площадка ${props.place.name} удалена из избранного`,
        });
      } else {
        await addToFavorites({ favoriteId: props.place.id }).unwrap();
        showSuccess({
          title: 'Успешно',
          message: `Площадка ${props.place.name} добавлена в избранное`,
        });
      }
    } catch (error) {
      console.error(error);
      showError({
        title: 'Ошибка',
        message: props.place.meta?.isFavorite
          ? 'Не удалось удалить площадку из избранного'
          : 'Не удалось добавить площадку в избранное',
      });
    }
  };

  return (
    <Card style={{ marginBottom: 8 }}>
      <div className="place-card">
        {props.place.covers?.length > 0 && (
          <div className="place-card__cover">
            <img src={props.place.covers[0]} alt="" />
          </div>
        )}

        <div className="place-card__content">
          <h3
            className="place-card__name"
            onClick={() => props.onDetailsClick?.(props.place.id)}
          >
            {props.place.name}{' '}
            {props.place.isIndoor && <Icon data={House} size={18} />}
          </h3>
          <div className="place-card__description">{props.place.city.name}</div>

          {props.onSchedulesClick && (
            <Button
              view="normal"
              size="l"
              component={'span'}
              onClick={() => props.onSchedulesClick(props.place.id)}
              style={{ marginRight: 10 }}
            >
              Расписания
            </Button>
          )}

          {props.onEditClick && (
            <Button
              view="normal"
              size="l"
              component={'span'}
              onClick={() => props.onEditClick(props.place.id)}
              style={{ marginRight: 10 }}
              title="Редактировать"
            >
              <Icon data={Pencil} size={24} />
            </Button>
          )}

          {props.showFavoriteActions && (
            <Button
              view="outlined"
              size="l"
              loading={isLoadingFavoriteAction}
              onClick={handleToggleFavorite}
              title={
                props.place.meta?.isFavorite
                  ? 'Удалить из избранного'
                  : 'Добавить в избранное'
              }
            >
              <Icon
                data={props.place.meta?.isFavorite ? StarFill : Star}
                size={24}
              />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
