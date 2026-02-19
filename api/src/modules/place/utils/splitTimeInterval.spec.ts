import { splitTimeInterval } from './splitTimeInterval';

describe('splitTimeInterval', () => {
  it('возвращает исходный интервал, если бронирований нет и старт уже выровнен', () => {
    expect(
      splitTimeInterval(
        { timeStart: 540, timeEnd: 720 },
        [],
        { timeStart: 0 }
      )
    ).toEqual([{ timeStart: 540, timeEnd: 720 }]);
  });

  it('выравнивает старт интервала по заданной минуте в каждом часе', () => {
    expect(
      splitTimeInterval(
        { timeStart: 540, timeEnd: 720 },
        [],
        { timeStart: 15 }
      )
    ).toEqual([{ timeStart: 555, timeEnd: 720 }]);
  });

  it('вырезает занятое время и поднимает следующий доступный старт вверх', () => {
    expect(
      splitTimeInterval(
        { timeStart: 540, timeEnd: 720 },
        [{ timeStart: 600, timeEnd: 630 }],
        { timeStart: 15 }
      )
    ).toEqual([
      { timeStart: 555, timeEnd: 600 },
      { timeStart: 675, timeEnd: 720 },
    ]);
  });

  it('объединяет пересекающиеся занятые интервалы перед построением свободных', () => {
    expect(
      splitTimeInterval(
        { timeStart: 540, timeEnd: 720 },
        [
          { timeStart: 570, timeEnd: 630 },
          { timeStart: 615, timeEnd: 660 },
        ],
        { timeStart: 0 }
      )
    ).toEqual([
      { timeStart: 540, timeEnd: 570 },
      { timeStart: 660, timeEnd: 720 },
    ]);
  });

  it('возвращает пустой список, когда бронирования полностью покрывают интервал', () => {
    expect(
      splitTimeInterval(
        { timeStart: 540, timeEnd: 720 },
        [{ timeStart: 540, timeEnd: 720 }],
        { timeStart: 0 }
      )
    ).toEqual([]);
  });
});
