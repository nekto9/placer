import { useState } from 'react';
import { useNavigate } from 'react-router';
import { RangeDatePicker, RangeValue } from '@gravity-ui/date-components';
import { dateTime, DateTime } from '@gravity-ui/date-utils';
import { Card } from '@gravity-ui/uikit';
import { Loading } from '@/layouts/components/Loading';
import { RoutesList } from '@/router/routesList';
import { GridDayResponseDto, useGetPlaceSlotsQuery } from '@/store/api';
import { DATE_SERV_FORMAT, DATE_VIEW_FORMAT } from '@/tools/constants';
import { GridSlot } from '../types';
import { GridSlots } from './GridSlots';

interface GridScheduleProps {
  /** Идентификатор площадки */
  placeId: string;
  /** Клик по слоту, если задан, то игнорируем внутреннюю логику компонента */
  onClick?: (day: GridDayResponseDto, slot: GridSlot) => void;
}

/** Дни со слотами расписания */
export const GridSchedule = (props: GridScheduleProps) => {
  const startDate = dateTime();
  const stopDate = startDate.add(6, 'day');
  const [range, setRange] = useState<RangeValue<DateTime>>({
    start: startDate,
    end: stopDate,
  });

  const placeSlotsGetSate = useGetPlaceSlotsQuery({
    id: props.placeId,
    startDate: range.start.format(DATE_SERV_FORMAT),
    stopDate: range.end.format(DATE_SERV_FORMAT),
  });

  const updateRangeDateHandler = (value: RangeValue<DateTime>) => {
    setRange(value);
  };

  const navigate = useNavigate();

  const successBookingHandler = (gameId: string) => {
    navigate(RoutesList.Game.getGameEdit(gameId));
  };

  const successDleteHandler = () => {
    navigate(RoutesList.Game.getGamesList());
  };

  return (
    <div key={placeSlotsGetSate.fulfilledTimeStamp}>
      <Loading isActive={!placeSlotsGetSate.isSuccess} loadingKey="grid" />

      <RangeDatePicker
        onUpdate={updateRangeDateHandler}
        format={DATE_VIEW_FORMAT}
        defaultValue={range}
        size="xl"
      />
      {placeSlotsGetSate.isSuccess &&
        placeSlotsGetSate.data.days.map((day) => (
          <Card style={{ marginTop: 10 }} key={day.date}>
            <div style={{ padding: 10 }}>
              <strong
                style={day.timeSlots.length ? undefined : { color: 'red' }}
              >
                {dateTime({ input: day.date }).format('LL')}
              </strong>
              <div>{dateTime({ input: day.date }).format('dddd')}</div>
              <GridSlots
                day={day}
                placeId={props.placeId}
                onClick={
                  props.onClick ? (slot) => props.onClick(day, slot) : undefined
                }
                onSuccessBooking={successBookingHandler}
                onSuccessCancel={successDleteHandler}
              />
            </div>
          </Card>
        ))}
    </div>
  );
};
