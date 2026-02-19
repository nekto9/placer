import { CalendarRepeatMode } from "@/store/api";
import { MONTHS_LIST } from "@/tools/constants";
import { ScheduleViewModel } from "../types";

const WEEKDAY_TEXT = [
  "понедельникам",
  "вторникам",
  "средам",
  "четвергам",
  "пятницам",
  "субботам",
  "воскресеньям",
];

const MONTHS_IN = [
  "январе",
  "феврале",
  "марте",
  "апреле",
  "мае",
  "июне",
  "июле",
  "августе",
  "сентябре",
  "октябре",
  "ноябре",
  "декабре",
];

const WEEK_TEXT = ["1-й", "2-й", "3-й", "4-й", "последний"];

const joinWithAnd = (items: string[]) => {
  if (items.length === 0) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  return `${items.slice(0, -1).join(", ")} и ${items[items.length - 1]}`;
};

const isChecked = (formData: ScheduleViewModel, key: string) =>
  Boolean(formData[key as keyof ScheduleViewModel]);

const formatDate = (value: ScheduleViewModel["startDate"]) =>
  value ? value.format("DD.MM.YYYY") : "";

const appendRange = (base: string, startDate: string, stopDate: string) => {
  let result = base;

  if (startDate) {
    result = `${result}, начиная с ${startDate}`;
  }

  if (stopDate) {
    result = `${result}, до ${stopDate}`;
  }

  return result;
};

const getWeekDaysResult = (formData: ScheduleViewModel) => {
  const selectedWeekDays = WEEKDAY_TEXT.filter((_item, index) =>
    isChecked(formData, `wd${index + 1}`)
  );

  if (
    selectedWeekDays.length === 5 &&
    [0, 1, 2, 3, 4].every((index) => isChecked(formData, `wd${index + 1}`))
  ) {
    return "по будням";
  }

  if (selectedWeekDays.length === 0 || selectedWeekDays.length === 7) {
    return "каждый день";
  }

  return `по ${joinWithAnd(selectedWeekDays)}`;
};

const getMonthResult = (formData: ScheduleViewModel) => {
  const selectedMonths = MONTHS_LIST.map((_item, index) => index).filter(
    (index) => isChecked(formData, `m${index + 1}`)
  );

  if (selectedMonths.length === 0 || selectedMonths.length === 12) {
    return "каждый месяц";
  }

  return joinWithAnd(selectedMonths.map((index) => `в ${MONTHS_IN[index]}`));
};

const getCalendDaysResult = (formData: ScheduleViewModel) => {
  const selectedDays = Array.from({ length: 31 }, (_item, index) => index + 1)
    .filter((day) => isChecked(formData, `d${day}`))
    .map((day) => `${day} числа`);

  if (isChecked(formData, "dLast")) {
    selectedDays.push("в последний день месяца");
  }

  if (selectedDays.length === 0) {
    return "каждый день";
  }

  return joinWithAnd(selectedDays);
};

const getWeeksResult = (formData: ScheduleViewModel) => {
  const selectedWeeks = WEEK_TEXT.filter((_item, index) =>
    index < 4
      ? isChecked(formData, `w${index + 1}`)
      : isChecked(formData, "wLast")
  );

  if (selectedWeeks.length === 0 || selectedWeeks.length === 5) {
    return "";
  }

  return joinWithAnd(
    selectedWeeks.map((week) =>
      week === "последний"
        ? "в последний раз в месяце"
        : `в ${week} раз в месяце`
    )
  );
};

/** Текстовое представление выбранных настроек расписания. */
export const getTextResult = (formData: ScheduleViewModel): string => {
  const repeatType = formData.repeatMode[0];
  const startDate = formatDate(formData.startDate);
  const stopDate = formatDate(formData.stopDate);
  const repeatStep = Number(formData.repeatStep) || 1;

  if (repeatType === CalendarRepeatMode.Once) {
    return startDate ? `Однократно ${startDate}` : "Однократно";
  }

  if (repeatType === CalendarRepeatMode.Daily) {
    const result =
      repeatStep > 1
        ? `Повторять каждый ${repeatStep}-й день`
        : "Повторять каждый день";

    return appendRange(result, startDate, stopDate);
  }

  if (repeatType === CalendarRepeatMode.Weekly) {
    const prefix =
      repeatStep > 1 ? `Повторять каждую ${repeatStep}-ю неделю` : "Повторять";

    return appendRange(
      `${prefix} ${getWeekDaysResult(formData)}`,
      startDate,
      stopDate
    );
  }

  if (repeatType === CalendarRepeatMode.Calenddays) {
    const result = [
      "Повторять",
      getMonthResult(formData),
      getCalendDaysResult(formData),
    ]
      .filter(Boolean)
      .join(" ");

    return appendRange(result, startDate, stopDate);
  }

  if (repeatType === CalendarRepeatMode.Weekdays) {
    const weeksResult = getWeeksResult(formData);
    const result = [
      "Повторять",
      getMonthResult(formData),
      weeksResult,
      getWeekDaysResult(formData),
    ]
      .filter(Boolean)
      .join(" ");

    return appendRange(result, startDate, stopDate);
  }

  return "";
};
