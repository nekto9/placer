import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Star, StarFill } from '@gravity-ui/icons';
import { Button, Divider, Flex, Icon, Modal, Text } from '@gravity-ui/uikit';
import { useNotification } from '@/components/Notify';
import { ViewMap } from '@/components/ui/Map';
import { PageBlock } from '@/components/ui/PageBlock';
import {
  useAddPlaceToFavoritesMutation,
  useRemovePlaceFromFavoritesMutation,
} from '@/store/api';
import { isDesktop } from '@/store/slices/viewportSlice';
import { parseBool } from '@/tools/parse';
import { PlaceViewModel } from '../../common/types';
import { ImageSlider } from './ImageSlider';

interface PlaceDetailsProps {
  data: PlaceViewModel;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onSchedulesClick: () => void;

  onScheduleTemplatesClick?: () => void;
}

export const PlaceDetails = (props: PlaceDetailsProps) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const removeHandler = () => {
    setOpenConfirmModal(true);
  };

  const confirmHandler = () => {
    setOpenConfirmModal(false);
    props.onDeleteClick();
  };

  const [addToFavorites, addToFavoritesState] =
    useAddPlaceToFavoritesMutation();
  const [removeFromFavorites, removeFromFavoritesState] =
    useRemovePlaceFromFavoritesMutation();
  const { showSuccess, showError } = useNotification();

  const isLoadingFavoriteAction =
    addToFavoritesState.isLoading || removeFromFavoritesState.isLoading;

  const [favoriteIconKey, setFavoriteIconKey] = useState(0);

  useEffect(() => {
    setFavoriteIconKey(
      (addToFavoritesState.fulfilledTimeStamp || 0) +
        (removeFromFavoritesState.fulfilledTimeStamp || 0)
    );
  }, [
    addToFavoritesState.fulfilledTimeStamp,
    removeFromFavoritesState.fulfilledTimeStamp,
  ]);

  const handleToggleFavorite = async () => {
    try {
      if (props.data.meta?.isFavorite) {
        await removeFromFavorites({ favoriteId: props.data.id }).unwrap();
        showSuccess({
          title: 'Успешно',
          message: `Площадка ${props.data.name} удалена из избранного`,
        });
      } else {
        await addToFavorites({ favoriteId: props.data.id }).unwrap();
        showSuccess({
          title: 'Успешно',
          message: `Площадка ${props.data.name} добавлена в избранное`,
        });
      }
    } catch (error) {
      console.error(error);
      showError({
        title: 'Ошибка',
        message: props.data.meta?.isFavorite
          ? 'Не удалось удалить площадку из избранного'
          : 'Не удалось добавить площадку в избранное',
      });
    }
  };

  const isDesktopMode = useSelector(isDesktop);

  return (
    <>
      <Flex gap={4} direction={isDesktopMode ? 'row-reverse' : 'column'}>
        <div
          style={
            isDesktopMode ? { flexBasis: '50%', flexShrink: 0 } : undefined
          }
          className={`g-s__py_2${isDesktopMode ? ' swiper--desktop' : ''}`}
        >
          <ImageSlider images={props.data.coverFiles?.map((el) => el.url)} />
        </div>
        <div
          style={
            isDesktopMode ? { flexBasis: '50%', flexShrink: 0 } : undefined
          }
        >
          <PageBlock
            header={!isDesktopMode ? props.data.name : undefined}
            isCard
          >
            {!!(props.data.latitude && props.data.longitude) && (
              <ViewMap
                point={{
                  latitude: props.data.latitude,
                  longitude: props.data.longitude,
                }}
                text={props.data.name}
                className="g-s__mb_4"
              />
            )}
            <div>
              <Button
                view="normal"
                size="l"
                component={'span'}
                onClick={() => props.onSchedulesClick()}
                style={{ marginRight: 10 }}
              >
                Расписания
              </Button>

              {!!props.onScheduleTemplatesClick && (
                <Button
                  view="normal"
                  size="l"
                  component={'span'}
                  onClick={() => props.onScheduleTemplatesClick()}
                  style={{ marginRight: 10 }}
                >
                  Шаблоны расписаний
                </Button>
              )}

              <Button
                view="outlined"
                size="l"
                loading={isLoadingFavoriteAction}
                onClick={handleToggleFavorite}
                title={
                  props.data.meta?.isFavorite
                    ? 'Удалить из избранного'
                    : 'Добавить в избранное'
                }
              >
                <Icon
                  key={favoriteIconKey}
                  data={props.data.meta?.isFavorite ? StarFill : Star}
                  size={24}
                />
              </Button>
            </div>
          </PageBlock>
        </div>
      </Flex>

      <PageBlock isCard>
        <Text variant="caption-2" color="secondary" as="div">
          Город
        </Text>
        <Text>{props.data.cityName}</Text>
        <Divider className="g-s__my_2" />
        <Text variant="caption-2" color="secondary" as="div">
          Описание
        </Text>
        <Text>{props.data.description}</Text>
        <Divider className="g-s__my_2" />
        <Text variant="caption-2" color="secondary" as="div">
          Виды спорта
        </Text>
        {props.data.sports.map((el) => el.name).join(', ')}
        <Divider className="g-s__my_2" />
        <Text variant="caption-2" color="secondary" as="div">
          Дополнительно
        </Text>
        {parseBool(props.data.isIndoor) ? 'Крытая' : 'Уличная'},{' '}
        {parseBool(props.data.isFree) ? 'Бесплатная' : 'Платная'}
      </PageBlock>

      {props.data.meta.canEdit && (
        <PageBlock isCard>
          <Button onClick={props.onEditClick} style={{ marginRight: 10 }}>
            Редактировать
          </Button>

          <Button onClick={removeHandler}>Удалить</Button>
        </PageBlock>
      )}

      <Modal open={openConfirmModal} onOpenChange={setOpenConfirmModal}>
        <div style={{ padding: 20 }}>
          <div style={{ marginBottom: 20 }}>Точно удалить?</div>
          <Button onClick={confirmHandler}>Подтвердить</Button>
        </div>
      </Modal>
    </>
  );
};
