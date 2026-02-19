import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { FormRow } from '@gravity-ui/components';
import { Button, Flex, Select } from '@gravity-ui/uikit';
import {
  FormRadioButton,
  FormSelect,
  FormTextInput,
} from '@/components/formUi';
import { UserSearchModal } from '@/components/modal/UserSearchModal';
import {
  getGameLevelLabel,
  getRequestModeLabel,
} from '@/components/ui/GameCard/utils';
import {
  GameLevel,
  GameUserDto,
  GameUserRole,
  GameUserStatus,
  RequestMode,
  useGetPlaceByIdQuery,
} from '@/store/api';
import { convertGameUserToViewModel } from '../../common/mappers/convertToViewModel';
import { GameStep1Data, GameViewModel } from '../../common/types';

interface GameStep2Props {
  data: GameViewModel;
  step1Data: GameStep1Data;
  onBack: () => void;
  onSave: (data: GameViewModel) => Promise<void>;
}

export const GameStep2 = (props: GameStep2Props) => {
  const defaultStep2Values = useMemo(() => {
    return {
      ...props.data,
      placeId: props.step1Data.placeId,
      date: props.step1Data.date,
      timeStart: props.step1Data.timeStart,
      timeEnd: props.step1Data.timeEnd,
    };
  }, [props.data, props.step1Data]);

  const formMethods = useForm<GameViewModel>({
    defaultValues: defaultStep2Values,
    mode: 'onChange',
  });

  const { handleSubmit, formState, reset, control } = formMethods;

  useEffect(() => {
    reset(defaultStep2Values);
  }, [defaultStep2Values, reset]);

  const {
    fields: gameUsers,
    append: appendGameUser,
    remove: removeGameUser,
  } = useFieldArray({ control, name: 'gameUsers' });

  const [userSearchOpen, setUserSearchOpen] = useState(false);

  const addGameUserHandler = () => {
    setUserSearchOpen(true);
  };

  const userSearchCloseHandler = () => setUserSearchOpen(false);
  const userSearchActionHandler = (user: GameUserDto) =>
    appendGameUser(convertGameUserToViewModel(user));

  const submitHandler = (event: FormEvent) => {
    handleSubmit(async (formData) => {
      const fullData: GameViewModel = {
        ...formData,
        placeId: props.step1Data.placeId,
        date: props.step1Data.date,
        timeStart: props.step1Data.timeStart,
        timeEnd: props.step1Data.timeEnd,
      };

      await props.onSave(fullData);
      reset(fullData);
    })(event);
  };

  const resetFormHandler = () => {
    reset(defaultStep2Values);
  };

  const placeId = props.step1Data.placeId?.[0] || props.data.placeId?.[0];
  const placeGetState = useGetPlaceByIdQuery(
    { id: placeId || '' },
    { skip: !placeId }
  );
  const currentPlaceSports = placeGetState.data?.sports || [];

  return (
    <>
      <FormProvider {...formMethods}>
        <Flex direction="column" gap={4}>
          <div style={{ marginBottom: 16, color: '#666' }}>
            <strong>Шаг 2 из 2:</strong> Заполните остальные данные игры
          </div>

          <hr />

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
              validationState={formState.errors.sportId ? 'invalid' : undefined}
            >
              {currentPlaceSports.map((el) => (
                <Select.Option key={el.id} value={el.id}>
                  {el.name}
                </Select.Option>
              ))}
            </FormSelect>
          </FormRow>

          <hr />

          <h3>Игроки</h3>
          <div>
            {gameUsers.map((user, idx) => (
              <div key={user.id} style={{ marginBottom: 8 }}>
                {user.userName}

                {user.role === GameUserRole.Creator ? '(создатель)' : '(игрок)'}

                {user.role !== GameUserRole.Creator && (
                  <>
                    <FormSelect
                      name={`gameUsers.${idx}.status`}
                      placeholder="Статус"
                      control={control}
                      width={180}
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
              style={{ marginTop: 8 }}
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

          <hr />

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
            fieldId="countMembersMin"
            label="Минимум участников"
          >
            <FormTextInput
              control={control}
              name="countMembersMin"
              placeholder="Минимум участников"
              autoComplete="off"
              type="number"
            />
          </FormRow>

          <FormRow
            direction="row"
            fieldId="countMembersMax"
            label="Максимум участников"
          >
            <FormTextInput
              control={control}
              name="countMembersMax"
              placeholder="Максимум участников"
              autoComplete="off"
              type="number"
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

          <hr />

          <Flex gap={4}>
            <form onSubmit={submitHandler}>
              <Button view="action" type="submit" disabled={!formState.isDirty}>
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
            <Button view="flat" onClick={props.onBack}>
              Назад
            </Button>
          </Flex>
        </Flex>
      </FormProvider>
    </>
  );
};
