import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loading } from '@/layouts/components';
import { RoutesList } from '@/router/routesList';
import {
  useGetScheduleByIdQuery,
  useUpdateScheduleMutation,
} from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { ScheduleForm } from './components/ScheduleForm';
import { convertToUpdateScheduleDto } from './mappers/convertFromViewModel';
import { convertToScheduleViewModel } from './mappers/convertToViewModel';
import { ScheduleViewModel } from './types';

/** Редактирование расписания */
export const ScheduleUpdatePage = () => {
  const { placeId, scheduleId } = useParams();
  const scheduleGetState = useGetScheduleByIdQuery({
    id: scheduleId,
  });
  const [updateScheduleAction, updateScheduleState] =
    useUpdateScheduleMutation();

  const saveFormHandler = (data: ScheduleViewModel) => {
    try {
      updateScheduleAction({
        id: scheduleId,
        updateScheduleDto: convertToUpdateScheduleDto(data),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (updateScheduleState.isSuccess) {
      navigate(RoutesList.Place.getPlaceSchedules(placeId));
    }
  }, [updateScheduleState.isSuccess]);

  useSetPageData({
    title: 'Изменение шаблона',
    backLink: RoutesList.Place.getPlaceScheduleTemplates(placeId),
  });

  return (
    <div>
      <Loading
        isActive={scheduleGetState.isFetching}
        loadingKey="calendarSchedule"
      />

      {scheduleGetState.isSuccess && (
        <ScheduleForm
          data={convertToScheduleViewModel(scheduleGetState.data)}
          mode="update"
          onSave={saveFormHandler}
        />
      )}
    </div>
  );
};
