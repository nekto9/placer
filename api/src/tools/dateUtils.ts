/**
 * Утилиты для работы с датами и временем
 */

import dayjs from './dayjs';

/**
 * Интерфейс для параметров даты
 */
export interface DateParams {
  /** День недели по ISO (1 = понедельник, 7 = воскресенье) */
  weekDay: number;
  /** Число месяца (1-31) */
  monthDay: number;
  /** Флаг последнего дня месяца */
  isLastMonthDay: boolean;
  /** Флаг первого дня месяца */
  isFirstMonthDay: boolean;
  /** Номер недели в месяце (1-6) */
  weekOfMonth: number;
}

/**
 * Извлекает различные параметры из даты
 *
 * Функция анализирует переданную дату и возвращает объект с различными
 * параметрами, которые могут быть полезны для работы с расписанием,
 * повторяющимися событиями и календарной логикой.
 */
export const getDateParams = (dateDay: dayjs.Dayjs): DateParams => {
  // День недели по ISO стандарту (1 - понедельник, 7 - воскресенье)
  const weekDay = dateDay.isoWeekday();

  // Число месяца (1-31)
  const monthDay = dateDay.date();

  // Проверка, является ли день последним в месяце
  const isLastMonthDay = dateDay.daysInMonth() === monthDay;

  // Проверка, является ли день первым в месяце
  const isFirstMonthDay = monthDay === 1;

  // Вычисление номера недели в месяце
  // Учитывает день недели первого числа месяца
  const weekOfMonth = Math.ceil(
    (dateDay.startOf('month').isoWeekday() + monthDay - 1) / 7
  );

  return {
    weekDay,
    monthDay,
    isLastMonthDay,
    isFirstMonthDay,
    weekOfMonth,
  };
};

/**
 * Стандартный формат строки даты, используемый в приложении
 */
export const DATE_STRING_FORMAT = 'YYYY-MM-DD';

/**
 * Преобразует дату в строковое представление
 *
 * Функция принимает дату в виде объекта Date или Day.js и возвращает
 * строку в стандартном формате YYYY-MM-DD. Используется для унификации
 * представления дат в API и базе данных.
 */
export const dateToString = (date: Date | dayjs.Dayjs): string => {
  // Проверяем, является ли объект Day.js (имеет метод toDate)
  const dayjsDate = 'toDate' in date ? date : dayjs(date);
  return dayjsDate.format(DATE_STRING_FORMAT);
};

/**
 * Преобразует строку даты в объект Date
 *
 * Функция парсит строку в формате YYYY-MM-DD и создает объект Date
 * в UTC timezone. Используется для преобразования дат из API и базы данных
 * в JavaScript объекты.
 */
export const stringToDate = (date: string): Date => {
  // Валидация формата строки
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(
      `Invalid date format: ${date}. Expected format: YYYY-MM-DD`
    );
  }

  const [year, month, day] = date.split('-').map(Number);

  // Валидация компонентов даты
  if (year < 1900 || year > 2100) {
    throw new Error(`Invalid year: ${year}. Expected range: 1900-2100`);
  }
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Expected range: 1-12`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`Invalid day: ${day}. Expected range: 1-31`);
  }

  // Создание даты в UTC (месяц в Date начинается с 0)
  return new Date(Date.UTC(year, month - 1, day));
};

/** Форматирует время из минут в hh:mm */
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/** Преобразует время из hh:mm в минуты */
export const getTimeInMunutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/** Преобразует время из даты в минуты */
export const getTimeFromDateInMunutes = (date: Date): number => {
  return date.getHours() * 60 + date.getMinutes();
};
