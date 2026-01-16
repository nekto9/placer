import { useEffect, useState } from 'react';
import { Path } from 'react-hook-form';
import { RangeValue } from '@gravity-ui/date-components';
import { DateTime, dateTime } from '@gravity-ui/date-utils';
import { FormRangeDateSelection } from '@/components/formUi';
import { useGetScheduleByIdQuery } from '@/store/api';
import { GridSlot } from '../types';

interface WorktimeSelectorProps<T> {
  timeSlot: GridSlot;
  scheduleId: string;
  onUpdate: (data: RangeValue<DateTime>) => void;
  name: Path<T>;
}

const calcDurationInMs = (hours: number, minutes: number) => {
  return (hours * 60 + minutes) * 60 * 1000;
};

const calcDurationInMinutes = (hours: number, minutes: number) => {
  return hours * 60 + minutes;
};

const calcDateTime = (timeInMinutes: number) => {
  return new Date().setHours(0, timeInMinutes);
};

const getValue = (timeSlot: GridSlot) => {
  return timeSlot
    ? {
        start: dateTime({
          input: calcDateTime(timeSlot.timeStart),
        }),
        end: dateTime({
          input: calcDateTime(timeSlot.timeStart),
        }).add(1, 'hour'),
      }
    : undefined;
};

export const WorkTimeSelector = <T,>(props: WorktimeSelectorProps<T>) => {
  const scheduleGetState = useGetScheduleByIdQuery({
    id: props.scheduleId,
  });

  const [rangeValue, setRangeValue] = useState<RangeValue<DateTime>>();

  const rangeUpdateHandler = (value: RangeValue<DateTime>) => {
    // console.log('1', {
    //   start: value?.start.format('HH:mm'),
    //   end: value?.end.format('HH:mm'),
    // });

    const startTimeMunutes = value.start.minute();
    const endTimeMinutes = value.end.minute();

    // const minStartRange = dateTime({
    //   input: calcDateTime(timeSchedule.timeSlots[0].timeStart),
    // });
    const maxEndRange = dateTime({
      input: calcDateTime(props.timeSlot.timeEnd),
    });

    // Округляем минуты окончания до 15
    value.end = value.end.minute(Math.ceil(endTimeMinutes / 15) * 15);

    // console.log('2', {
    //   start: value?.start.format('HH:mm'),
    //   end: value?.end.format('HH:mm'),
    // });

    // Приводим старт слота к заданному в шаблоне
    const diffStart = scheduleGetState.data.timeStart - startTimeMunutes;
    // Если разница меньше получаса, то смещаем вниз, иначе + час
    const resultDiffStart = diffStart + (diffStart < -30 ? 60 : 0);
    value.start = value.start.add(resultDiffStart, 'minute');

    // console.log('3', {
    //   start: value?.start.format('HH:mm'),
    //   end: value?.end.format('HH:mm'),
    //   diffStart,
    //   resultDiffStart,
    // });

    // Если длина нового слота меньше минимального, то смещаем конечную дату
    const minDurationMinutes = calcDurationInMinutes(
      scheduleGetState.data.minDurationHours,
      scheduleGetState.data.minDurationMinutes
    );
    if (value.end.diff(value.start, 'minute') < minDurationMinutes) {
      value.end = value.start.add(minDurationMinutes, 'minute');
    }

    // console.log('4', {
    //   start: value?.start.format('HH:mm'),
    //   end: value?.end.format('HH:mm'),
    //   minDurationMinutes,
    // });

    // Если длина нового слота больше максимального, то смещаем конечную дату
    const maxDurationMinutes = calcDurationInMinutes(
      scheduleGetState.data.maxDurationHours,
      scheduleGetState.data.maxDurationMinutes
    );
    if (value.end.diff(value.start, 'minute') > maxDurationMinutes) {
      value.end = value.start.add(maxDurationMinutes, 'minute');
    }

    // console.log('5', {
    //   start: value?.start.format('HH:mm'),
    //   end: value?.end.format('HH:mm'),
    //   maxDurationMinutes,
    // });

    // Если конечная дата больше ограничения рабочего времени, то смещаем начальную дату
    if (value.end > maxEndRange) {
      value.start = maxEndRange.add(-minDurationMinutes, 'minute');
      value.end = maxEndRange;
    }

    // console.log('6', {
    //   start: value?.start.format('HH:mm'),
    //   end: value?.end.format('HH:mm'),
    //   maxEndRange,
    //   minDurationMinutes,
    // });

    setRangeValue(value);
  };

  // выставляем стартовое значение для диапазона
  useEffect(() => {
    if (props.timeSlot) {
      setRangeValue(getValue(props.timeSlot));
    }
  }, []);

  useEffect(() => {
    props.onUpdate(rangeValue);
  }, [rangeValue]);

  return (
    scheduleGetState.isSuccess && (
      <>
        <div style={{ marginBottom: 16, fontSize: 16 }}>
          {rangeValue?.start.format('HH:mm')} -{' '}
          {rangeValue?.end.format('HH:mm')}
        </div>
        <FormRangeDateSelection
          name={props.name}
          maxDuration={calcDurationInMs(
            scheduleGetState.data.maxDurationHours,
            scheduleGetState.data.maxDurationMinutes
          )}
          minDuration={calcDurationInMs(
            scheduleGetState.data.minDurationHours,
            scheduleGetState.data.minDurationMinutes
          )}
          minValue={dateTime({
            input: calcDateTime(props.timeSlot.timeStart),
          })}
          maxValue={dateTime({
            input: calcDateTime(props.timeSlot.timeEnd),
          })}
          value={rangeValue || getValue(props.timeSlot)}
          draggableRuler
          onUpdate={rangeUpdateHandler}
        />
      </>
    )
  );
};
