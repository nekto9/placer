/**
 * Утилиты для работы с датами и временем.
 */

import dayjs from "./dayjs";

/**
 * Набор параметров даты для проверки календарных правил расписания.
 */
export interface DateParams {
  /** День недели по ISO: 1 = понедельник, 7 = воскресенье. */
  weekDay: number;
  /** Номер месяца в диапазоне 1-12. */
  month: number;
  /** День месяца в диапазоне 1-31. */
  monthDay: number;
  /** Признак последнего дня месяца. */
  isLastMonthDay: boolean;
  /** Признак первого дня месяца. */
  isFirstMonthDay: boolean;
  /**
   * Порядковый номер текущего дня недели в пределах месяца.
   * Пример: второй понедельник месяца => 2.
   */
  weekOfMonth: number;
  /** Признак последнего вхождения текущего дня недели в месяце. */
  isLastWeekOfMonth: boolean;
}

/**
 * Получает вычисляемые параметры из даты.
 */
export const getDateParams = (dateDay: dayjs.Dayjs): DateParams => {
  const weekDay = dateDay.isoWeekday();
  const month = dateDay.month() + 1;
  const monthDay = dateDay.date();
  const daysInMonth = dateDay.daysInMonth();
  const isLastMonthDay = daysInMonth === monthDay;
  const isFirstMonthDay = monthDay === 1;

  // Берем порядковый номер вхождения дня недели в месяце,
  // а не номер календарной недели.
  const weekOfMonth = Math.ceil(monthDay / 7);
  const isLastWeekOfMonth = monthDay + 7 > daysInMonth;

  return {
    weekDay,
    month,
    monthDay,
    isLastMonthDay,
    isFirstMonthDay,
    weekOfMonth,
    isLastWeekOfMonth,
  };
};

/**
 * Стандартный формат даты в проекте.
 */
export const DATE_STRING_FORMAT = "YYYY-MM-DD";

/**
 * Преобразует Date или Day.js в стандартную строку даты.
 */
export const dateToString = (date: Date | dayjs.Dayjs): string => {
  const dayjsDate = "toDate" in date ? date : dayjs(date);
  return dayjsDate.format(DATE_STRING_FORMAT);
};

/**
 * Преобразует строку YYYY-MM-DD в UTC Date.
 */
export const stringToDate = (date: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(
      `Некорректный формат даты: ${date}. Ожидается формат YYYY-MM-DD`
    );
  }

  const [year, month, day] = date.split("-").map(Number);

  if (year < 1900 || year > 2100) {
    throw new Error(
      `Некорректный год: ${year}. Допустимый диапазон: 1900-2100`
    );
  }
  if (month < 1 || month > 12) {
    throw new Error(`Некорректный месяц: ${month}. Допустимый диапазон: 1-12`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`Некорректный день: ${day}. Допустимый диапазон: 1-31`);
  }

  return new Date(Date.UTC(year, month - 1, day));
};

/** Форматирует время из минут в строку hh:mm. */
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

/** Преобразует строку hh:mm в минуты. */
export const getTimeInMunutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/** Получает время из Date в минутах. */
export const getTimeFromDateInMunutes = (date: Date): number => {
  return date.getHours() * 60 + date.getMinutes();
};
