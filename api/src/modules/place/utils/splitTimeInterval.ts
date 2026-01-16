import { Schedule } from '@/prismaClient';

interface TimeInterval {
  timeStart: number;
  timeEnd: number;
}

/** Разбивка единого временного интервала на набор временных интервалов */
export const splitTimeInterval = (
  parentInterval: TimeInterval,
  childSegments: TimeInterval[],
  scheduleTemplate: Schedule
) => {
  const { timeStart, timeEnd } = parentInterval;

  // Добавляем границы интервала, если их нет в точках
  const allPoints = [
    ...new Set([
      timeStart,
      ...childSegments.map((p) => p.timeStart),
      ...childSegments.map((p) => p.timeEnd),
      timeEnd,
    ]),
  ];

  // Сортируем точки
  allPoints.sort((a, b) => a - b);

  // Создаём подотрезки между соседними точками
  const segments: TimeInterval[] = [];
  for (let i = 0; i < allPoints.length - 1; i++) {
    // Начало слота (минуты в часе)
    const startMinutes = new Date(
      new Date().setHours(0, allPoints[i])
    ).getMinutes();
    const diffStartSlot = (scheduleTemplate.timeStart || 60) - startMinutes;

    const resultStart =
      allPoints[i] + diffStartSlot - (diffStartSlot === 60 ? 60 : 0);

    if (resultStart !== allPoints[i + 1]) {
      segments.push({
        timeStart: resultStart,
        timeEnd: allPoints[i + 1],
      });
    }
  }

  return segments;
};
