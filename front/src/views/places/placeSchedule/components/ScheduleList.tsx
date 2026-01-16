import { useNavigate, useParams } from 'react-router';
import { Button, Card } from '@gravity-ui/uikit';
import { Loading } from '@/layouts/components/Loading';
import { RoutesList } from '@/router/routesList';
import {
  ScheduleShortResponseDto,
  useGetPlaceSchedulesQuery,
} from '@/store/api';

/** Список расписаний площадки */
export const ScheduleList = () => {
  const { placeId } = useParams();
  const placeSchedulesGetState = useGetPlaceSchedulesQuery({
    id: placeId,
  });
  const navigate = useNavigate();

  return (
    <>
      <Button
        view="normal"
        component={'span'}
        onClick={() => navigate(RoutesList.Place.getScheduleAdd(placeId))}
      >
        Добавить шаблон
      </Button>
      <div>
        <Loading
          isActive={placeSchedulesGetState.isFetching}
          loadingKey="calendarSchedules"
        />

        {placeSchedulesGetState.isSuccess &&
          placeSchedulesGetState.data.map((el: ScheduleShortResponseDto) => (
            <Card key={el.id} style={{ marginTop: 10 }}>
              <div style={{ padding: 10 }}>
                <h2 style={{ margin: '0 0 10px' }}>{el.name}</h2>
                <Button
                  view="normal"
                  component={'span'}
                  onClick={() =>
                    navigate(RoutesList.Place.getScheduleEdit(placeId, el.id))
                  }
                  style={{ marginRight: 10 }}
                >
                  Редактировать
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </>
  );
};
