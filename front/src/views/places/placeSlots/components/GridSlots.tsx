import { useEffect, useRef, useState } from 'react';
import { RangeValue } from '@gravity-ui/date-components';
import { DateTime } from '@gravity-ui/date-utils';
import { Button, ButtonView } from '@gravity-ui/uikit';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { TooltipWrap } from '@/components/TooltipWrap';
import {
  GameStatus,
  GridDayResponseDto,
  useCreateGameForCustomSlotMutation,
  useCreateGameForSlotMutation,
  useDeleteGameMutation,
  WorkTimeMode,
} from '@/store/api';
import {
  dateTimeConvertToMinutes,
  timeConvertToFormattedString,
} from '@/tools/dateTools';
import { GridSlot } from '../types';
import { InfoModal } from './InfoModal';
import { WorktimeModal } from './WorktimeModal';

interface GridSlotsProps {
  /** День */
  day: GridDayResponseDto;
  /** Идентификатор площадки */
  placeId: string;
  /** Клик по слоту, если задан, то игнорируем внутреннюю логику компонента */
  onClick?: (slot: GridSlot) => void;

  /** Колбэк после успешного бронирования */
  onSuccessBooking?: (slotId: string) => void;

  /** Колбэк после успешной отмены бронирования */
  onSuccessCancel?: (slotId: string) => void;

  /** Id игры, если задан, влияет на отображение занятых слотов */
  gameId?: string;
}

/** Сетка фиксированных слотов на конкретные сутки */
export const GridSlots = (props: GridSlotsProps) => {
  const [createGameAction, createGameState] = useCreateGameForSlotMutation();

  const [deleteGameAction, deleteGameState] = useDeleteGameMutation();

  const [gridSlots, setGridSlots] = useState<GridSlot[]>([]);

  // Состояние окна подтверждения брони
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Состояние окна подтверждения удаления брони
  const [deleteBookingOpen, setDeleteBookingOpen] = useState(false);
  // Состояние окна показа данных слота
  const [infoOpen, setInfoOpen] = useState(false);
  // Состояние окна показа данных кастомного слота
  const [worktimeOpen, setWorktimeOpen] = useState(false);

  // Данные по слоту, для которго показано окно
  // используется и для подтверждения брони, и для показа данных
  const activeSlot = useRef<GridSlot | null>(null);

  /** Закрытие окна подтверждения брони */
  const confirmCloseHandler = () => {
    activeSlot.current = null;
    setConfirmOpen(false);
  };

  /** Открытие окна подтверждения брони */
  const confirmOpenHandler = () => setConfirmOpen(true);

  /** Бронирование слота */
  const slotBookingHandler = (slot: GridSlot) => {
    activeSlot.current = slot;
    confirmOpenHandler();
  };

  /** Закрытие окна показа данных слота */
  const infoCloseHandler = () => {
    activeSlot.current = null;
    setInfoOpen(false);
  };

  /** Открытие окна показа данных слота */
  const slotInfoHandler = (slot: GridSlot) => {
    activeSlot.current = slot;
    setInfoOpen(true);
  };

  const worktimeOpenHandler = (timeSlot: GridSlot) => {
    activeSlot.current = timeSlot;
    setWorktimeOpen(true);
  };
  const worktimeCloseHandler = () => {
    activeSlot.current = null;
    setWorktimeOpen(false);
  };

  /** Подтверждение бронирования слота из сетки */
  const confirmActionHandler = async () => {
    if (!activeSlot.current) return;

    try {
      const bookedSlot = await createGameAction({
        date: props.day.date,
        slotId: activeSlot.current.timeSlotId,
        placeId: props.placeId,
      });
      props.onSuccessBooking?.(bookedSlot.data.id);
    } catch (err) {
      console.error(err);
    } finally {
      confirmCloseHandler();
    }
  };

  const [createGameCustomAction] = useCreateGameForCustomSlotMutation();

  /** Подтверждение бронирования кастомного слота */
  const customConfirmActionHandler = async (data: RangeValue<DateTime>) => {
    try {
      const customBookedSlot = await createGameCustomAction({
        placeId: props.placeId,
        createGameDto: {
          date: props.day.date,
          timeStart: dateTimeConvertToMinutes(data.start),
          timeEnd: dateTimeConvertToMinutes(data.end),
          status: GameStatus.Draft,
        },
      });
      props.onSuccessBooking?.(customBookedSlot.data.id);
    } catch (err) {
      console.error(err);
    } finally {
      worktimeCloseHandler();
    }
  };

  /** Переход к игре по id слота */
  const clickAdvancedHandler = () => {
    if (!activeSlot.current?.gameId) return;
    props.onSuccessBooking?.(activeSlot.current.gameId);
  };

  /** Запуск подтверждения отмены брони */
  const deleteBookingHandler = () => {
    setInfoOpen(false);
    setDeleteBookingOpen(true);
  };

  /** Закрытие окна подтверждеия отмены брони */
  const deleteBookingCloseHandler = () => {
    activeSlot.current = null;
    setDeleteBookingOpen(false);
  };

  /** Подтверждение удаления брони в окне */
  const deleteGameActionHandler = async () => {
    if (!activeSlot.current?.gameId) return;

    try {
      const canceledSlot = await deleteGameAction({
        id: activeSlot.current.gameId,
      });

      props.onSuccessCancel?.(canceledSlot.data.id);
    } catch (err) {
      console.error(err);
    } finally {
      deleteBookingCloseHandler();
    }
  };

  // Заполняем слоты
  useEffect(() => {
    const result: GridSlot[] = [];

    // Добавляем слоты только с уникальными началами и концами
    // и без пересечений
    const addSlot = (slot: GridSlot) => {
      if (
        !result.some(
          (r) => r.timeStart === slot.timeStart && r.timeEnd === slot.timeEnd
        ) &&
        result.every((r) => slot.timeStart >= r.timeEnd)
      ) {
        result.push(slot);
      }
    };

    for (const timeSlot of [...props.day.timeSlots].sort(
      (a, b) => a.timeStart - b.timeStart
    )) {
      // Находим занятые слоты, пересекающиеся с текущим свободным
      const crossedBooked = props.day.games.filter(
        (game) =>
          game.timeStart < timeSlot.timeEnd && game.timeEnd > timeSlot.timeStart
      );

      if (crossedBooked.length > 0) {
        // Добавляем все crossedBooked как новые слоты
        crossedBooked.forEach((game) => {
          const resultSlot: GridSlot = {
            gameId: game.id,
            timeSlotId: timeSlot.id,
            timeStart: game.timeStart,
            timeEnd: game.timeEnd,
            date: game.date,
          };
          addSlot(resultSlot);
        });
      } else {
        addSlot({
          timeSlotId: timeSlot.id,
          timeStart: timeSlot.timeStart,
          timeEnd: timeSlot.timeEnd,
          date: props.day.date,
        });
      }
    }

    // Добавляем занятые слоты, которых нет в основном расписании
    props.day.games.forEach((game) => {
      const resultSlot: GridSlot = {
        gameId: game.id,
        timeSlotId: game.id,
        timeStart: game.timeStart,
        timeEnd: game.timeEnd,
        date: game.date,
      };
      addSlot(resultSlot);
    });

    setGridSlots(result);
  }, []);

  const slotClickHandler = (slot: GridSlot) => {
    // console.log('slotClickHandler', !!props.onClick, props.day.mode, slot);
    // Если обработчик клика задан снаружи, то игнорируем внутреннюю логику компонента
    if (props.onClick) {
      props.onClick(slot);
    } else if (slot.gameId) {
      slotInfoHandler(slot);
    } else if (props.day.workTimeMode === WorkTimeMode.Timegrid) {
      slotBookingHandler(slot);
    } else if (props.day.workTimeMode === WorkTimeMode.Custom) {
      worktimeOpenHandler(slot);
    }
  };

  const getSlotState = (
    gameId: string,
    slotGameId?: string
  ): { tooltip: string; view: ButtonView; selected: boolean } => {
    const result: { tooltip: string; view: ButtonView; selected: boolean } = {
      tooltip:
        gameId && slotGameId && gameId !== slotGameId
          ? 'Слот занят'
          : slotGameId
            ? gameId
              ? 'Текущий выбор'
              : 'Слот занят'
            : 'Доступен для выбора',
      view:
        gameId && slotGameId && gameId !== slotGameId
          ? 'outlined-utility'
          : slotGameId
            ? gameId
              ? 'outlined-info'
              : 'outlined-utility'
            : 'outlined-success',
      selected: !!slotGameId || (gameId && slotGameId && gameId !== slotGameId),
    };
    return result;
  };

  return (
    <>
      <div style={{ marginLeft: -8 }}>
        {gridSlots.map((slot, slotIdx) => {
          const slotState = getSlotState(props.gameId, slot.gameId);
          return (
            <TooltipWrap
              content={slotState.tooltip}
              key={`${slot.timeStart}_${slotIdx}`}
              placement="top"
            >
              <Button
                style={{ marginLeft: 8, marginTop: 8 }}
                onClick={() => slotClickHandler(slot)}
                disabled={
                  createGameState.isLoading || deleteGameState.isLoading
                }
                view={slotState.view}
                selected={slotState.selected}
              >
                {timeConvertToFormattedString(slot.timeStart)} -{' '}
                {timeConvertToFormattedString(slot.timeEnd)}
                {/* [{slot.timeStart} - {slot.timeEnd}] */}
              </Button>
            </TooltipWrap>
          );
        })}
        {gridSlots.length === 0 && (
          <Button
            view="flat"
            loading
            style={{ marginLeft: 8, marginTop: 8, visibility: 'hidden' }}
          >
            загрузка...
          </Button>
        )}
      </div>
      <ConfirmModal
        open={confirmOpen}
        onClose={confirmCloseHandler}
        onConfirm={confirmActionHandler}
      >
        Подтвердить бронь
      </ConfirmModal>
      <InfoModal
        open={infoOpen}
        onClose={infoCloseHandler}
        slot={activeSlot.current}
        onDeleteBooking={deleteBookingHandler}
        onClickAdvanced={clickAdvancedHandler}
      />
      <ConfirmModal
        open={deleteBookingOpen}
        onClose={deleteBookingCloseHandler}
        onConfirm={deleteGameActionHandler}
      >
        Подтвердить удаление
      </ConfirmModal>

      <WorktimeModal
        key={activeSlot?.current?.timeStart}
        open={worktimeOpen}
        onClose={worktimeCloseHandler}
        onConfirm={customConfirmActionHandler}
        timeSlot={activeSlot.current}
        scheduleId={props.day.id}
      />
    </>
  );
};
