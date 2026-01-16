import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Loading } from '@/layouts/components';
import { RoutesList } from '@/router/routesList';
import {
  useCreatePlaceMutation,
  useGetCitiesQuery,
  useGetSportsQuery,
  useUploadCoverMutation,
} from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { convertToCreateDto } from '../common/mappers/convertFromViewModel';
import { getEmptyPlace } from '../common/mappers/getEmptyPlace';
import { PlaceViewModel } from '../common/types';
import { PlaceEditForm } from './components/PlaceEditForm';

export const PlaceCreatePage = () => {
  const [placeCreateAction, placeCreateState] = useCreatePlaceMutation();
  const [uploadCoverAction, uploadCoverState] = useUploadCoverMutation();

  // виды спорта
  const sportsListGetState = useGetSportsQuery({});
  // города
  const citiesListGetState = useGetCitiesQuery({});

  const saveFormHandler = (data: PlaceViewModel) => {
    try {
      placeCreateAction({
        createPlaceDto: convertToCreateDto(data),
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
    if (placeCreateState.isSuccess) {
      navigate(RoutesList.Place.getPlacesList());
    }
  }, [placeCreateState.isSuccess]);

  useSetPageData({ title: 'Новая площадка' });

  return (
    <>
      <Loading
        isActive={
          uploadCoverState.isLoading ||
          placeCreateState.isLoading ||
          sportsListGetState.isLoading ||
          citiesListGetState.isLoading
        }
        loadingKey="placeCreate"
      />

      {sportsListGetState.isSuccess && citiesListGetState.isSuccess && (
        <PlaceEditForm
          data={getEmptyPlace()}
          sportsDict={sportsListGetState.data.items}
          citiesDict={citiesListGetState.data.items}
          mode="create"
          onSave={saveFormHandler}
        />
      )}
    </>
  );
};
