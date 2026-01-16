import { dateTime, DateTime } from '@gravity-ui/date-utils';
import dayjs from '@gravity-ui/date-utils/build/dayjs';
import { DATE_VIEW_FORMAT } from './constants';

/** Выделение из даты ТОЛЬКО времени и преобразование его в минуты */
export const dateTimeConvertToMinutes = (time: DateTime) => {
  const resultHours = time.hour();
  const resultMinutes = time.minute();

  return resultMinutes + resultHours * 60;
};

/** Преобразование минут в строку часы:минуты */
export const timeConvertToFormattedString = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/** Преобразование минут в формат даты gravity */
export const timeConvertToDateTime = (minutes: number | null) => {
  return minutes !== null
    ? dateTime({
        input: timeConvertToFormattedString(minutes),
        format: 'HH:mm',
      })
    : dateTime();
};

export const dateToStringView = (date: Date | string) => {
  return dayjs(date).format(DATE_VIEW_FORMAT);
};
