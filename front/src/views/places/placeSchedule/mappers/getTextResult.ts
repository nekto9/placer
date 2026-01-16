import { CalendarRepeatMode } from '@/store/api';
import { MONTHS_LIST } from '@/tools/constants';
import { ScheduleViewModel } from '../types';

const weekDays = [
  'понедельникам',
  'вторникам',
  'средам',
  'четвергам',
  'пятницам',
  'субботам',
  'воскресеньям',
];
const monthsN = MONTHS_LIST;
const monthsL = [
  'январе',
  'феврале',
  'марте',
  'апреле',
  'мае',
  'июне',
  'июле',
  'августе',
  'сентябре',
  'октябре',
  'ноябре',
  'декабре',
];
const monthsG = [
  'января',
  'февраля',
  'мара',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];
const weeks = ['первую', 'вторую', 'третью', 'четвертую', 'последнюю'];

/** Текстовое представление выбранных настроек расписания */
export const getTextResult = (formData: ScheduleViewModel): string => {
  let result = '';

  const repeatType = formData.repeatMode[0];

  let startDate = formData.startDate?.format('DD.MM.YYYY');
  const stopDate = formData.stopDate?.format('DD.MM.YYYY');
  const repeatStep = formData.repeatStep;

  /** Сообщение для выбранных дней недели */
  const getWeekDaysResult = (): string => {
    let resultWeekDays = '';
    let weekDayItems: string[] = [];
    let isDefaultWorkDays = false;
    let workDaysCheck = 0;

    weekDays.forEach((weekDayItem, idx) => {
      const dayIsChecked =
        !!formData[`wd${idx + 1}` as keyof ScheduleViewModel];
      if (dayIsChecked) {
        weekDayItems.push(weekDayItem);
        workDaysCheck += idx;

        if (idx === 4 && workDaysCheck === 10) {
          isDefaultWorkDays = true;
        }
        if (idx > 4) {
          isDefaultWorkDays = false;
        }
      }
    });

    if (isDefaultWorkDays) {
      resultWeekDays = `${resultWeekDays} по будням`;
    } else {
      // Если выбраны все дни недели, то они нам не нужны
      if (weekDayItems.length === 7) {
        weekDayItems = [];
      }

      if (weekDayItems.length > 1) {
        const lastItem = weekDayItems.pop();
        resultWeekDays = `${resultWeekDays} по ${weekDayItems.join(', ')} и ${lastItem}`;
      } else if (weekDayItems.length > 0) {
        resultWeekDays = `${resultWeekDays} по ${weekDayItems.join(', ')}`;
      } else {
        resultWeekDays = `${resultWeekDays} каждый день`;
      }
    }

    return resultWeekDays;
  };

  /** Сообщение для выбранных месяцев */
  const getMonthResult = (showEveryMonth?: boolean): string => {
    const resultMonth = '';
    const monthItems: number[] = [];
    let monthStringItems: string[] = [];
    let startPeriodMonth = 0;
    let stopPeriodMonth = 0;

    monthsN.forEach((_monthItem, idx) => {
      const monthIsChecked =
        !!formData[`m${idx + 1}` as keyof ScheduleViewModel];
      if (monthIsChecked) {
        const monthNumber = idx + 1;
        if (startPeriodMonth === 0) {
          startPeriodMonth = monthNumber;
        }
        if (stopPeriodMonth === idx && stopPeriodMonth >= startPeriodMonth) {
          monthStringItems[monthStringItems.length - 1] =
            ` c ${monthsG[startPeriodMonth - 1]} по ${monthsN[idx]}`;
        } else {
          monthStringItems.push(` в ${monthsL[idx]}`);
          startPeriodMonth = monthNumber;
        }
        stopPeriodMonth = monthNumber;
        monthItems.push(monthNumber);
      }
    });

    // Если выбраны все месяцы, то они нам не нужны
    if (monthItems.length === 12) {
      monthStringItems = [];
    }

    if (monthStringItems.length > 1) {
      const lastItem = monthStringItems.pop();
      result = `${result + monthStringItems.join(', ')} и ${lastItem}`;
    } else if (monthStringItems.length > 0) {
      result = result + monthStringItems.join(', ');
    } else if (!showEveryMonth) {
      result = `${result} каждый месяц`;
    }

    return resultMonth;
  };

  /** Сообщение для выбранных чисел */
  const getCalendDaysResult = (): string => {
    let resultCalendDays = '';
    const dayItems: number[] = [];
    let dayStringItems: string[] = [];
    let startPeriodDay = 0;
    let stopPeriodDay = 0;
    Array.from(Array(32).keys()).forEach((dayIdx) => {
      const dayIsChecked = !!(dayIdx < 31
        ? formData[`d${dayIdx + 1}` as keyof ScheduleViewModel]
        : formData.dLast);

      if (dayIsChecked) {
        const dayNumber = dayIdx === 31 ? 99 : dayIdx + 1;
        if (startPeriodDay === 0) {
          startPeriodDay = dayNumber;
        }
        if (dayNumber === 99) {
          dayStringItems.push('в последний день месяца');
        } else {
          if (
            stopPeriodDay === dayNumber - 1 &&
            stopPeriodDay >= startPeriodDay
          ) {
            dayStringItems[dayStringItems.length - 1] =
              `c ${startPeriodDay} по ${dayNumber} число`;
          } else {
            dayStringItems.push(`${dayNumber} числа`);
            startPeriodDay = dayNumber;
          }
          stopPeriodDay = dayNumber;
        }
        dayItems.push(dayNumber);
      }
    });

    // Если выбраны все дни, то они нам не нужны
    if (dayItems.length >= 31) {
      dayStringItems = [];
    }

    if (dayStringItems.length > 1) {
      const lastItem = dayStringItems.pop();
      resultCalendDays = `${resultCalendDays} ${dayStringItems.join(', ')} и ${lastItem}`;
    } else if (dayStringItems.length > 0) {
      resultCalendDays = `${resultCalendDays} ${dayStringItems.join(', ')}`;
    } else {
      resultCalendDays = `${resultCalendDays} каждый день`;
    }
    return resultCalendDays;
  };

  /** Сообщение для выбранных недель */
  const getWeeksResult = (): string => {
    let resultWeeks = '';

    let weekItems: string[] = [];
    weeks.forEach((weekItem, idx) => {
      const isWeekChecked = !!(idx < 4
        ? formData[`w${idx + 1}` as keyof ScheduleViewModel]
        : formData.wLast);

      if (isWeekChecked) {
        if (idx === 4) {
          weekItems.push(weeks[4]);
        } else {
          weekItems.push(weekItem);
        }
      }
    });

    // Если выбраны все недели, то они нам не нужны
    if (weekItems.length === 5) {
      weekItems = [];
    }

    if (weekItems.length > 1) {
      const lastItem = weekItems.pop();
      resultWeeks = `${resultWeeks} каждую ${weekItems.join(', ')} и ${
        lastItem
      } неделю месяца`;
    } else if (weekItems.length > 0) {
      resultWeeks = `${resultWeeks} каждую ${weekItems.join(', ')} неделю месяца`;
    }

    return resultWeeks;
  };

  /////////////////
  ////////////////
  ///////////////

  if (repeatType === CalendarRepeatMode.Once) {
    // Однократное
    if (startDate != '') {
      result = `Однократно ${startDate}`;
    }
  } else if (repeatType === CalendarRepeatMode.Daily) {
    // Ежедневное
    if (!Number.isNaN(repeatStep) && repeatStep > 1) {
      result = `Повторять каждый ${repeatStep}-й день`;
    } else {
      result = 'Повторять каждый день';
    }

    if (!startDate) {
      startDate = '23.05.2017';
    }
    result = `${result}, начиная с ${startDate}`;

    if (stopDate) {
      result = `${result} до ${stopDate}`;
    }
  } else if (repeatType === CalendarRepeatMode.Weekly) {
    // Еженедельное
    if (!Number.isNaN(repeatStep) && repeatStep > 1) {
      result = `Повторять каждую ${repeatStep}-ю неделю`;
    } else {
      result = 'Повторять';
    }

    const weekDayData = getWeekDaysResult();
    result = result + weekDayData;

    if (!startDate) {
      startDate = '23.05.2017';
    }
    result = `${result}, начиная с ${startDate}`;

    if (stopDate) {
      result = `${result}, до ${stopDate}`;
    }
  } else if (repeatType === CalendarRepeatMode.Calenddays) {
    // Ежемесячное по календарным дням
    if (!Number.isNaN(repeatStep) && repeatStep > 1) {
      result = `Повторять каждый ${repeatStep}-й год`;
    } else {
      result = 'Повторять';
    }

    const monthData = getMonthResult();
    result = result + monthData;

    const calendDaysData = getCalendDaysResult();
    result = result + calendDaysData;

    if (startDate === '') {
      startDate = '23.05.2017';
    }
    result = `${result}, начиная с ${startDate}`;

    if (stopDate != '') {
      result = `${result}, до ${stopDate}`;
    }
  } else if (repeatType === CalendarRepeatMode.Weekdays) {
    // Ежемесячное по дням недели
    if (!Number.isNaN(repeatStep) && repeatStep > 1) {
      result = `Повторять каждый ${repeatStep}-й год`;
    } else {
      result = 'Повторять';
    }

    const monthData = getMonthResult(true);
    result = result + monthData;

    const weekDayData = getWeekDaysResult();
    result = result + weekDayData;

    const weeksData = getWeeksResult();
    result = result + weeksData;

    if (startDate === '') {
      startDate = '23.05.2017';
    }
    result = `${result}, начиная с ${startDate}`;

    if (stopDate != '') {
      result = `${result}, до ${stopDate}`;
    }
  }

  return result;
};
