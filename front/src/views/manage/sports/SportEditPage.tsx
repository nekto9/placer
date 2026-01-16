import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { RoutesList } from '@/router/routesList';
import { useGetSportByIdQuery, useUpdateSportMutation } from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { SportEditForm } from './components/SportEditForm';
import { convertToUpdateDto } from './mappers';
import { SportViewModel } from './types';

export const SportEditPage = () => {
  const { sportId } = useParams();
  const sportGetState = useGetSportByIdQuery({ id: sportId });

  const [sportUpdateAction, sportUpdateState] = useUpdateSportMutation();

  const saveFormHandler = (data: SportViewModel) => {
    try {
      sportUpdateAction({
        id: sportId,
        updateSportDto: convertToUpdateDto(data),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const cancelFormHandler = () => {
    navigate(RoutesList.Manage.getSportsList());
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (sportUpdateState.isSuccess) {
      navigate(RoutesList.Manage.getSportsList());
    }
  }, [sportUpdateState.isSuccess]);

  useSetPageData({ title: 'Вид спорта' });

  return (
    sportGetState.isSuccess && (
      <SportEditForm
        data={sportGetState.data}
        onSave={saveFormHandler}
        onCancel={cancelFormHandler}
      />
    )
  );
};
