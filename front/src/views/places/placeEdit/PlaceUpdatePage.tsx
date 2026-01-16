import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loading } from '@/layouts/components';
import { RoutesList } from '@/router/routesList';
import {
  useGetCitiesQuery,
  useGetPlaceByIdQuery,
  useGetSportsQuery,
  useUpdatePlaceMutation,
  useUploadCoverMutation,
} from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { convertToUpdateDto } from '../common/mappers/convertFromViewModel';
import { convertToViewModel } from '../common/mappers/convertToViewModel';
import { PlaceViewModel } from '../common/types';
import { PlaceEditForm } from './components/PlaceEditForm';

export const PlaceUpdatePage = () => {
  const { placeId } = useParams();
  const placeGetState = useGetPlaceByIdQuery({ id: placeId });
  const [uploadCoverAction, uploadCoverState] = useUploadCoverMutation();

  // виды спорта
  const sportsListGetState = useGetSportsQuery({});
  // города
  const citiesListGetState = useGetCitiesQuery({});

  const [placeUpdateAction, placeUpdateState] = useUpdatePlaceMutation();

  const saveFormHandler = (data: PlaceViewModel) => {
    try {
      // console.log('data', data);
      placeUpdateAction({
        id: placeId,
        updatePlaceDto: convertToUpdateDto(data),
      });

      // файлы для загрузки
      const uploadFiles = Array.from(data.coverFiles).filter(
        (el) => el.status === 'added'
      );

      if (uploadFiles.length) {
        uploadCoverAction({
          body: {
            cover: uploadFiles.map((el) => el.file),
            fileIds: uploadFiles.map((el) => el.id),
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (placeUpdateState.isSuccess) {
      navigate(RoutesList.Place.getPlacesList());
    }
  }, [placeUpdateState.isSuccess]);

  useSetPageData({ title: 'Площадка' });

  return (
    <div>
      <Loading
        isActive={
          uploadCoverState.isLoading ||
          placeGetState.isFetching ||
          placeUpdateState.isLoading ||
          sportsListGetState.isLoading
        }
        loadingKey="placeUpdate"
      />

      {placeGetState.isSuccess &&
        sportsListGetState.isSuccess &&
        citiesListGetState.isSuccess && (
          <PlaceEditForm
            data={convertToViewModel(placeGetState.data)}
            sportsDict={sportsListGetState.data.items}
            citiesDict={citiesListGetState.data.items}
            mode="update"
            onSave={saveFormHandler}
          />
        )}
    </div>
  );
};
