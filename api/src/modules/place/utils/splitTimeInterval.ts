interface TimeInterval {
  timeStart: number;
  timeEnd: number;
}

interface ScheduleLike {
  timeStart?: number | null;
}

const normalizeStartMinute = (value?: number | null) => {
  if (value == null || Number.isNaN(value)) {
    return 0;
  }

  const normalized = value % 60;
  return normalized >= 0 ? normalized : normalized + 60;
};

const alignToNextAllowedStart = (
  timeInMinutes: number,
  startMinute: number
) => {
  const hourStart = Math.floor(timeInMinutes / 60) * 60;
  const minute = timeInMinutes % 60;

  if (minute === startMinute) {
    return timeInMinutes;
  }

  if (minute < startMinute) {
    return hourStart + startMinute;
  }

  return hourStart + 60 + startMinute;
};

const buildAvailableSegment = (
  timeStart: number,
  timeEnd: number,
  startMinute: number
) => {
  const alignedStart = alignToNextAllowedStart(timeStart, startMinute);

  if (alignedStart >= timeEnd) {
    return null;
  }

  return {
    timeStart: alignedStart,
    timeEnd,
  };
};

const mergeIntervals = (intervals: TimeInterval[]) => {
  if (!intervals.length) {
    return [];
  }

  const sortedIntervals = [...intervals].sort(
    (left, right) => left.timeStart - right.timeStart
  );
  const mergedIntervals: TimeInterval[] = [sortedIntervals[0]];

  for (const interval of sortedIntervals.slice(1)) {
    const lastInterval = mergedIntervals[mergedIntervals.length - 1];

    if (interval.timeStart <= lastInterval.timeEnd) {
      lastInterval.timeEnd = Math.max(lastInterval.timeEnd, interval.timeEnd);
      continue;
    }

    mergedIntervals.push({ ...interval });
  }

  return mergedIntervals;
};

/** Разбивает рабочий интервал на свободные подинтервалы между занятыми диапазонами. */
export const splitTimeInterval = (
  parentInterval: TimeInterval,
  childSegments: TimeInterval[],
  scheduleTemplate: ScheduleLike
) => {
  const startMinute = normalizeStartMinute(scheduleTemplate.timeStart);
  const busyIntervals = mergeIntervals(
    childSegments
      .filter(
        (segment) =>
          segment.timeStart < parentInterval.timeEnd &&
          segment.timeEnd > parentInterval.timeStart
      )
      .map((segment) => ({
        timeStart: Math.max(segment.timeStart, parentInterval.timeStart),
        timeEnd: Math.min(segment.timeEnd, parentInterval.timeEnd),
      }))
  );

  if (!busyIntervals.length) {
    const availableSegment = buildAvailableSegment(
      parentInterval.timeStart,
      parentInterval.timeEnd,
      startMinute
    );

    return availableSegment ? [availableSegment] : [];
  }

  const availableSegments: TimeInterval[] = [];
  let currentStart = parentInterval.timeStart;

  for (const busyInterval of busyIntervals) {
    const availableSegment = buildAvailableSegment(
      currentStart,
      busyInterval.timeStart,
      startMinute
    );

    if (availableSegment) {
      availableSegments.push(availableSegment);
    }

    currentStart = Math.max(currentStart, busyInterval.timeEnd);
  }

  const tailSegment = buildAvailableSegment(
    currentStart,
    parentInterval.timeEnd,
    startMinute
  );

  if (tailSegment) {
    availableSegments.push(tailSegment);
  }

  return availableSegments;
};
