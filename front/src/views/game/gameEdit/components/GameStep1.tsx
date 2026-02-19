import { FormEvent, useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { FormRow } from '@gravity-ui/components';
import { dateTime } from '@gravity-ui/date-utils';
import { Button, Flex, Select } from '@gravity-ui/uikit';
import { FormDatePicker, FormSelect } from '@/components/formUi';
import { useNotification } from '@/components/Notify';
import {
  GameLevel,
  GameStatus,
  PlaceResponseDto,
  RequestMode,
  useGetPlaceSlotsQuery,
  useGetPlacesQuery,
  useUpdateGameMutation,
} from '@/store/api';
import { useGameWebSocket } from '@/store/gameWebSocket';
import { DATE_SERV_FORMAT } from '@/tools/constants';
import { useRerender } from '@/tools/hooks/useRerender';
import { GridSlots } from '@/views/places/placeSlots/components/GridSlots';
import { GridSlot } from '@/views/places/placeSlots/types';
import { GameStep1Data, GameViewModel } from '../../common/types';
import { CountdownTimer } from './CountdownTimer';

interface GameStep1Props {
  data: GameViewModel;
  onNext: (data: GameStep1Data) => void;
}

export const GameStep1 = (props: GameStep1Props) => {
  const placeListGetState = useGetPlacesQuery({});

  const formMethods = useForm<GameViewModel>({
    defaultValues: props.data,
    mode: 'onChange',
  });

  const { handleSubmit, control, setValue, formState } = formMethods;

  const placeId = useWatch({ control, name: 'placeId' });
  const date = useWatch({ control, name: 'date' });
  const timeStart = useWatch({ control, name: 'timeStart' });
  const timeEnd = useWatch({ control, name: 'timeEnd' });

  const placeSlotsGetSate = useGetPlaceSlotsQuery({
    id: placeId?.[0] ?? '',
    startDate: date?.format(DATE_SERV_FORMAT) ?? '',
    stopDate: date?.format(DATE_SERV_FORMAT) ?? '',
  });

  const [updateGameAction, updateGameState] = useUpdateGameMutation();

  const { showError } = useNotification();

  const rerender = useRerender();

  // Черновик уже создан, используем его ID
  const draftId = props.data.id;
  const [isReserving, setIsReserving] = useState(false);

  // WebSocket для real-time обновлений
  const {
    connected,
    subscribeToPlace,
    unsubscribeFromPlace,
    onEvent,
    offEvent,
  } = useGameWebSocket({
    url: process.env.REACT_APP_WS_URL || 'http://localhost:3000',
    autoConnect: true,
  });

  // Подписка на события площадки
  useEffect(() => {
    const placeIdValue = placeId?.[0];
    if (connected && placeIdValue) {
      subscribeToPlace(placeIdValue);
    }

    return () => {
      if (placeIdValue) {
        unsubscribeFromPlace(placeIdValue);
      }
    };
  }, [connected, placeId, subscribeToPlace, unsubscribeFromPlace]);

  // Перезапрос слотов при событиях
  useEffect(() => {
    const handleGameEvent = () => {
      placeSlotsGetSate.refetch();
    };

    onEvent('game:reserved', handleGameEvent);
    onEvent('game:released', handleGameEvent);
    onEvent('game:updated', handleGameEvent);

    return () => {
      offEvent('game:reserved', handleGameEvent);
      offEvent('game:released', handleGameEvent);
      offEvent('game:updated', handleGameEvent);
    };
  }, [offEvent, onEvent, placeSlotsGetSate.refetch]);

  const timeChangeHandler = async (slot: GridSlot) => {
    // Проверка: слот занят другой игрой?
    if (slot.gameId && slot.gameId !== props.data.id) {
      showError({ message: 'Этот слот уже занят другой игрой' });
      return;
    }

    // Устанавливаем значения в форму
    setValue('timeStart', slot.timeStart, {
      shouldTouch: true,
      shouldDirty: true,
    });
    setValue('timeEnd', slot.timeEnd, {
      shouldTouch: true,
      shouldDirty: true,
    });

    // Обновляем черновик
    await changeTimeSlot(slot);

    rerender();
  };

  const currentPlace = placeListGetState.data?.items.find(
    (el: PlaceResponseDto) => el.id === props.data.placeId[0]
  );

  /** Изменение времени в черновике (только update) */
  const changeTimeSlot = async (slot: GridSlot) => {
    if (!draftId) {
      showError({ message: 'Черновик игры не найден' });
      return;
    }

    const dateValue = date;
    if (!dateValue) {
      showError({ message: 'Дата не выбрана' });
      return;
    }

    setIsReserving(true);

    try {
      await updateGameAction({
        id: draftId,
        updateGameDto: {
          id: draftId,
          placeId: props.data.placeId[0],
          timeStart: slot.timeStart,
          timeEnd: slot.timeEnd,
          date: dateValue.format(DATE_SERV_FORMAT),
          level: (props.data.level?.[0] as GameLevel) || GameLevel.Easy,
          requestMode: props.data.requestMode || RequestMode.Private,
        },
      }).unwrap();
    } catch (error) {
      console.error('Ошибка обновления времени:', error);
      showError({
        message:
          error && typeof error === 'object' && 'data' in error
            ? (error.data as { message?: string })?.message ||
              'Не удалось обновить время'
            : 'Не удалось обновить время',
      });

      // Сбрасываем выбранное время при ошибке
      setValue('timeStart', undefined);
      setValue('timeEnd', undefined);
    } finally {
      setIsReserving(false);
    }
  };

  const submitHandler = (event: FormEvent) => {
    handleSubmit((formData) => {
      // Валидация: все поля должны быть заполнены
      if (
        !formData.placeId?.[0] ||
        !formData.date ||
        !formData.timeStart ||
        !formData.timeEnd
      ) {
        return;
      }

      const step1Data: GameStep1Data = {
        placeId: formData.placeId,
        date: formData.date,
        timeStart: formData.timeStart,
        timeEnd: formData.timeEnd,
      };

      props.onNext(step1Data);
    })(event);
  };

  // Проверка валидности данных для активации кнопки "Далее"
  const isStep1Valid = () => {
    const placeIdValue = placeId?.[0];
    const dateValue = date;
    const timeStartValue = formMethods.getValues('timeStart');
    const timeEndValue = formMethods.getValues('timeEnd');

    return !!(
      placeIdValue &&
      dateValue &&
      timeStartValue !== undefined &&
      timeEndValue !== undefined &&
      !formState.errors.placeId &&
      !formState.errors.date
    );
  };

  return (
    <>
      <Flex direction="column" gap={4}>
        <div>
          Площадка:{' '}
          <strong>{currentPlace?.name || props.data.place.name}</strong>
        </div>
        <div>
          Дата:{' '}
          <strong>
            {dateTime({ input: date }).format('LL')}{' '}
            {dateTime({ input: date }).format('dddd')}
          </strong>
        </div>

        <div>
          Время:{' '}
          <strong>
            {timeStart !== undefined ? (
              <>
                {String(Math.floor(timeStart / 60)).padStart(2, '0')}:
                {String(timeStart % 60).padStart(2, '0')} -{' '}
                {String(Math.floor(timeEnd! / 60)).padStart(2, '0')}:
                {String(timeEnd! % 60).padStart(2, '0')}
              </>
            ) : (
              'Не выбрано'
            )}
          </strong>
        </div>

        <div>
          Создана:{' '}
          <strong>
            {dateTime({ input: props.data.createdAt }).format('LLL')}
          </strong>
        </div>
        <div>
          Статус: <strong>{props.data.status}</strong>
        </div>

        {props.data.status === GameStatus.Draft && (
          <CountdownTimer date={props.data.createdAt} />
        )}

        <FormProvider {...formMethods}>
          <form onSubmit={submitHandler}>
            <Flex direction="column" gap={4}>
              <FormRow
                direction="row"
                fieldId="placeId"
                label="Площадка"
                className="mod"
              >
                <FormSelect
                  name="placeId"
                  placeholder="Площадка"
                  validationState={
                    formState.errors.placeId ? 'invalid' : undefined
                  }
                >
                  {placeListGetState.data?.items.map((el: PlaceResponseDto) => (
                    <Select.Option key={el.id} value={el.id}>
                      {el.name}
                    </Select.Option>
                  ))}
                </FormSelect>
              </FormRow>

              <FormRow direction="row" fieldId="date" label="Дата">
                <FormDatePicker
                  name="date"
                  format="DD.MM.YYYY"
                  placeholder="введите дату"
                  validationState={
                    formState.errors.date ? 'invalid' : undefined
                  }
                />
              </FormRow>

              {!!placeId?.length && !!currentPlace?.sports?.length && (
                <div style={{ marginTop: 8, color: '#666', fontSize: 14 }}>
                  Вид спорта будет выбран на следующем шаге
                </div>
              )}

              <div>
                {placeSlotsGetSate.isSuccess &&
                  placeSlotsGetSate.data.days.length && (
                    <GridSlots
                      day={placeSlotsGetSate.data.days[0]}
                      placeId={placeId[0]}
                      onClick={timeChangeHandler}
                      gameId={props.data.id}
                    />
                  )}
              </div>

              <Flex gap={4} style={{ marginTop: 16 }}>
                <Button
                  view="action"
                  type="submit"
                  disabled={
                    !isStep1Valid() || updateGameState.isLoading || isReserving
                  }
                  loading={updateGameState.isLoading || isReserving}
                >
                  Далее
                </Button>
              </Flex>
            </Flex>
          </form>
        </FormProvider>
      </Flex>
    </>
  );
};
