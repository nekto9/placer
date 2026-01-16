import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { RoutesList } from '@/router/routesList';
import { useCreateSportMutation } from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { SportEditForm } from './components/SportEditForm';
import { convertToCreateDto } from './mappers/convertToCreateDto';
import { getEmptySport } from './mappers/getEmptySport';
import { SportViewModel } from './types';

export const SportCreatePage = () => {
  const [sportCreateAction, sportCreateState] = useCreateSportMutation();

  const saveFormHandler = (data: SportViewModel) => {
    try {
      sportCreateAction({
        createSportDto: convertToCreateDto(data),
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
    if (sportCreateState.isSuccess) {
      navigate(RoutesList.Manage.getSportsList());
    }
  }, [sportCreateState.isSuccess]);

  useSetPageData({ title: 'Вид спорта' });

  return (
    <SportEditForm
      isCreate
      data={getEmptySport()}
      onSave={saveFormHandler}
      onCancel={cancelFormHandler}
    />
  );
};
