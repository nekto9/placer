import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loading } from '@/layouts/components';
import { RoutesList } from '@/router/routesList';
import { useDeletePlaceMutation, useGetPlaceByIdQuery } from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { convertToViewModel } from '../common/mappers/convertToViewModel';
import { PlaceDetails } from './components/PlaceDetails';

/** Страница площадки */
export const PlaceDetailsPage = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();

  const placeGetState = useGetPlaceByIdQuery({ id: placeId });

  const [placeDeleteAction, placeDeleteState] = useDeletePlaceMutation();

  const editClickHandler = () => {
    navigate(RoutesList.Place.getPlaceEdit(placeGetState.data.id));
  };

  const deleteClickHandler = () => {
    placeDeleteAction({ id: placeId });
  };

  useEffect(() => {
    if (placeDeleteState.isSuccess) {
      navigate(RoutesList.Place.getPlacesList());
    }
  }, [placeDeleteState.isSuccess]);

  const onSchedulesClickHandler = () => {
    navigate(RoutesList.Place.getPlaceSchedules(placeId));
  };

  const onScheduleTemplatesClickHandler = () => {
    navigate(RoutesList.Place.getPlaceScheduleTemplates(placeId));
  };

  useSetPageData({ title: 'Площадка' });

  return (
    <>
      <Loading
        isActive={placeGetState.isFetching || placeDeleteState.isLoading}
        loadingKey="placeDetails"
      />

      {placeGetState.isSuccess && (
        <PlaceDetails
          data={convertToViewModel(placeGetState.data)}
          onEditClick={editClickHandler}
          onDeleteClick={deleteClickHandler}
          onSchedulesClick={onSchedulesClickHandler}
          onScheduleTemplatesClick={
            placeGetState.data.meta.canEdit
              ? onScheduleTemplatesClickHandler
              : undefined
          }
        />
      )}
    </>
  );
};
