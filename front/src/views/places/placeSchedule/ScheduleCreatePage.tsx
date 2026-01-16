import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { RoutesList } from '@/router/routesList';
import { useCreateScheduleMutation } from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { ScheduleForm } from './components/ScheduleForm';
import { convertToCreateScheduleDto } from './mappers/convertFromViewModel';
import { getEmptySchedule } from './mappers/getEmptySchedule';
import { ScheduleViewModel } from './types';

/** Добавление расписания */
export const ScheduleCreatePage = () => {
  const { placeId } = useParams();
  const [createScheduleAction, createScheduleState] =
    useCreateScheduleMutation();

  const saveFormHandler = (data: ScheduleViewModel) => {
    try {
      createScheduleAction({
        createScheduleDto: convertToCreateScheduleDto(placeId, data),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (createScheduleState.isSuccess) {
      navigate(RoutesList.Place.getPlaceSchedules(placeId));
    }
  }, [createScheduleState.isSuccess]);

  useSetPageData({
    title: 'Новый шаблон',
    backLink: RoutesList.Place.getPlaceScheduleTemplates(placeId),
  });

  return (
    <ScheduleForm
      data={getEmptySchedule(placeId)}
      mode="create"
      onSave={saveFormHandler}
    />
  );
};
