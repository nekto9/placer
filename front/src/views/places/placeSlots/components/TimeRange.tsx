import { useRef, useState } from "react";
import { Path } from "react-hook-form";
import { RangeValue } from "@gravity-ui/date-components";
import { DateTime, dateTime } from "@gravity-ui/date-utils";
import { BaseSliderRefType, Slider } from "@gravity-ui/uikit";

/** Длительность слота */
const getRangeSize = (startRange: number, endRange: number) => {
  return Math.abs(endRange - startRange);
};

/** Подписи значений, преобразование минут в hh:mm */
const sliderFormatter = (value: number) => {
  // Проверяем, является ли входное значение числом
  if (typeof value !== "number" || isNaN(value)) {
    return "00:00";
  }

  const hoursValue = value / 60;

  // Получаем целую часть (часы)
  const hours = Math.floor(hoursValue);

  // Получаем дробную часть и преобразуем в минуты
  const minutes = Math.round((hoursValue - hours) * 60);

  // Форматируем часы и минуты, чтобы всегда было 2 цифры
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

const calcDateTime = (timeInMinutes: number) => {
  return new Date().setHours(0, timeInMinutes);
};

const normalizeMinuteOffset = (value?: number) => {
  if (value === undefined || value === null || isNaN(value)) {
    return null;
  }

  const normalizedValue = value % 60;
  return normalizedValue >= 0 ? normalizedValue : normalizedValue + 60;
};

const alignToNextAllowedStart = (
  timeInMinutes: number,
  minuteOffset: number
) => {
  const hourStart = Math.floor(timeInMinutes / 60) * 60;
  const currentMinute = ((timeInMinutes % 60) + 60) % 60;

  if (currentMinute === minuteOffset) {
    return timeInMinutes;
  }

  if (currentMinute < minuteOffset) {
    return hourStart + minuteOffset;
  }

  return hourStart + 60 + minuteOffset;
};

const alignToPreviousAllowedStart = (
  timeInMinutes: number,
  minuteOffset: number
) => {
  const hourStart = Math.floor(timeInMinutes / 60) * 60;
  const currentMinute = ((timeInMinutes % 60) + 60) % 60;

  if (currentMinute === minuteOffset) {
    return timeInMinutes;
  }

  if (currentMinute > minuteOffset) {
    return hourStart + minuteOffset;
  }

  return hourStart - 60 + minuteOffset;
};

interface TimeRangeProps<T> {
  /** Минимальная длительность слота в минутах */
  minRangeSize: number;
  /** Максимальная длительность слота в минутах */
  maxRangeSize: number;

  /** Начало шкалы для выбора в минутах */
  startTimeScale: number;
  /** Конец шкалы для выбора в минутах */
  endTimeScale: number;

  /** Шаг в минутах */
  step: number;
  /** Допустимая минута старта в каждом часу */
  startMinuteOffset?: number;

  onUpdate: (data: RangeValue<DateTime>) => void;

  name: Path<T>;
}

export const TimeRange = <T,>(props: TimeRangeProps<T>) => {
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    props.startTimeScale,
    props.startTimeScale + props.minRangeSize,
  ]);

  const sliderRef = useRef<BaseSliderRefType>(null);

  const sliderUpdateCompleteHandler = (value: [number, number]) => {
    let startRange = value[0];
    let endRange = value[1];
    const startMinuteOffset = normalizeMinuteOffset(props.startMinuteOffset);

    startRange = Math.max(startRange, props.startTimeScale);

    if (startMinuteOffset !== null) {
      startRange = alignToNextAllowedStart(startRange, startMinuteOffset);
    }

    // Если длина нового слота меньше минимального, то смещаем конечную дату
    if (getRangeSize(startRange, endRange) < props.minRangeSize) {
      endRange = startRange + props.minRangeSize;
    }

    // Если длина нового слота больше максимального, то смещаем конечную дату
    if (getRangeSize(startRange, endRange) > props.maxRangeSize) {
      endRange = startRange + props.maxRangeSize;
    }

    // Если конечная дата больше ограничения рабочего времени, то смещаем начальную дату
    if (endRange > props.endTimeScale) {
      endRange = props.endTimeScale;

      const latestAllowedStart =
        startMinuteOffset === null
          ? props.endTimeScale - props.minRangeSize
          : alignToPreviousAllowedStart(
              props.endTimeScale - props.minRangeSize,
              startMinuteOffset
            );

      startRange = Math.max(latestAllowedStart, props.startTimeScale);
    }

    setSliderValue([startRange, endRange]);

    props.onUpdate({
      start: dateTime({
        input: calcDateTime(startRange),
      }),
      end: dateTime({
        input: calcDateTime(endRange),
      }),
    });
  };

  const sliderUpdateHandler = (value: [number, number]) => {
    setSliderValue(value);
    sliderRef.current.blur();
  };

  return (
    <>
      <div style={{ marginBottom: 16, fontSize: 16 }}>
        {dateTime({
          input: calcDateTime(sliderValue[0]),
        }).format("HH:mm")}{" "}
        -{" "}
        {dateTime({
          input: calcDateTime(sliderValue[1]),
        }).format("HH:mm")}
      </div>
      <Slider
        value={sliderValue}
        step={props.step}
        min={props.startTimeScale}
        max={props.endTimeScale}
        tooltipFormat={sliderFormatter}
        tooltipDisplay="on"
        markFormat={sliderFormatter}
        onUpdate={sliderUpdateHandler}
        onUpdateComplete={sliderUpdateCompleteHandler}
        name={props.name}
        apiRef={sliderRef}
      />
    </>
  );
};
