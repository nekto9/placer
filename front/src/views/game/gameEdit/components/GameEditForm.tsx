import { FormEvent, useState } from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { FormRow } from '@gravity-ui/components';
import { dateTime } from '@gravity-ui/date-utils';
import { Button, Flex, Select } from '@gravity-ui/uikit';
import {
  FormDatePicker,
  FormRadioButton,
  FormSelect,
  FormTextInput,
} from '@/components/formUi';
import { UserSearchModal } from '@/components/modal/UserSearchModal';
import {
  getGameLevelLabel,
  getRequestModeLabel,
} from '@/components/ui/GameCard/utils';
import { Loading } from '@/layouts/components';
import {
  GameLevel,
  GameStatus,
  GameUserDto,
  GameUserRole,
  GameUserStatus,
  PlaceResponseDto,
  RequestMode,
  useGetPlaceSlotsQuery,
  useGetPlacesQuery,
} from '@/store/api';
import { DATE_SERV_FORMAT } from '@/tools/constants';
import { timeConvertToFormattedString } from '@/tools/dateTools';
import { useRerender } from '@/tools/hooks/useRerender';
import { GridSlots } from '@/views/places/placeSlots/components/GridSlots';
import { GridSlot } from '@/views/places/placeSlots/types';
import { convertGameUserToViewModel } from '../../common/mappers/convertToViewModel';
import { GameViewModel } from '../../common/types';
import { CountdownTimer } from './CountdownTimer';

interface GameEditFormProps {
  data: GameViewModel;
  onSave: (data: GameViewModel) => void;
}

export const GameEditForm = (props: GameEditFormProps) => {
  const placeListGetState = useGetPlacesQuery({});

  const formMethods = useForm({
    defaultValues: props.data,
  });

  const { handleSubmit, getValues, formState, reset, control } = formMethods;

  const submitHandler = (event: FormEvent) => {
    handleSubmit(props.onSave)(event);
  };

  const resetFormHandler = () => {
    reset();
  };

  const placeId = useWatch({ control, name: 'placeId' });
  const date = useWatch({ control, name: 'date' });

  const placeSlotsGetSate = useGetPlaceSlotsQuery({
    id: placeId[0],
    startDate: date.format(DATE_SERV_FORMAT),
    stopDate: date.format(DATE_SERV_FORMAT),
  });

  const {
    fields: gameUsers,
    append: appendGameUser,
    remove: removeGameUser,
  } = useFieldArray({ control, name: 'gameUsers' });

  const rerender = useRerender();

  const timeChangeHandler = (slot: GridSlot) => {
    if (slot.gameId && slot.gameId !== props.data.id) return;
    formMethods.setValue('timeStart', slot.timeStart, {
      shouldTouch: true,
      shouldDirty: true,
    });
    formMethods.setValue('timeEnd', slot.timeEnd, {
      shouldTouch: true,
      shouldDirty: true,
    });

    rerender();
  };

  const [userSearchOpen, setUserSearchOpen] = useState(false);

  const addGameUserHandler = () => {
    // appendGameUser({ id: 'id', userId: 'userId', userName: 'userName' });
    setUserSearchOpen(true);
  };

  const userSearchCloseHandler = () => setUserSearchOpen(false);
  const userSearchActionHandler = (user: GameUserDto) =>
    appendGameUser(convertGameUserToViewModel(user));

  const currentPlace = placeListGetState.data?.items.find(
    (el: PlaceResponseDto) => el.id === props.data.placeId[0]
  );

  return (
    <>
      <Loading isActive={placeListGetState.isFetching} loadingKey="gameEdit" />

      {placeListGetState.isSuccess && (
        <FormProvider {...formMethods}>
          <div>Площадка: {currentPlace?.name || props.data.place.name}</div>
          <div>
            Дата: <strong>{dateTime({ input: date }).format('LL')}</strong>{' '}
            {dateTime({ input: date }).format('dddd')}
          </div>

          <div>
            Время: {timeConvertToFormattedString(getValues('timeStart'))} -{' '}
            {timeConvertToFormattedString(getValues('timeEnd'))}
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

          <Flex direction="column" gap={4}>
            <Flex direction="column">
              <FormRow
                direction="row"
                fieldId="placeId"
                label="Площадка"
                className="mod"
              >
                <FormSelect
                  name="placeId"
                  placeholder="Площадка"
                  control={control}
                >
                  {placeListGetState.data?.items.map((el: PlaceResponseDto) => (
                    <Select.Option key={el.id} value={el.id}>
                      {el.name}
                    </Select.Option>
                  ))}
                </FormSelect>
              </FormRow>

              {!!placeId.length && !!currentPlace?.sports?.length && (
                <FormRow
                  direction="row"
                  fieldId="sportId"
                  label="Вид спорта"
                  className="mod"
                >
                  <FormSelect
                    name="sportId"
                    placeholder="Вид спорта"
                    control={control}
                  >
                    {currentPlace?.sports?.map((el: PlaceResponseDto) => (
                      <Select.Option key={el.id} value={el.id}>
                        {el.name}
                      </Select.Option>
                    ))}
                  </FormSelect>
                </FormRow>
              )}

              <FormRow direction="row" fieldId="date" label="Дата">
                <FormDatePicker
                  name="date"
                  format="DD.MM.YYYY"
                  placeholder="введите дату"
                  control={control}
                />
              </FormRow>
            </Flex>
            <div key={placeSlotsGetSate.fulfilledTimeStamp}>
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

            <hr />
            <h3>Игроки</h3>
            <div>
              {gameUsers.map((user, idx) => (
                <div key={user.id}>
                  {user.userName}

                  {user.role === GameUserRole.Creator
                    ? '(создатель)'
                    : '(игрок)'}

                  {user.role !== GameUserRole.Creator && (
                    <>
                      <FormSelect
                        name={`gameUsers.${idx}.status`}
                        placeholder="Статус"
                        control={control}
                      >
                        <Select.Option value={String(GameUserStatus.Invited)}>
                          Приглашен
                        </Select.Option>

                        <Select.Option value={String(GameUserStatus.Confirmed)}>
                          Подтвердил участие
                        </Select.Option>
                        <Select.Option value={String(GameUserStatus.Rejected)}>
                          Отказался от участия
                        </Select.Option>

                        <Select.Option value={String(GameUserStatus.Requested)}>
                          Запросил участие
                        </Select.Option>
                        <Select.Option value={String(GameUserStatus.Allowed)}>
                          Одобрен
                        </Select.Option>
                        <Select.Option value={String(GameUserStatus.Declined)}>
                          Отклонен
                        </Select.Option>
                      </FormSelect>

                      <Button
                        view="normal"
                        component={'span'}
                        onClick={() => removeGameUser(idx)}
                      >
                        Удалить игрока
                      </Button>
                    </>
                  )}
                </div>
              ))}

              <Button
                view="normal"
                component={'span'}
                onClick={addGameUserHandler}
              >
                Добавить игрока
              </Button>

              <UserSearchModal
                open={userSearchOpen}
                onClose={userSearchCloseHandler}
                onConfirm={userSearchActionHandler}
                selectedUsers={gameUsers.map((el) => el.userId)}
              />
            </div>

            <FormRow
              direction="row"
              fieldId="level"
              label="Уровень сложности"
              className="mod"
            >
              <FormSelect
                name="level"
                placeholder="Уровень сложности"
                control={control}
              >
                <Select.Option value={GameLevel.Easy}>
                  {getGameLevelLabel(GameLevel.Easy).text}
                </Select.Option>
                <Select.Option value={GameLevel.Medium}>
                  {getGameLevelLabel(GameLevel.Medium).text}
                </Select.Option>
                <Select.Option value={GameLevel.Hard}>
                  {getGameLevelLabel(GameLevel.Hard).text}
                </Select.Option>
              </FormSelect>
            </FormRow>

            <FormRow direction="row" label="Режим набора участников">
              <FormRadioButton
                control={control}
                name="requestMode"
                options={[
                  {
                    value: RequestMode.Private,
                    content: getRequestModeLabel(RequestMode.Private).text,
                  },
                  {
                    value: RequestMode.Moderate,
                    content: getRequestModeLabel(RequestMode.Moderate).text,
                  },
                  {
                    value: RequestMode.Public,
                    content: getRequestModeLabel(RequestMode.Public).text,
                  },
                ]}
              />
            </FormRow>

            <FormRow
              direction="row"
              fieldId="description"
              label="Минимум участников"
            >
              <FormTextInput
                control={control}
                name="countMembersMin"
                placeholder="Минимум участников"
                autoComplete="off"
              />
            </FormRow>
            <FormRow
              direction="row"
              fieldId="description"
              label="Максимум участников"
            >
              <FormTextInput
                control={control}
                name="countMembersMax"
                placeholder="Максимум участников"
                autoComplete="off"
              />
            </FormRow>

            <FormRow direction="row" fieldId="description" label="Описание">
              <FormTextInput
                control={control}
                name="description"
                placeholder="введите описание"
                autoComplete="off"
              />
            </FormRow>

            <Flex gap={4}>
              <form onSubmit={submitHandler}>
                <Button
                  view="action"
                  type="submit"
                  disabled={!formState.isDirty}
                >
                  Сохранить
                </Button>
              </form>
              <Button
                view="normal"
                disabled={!formState.isDirty}
                onClick={resetFormHandler}
              >
                Сбросить
              </Button>
            </Flex>
          </Flex>
        </FormProvider>
      )}
    </>
  );
};
