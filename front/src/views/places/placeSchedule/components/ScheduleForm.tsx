import { FormEvent, useEffect, useState } from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { FormRow } from '@gravity-ui/components';
import { Button, Flex, Select } from '@gravity-ui/uikit';
import { FormRadioButton } from '@/components/formUi';
import { FormCheckbox } from '@/components/formUi/FormCheckbox';
import { FormDatePicker } from '@/components/formUi/FormDatePicker';
import { FormSelect } from '@/components/formUi/FormSelect';
import { FormTextInput } from '@/components/formUi/FormTextInput';
import { CalendarRepeatMode, ScheduleStatus, WorkTimeMode } from '@/store/api';
import { MONTHS_LIST } from '@/tools/constants';
import { EditFormMode } from '@/types';
import { getEmptyTimeSlot } from '../mappers/getEmptySchedule';
import { getTextResult } from '../mappers/getTextResult';
import { ScheduleViewModel } from '../types';
import { TimeSlotsComponent } from './TimeSlotsComponent';

interface ScheduleFormProps {
  data: ScheduleViewModel;
  onSave: (data: ScheduleViewModel) => void;
  mode?: EditFormMode;
}

export const ScheduleForm = (props: ScheduleFormProps) => {
  const formMethods = useForm({
    defaultValues: props.data,
  });

  const { handleSubmit, formState, reset, control, getValues } = formMethods;

  const submitHandler = (event: FormEvent) => {
    handleSubmit(props.onSave)(event);
  };

  const repeatMode = useWatch({
    control,
    name: 'repeatMode',
  });

  const [result, setResult] = useState('');

  const changeHandler = () => {
    setResult(getTextResult(getValues()));
  };
  useEffect(() => {
    setResult(getTextResult(getValues()));
  }, []);

  const resetFormHandler = () => {
    reset();
  };

  ///////////////

  const workTimeMode = useWatch({
    control,
    name: 'workTimeMode',
  });

  const {
    fields: timeSlots,
    append: appendTimeSlot,
    remove: removeTimeSlot,
    replace: replaceTimeSlot,
  } = useFieldArray({ name: 'timeSlots', control });

  const addTimeSlotHandler = () => {
    appendTimeSlot(getEmptyTimeSlot());
  };

  const removeTimeSlotHandler = (idx: number) => {
    removeTimeSlot(idx);
  };

  const updateModeHandler = () => {
    replaceTimeSlot([]);
  };

  return (
    <FormProvider {...formMethods}>
      <Flex direction="column" gap={4}>
        <Flex direction="column">
          <FormRow direction="row" fieldId="name" label="Название">
            <FormTextInput
              name="name"
              placeholder="введите название"
              autoComplete="off"
            />
          </FormRow>

          <FormRow direction="row" fieldId="mode" label="Статус">
            <FormSelect name="status" placeholder="Статус">
              <Select.Option value={ScheduleStatus.Active}>
                Активно
              </Select.Option>
              <Select.Option value={ScheduleStatus.Disabled}>
                Неактивно
              </Select.Option>
            </FormSelect>
          </FormRow>

          <FormRow direction="row" fieldId="name" label="Приоритет">
            <FormTextInput
              name="rank"
              placeholder="приоритет"
              autoComplete="off"
            />
          </FormRow>

          <FormRow direction="row" fieldId="mode" label="Тип повтора">
            <FormSelect
              name="repeatMode"
              placeholder="Тип повтора"
              onUpdate={changeHandler}
            >
              <Select.Option value={CalendarRepeatMode.Once}>
                Однократное
              </Select.Option>
              <Select.Option value={CalendarRepeatMode.Daily}>
                Ежедневное
              </Select.Option>
              <Select.Option value={CalendarRepeatMode.Weekly}>
                Еженедельное
              </Select.Option>
              <Select.Option value={CalendarRepeatMode.Calenddays}>
                По календарным дням
              </Select.Option>
              <Select.Option value={CalendarRepeatMode.Weekdays}>
                По дням недели
              </Select.Option>
            </FormSelect>
          </FormRow>
          {repeatMode[0] === CalendarRepeatMode.Once ? (
            <FormRow direction="row" fieldId="startDate" label="Дата">
              <FormDatePicker
                name="startDate"
                format="DD.MM.YYYY"
                placeholder="введите дату"
                onUpdate={changeHandler}
              />
            </FormRow>
          ) : (
            <>
              <FormRow direction="row" fieldId="startDate" label="Дата начала">
                <FormDatePicker
                  name="startDate"
                  format="DD.MM.YYYY"
                  placeholder="введите дату"
                  onUpdate={changeHandler}
                />
              </FormRow>
              <FormRow
                direction="row"
                fieldId="stopDate"
                label="Дата окончания"
              >
                <FormDatePicker
                  name="stopDate"
                  format="DD.MM.YYYY"
                  placeholder="введите дату"
                  onUpdate={changeHandler}
                />
              </FormRow>
            </>
          )}

          {![
            CalendarRepeatMode.Once,
            CalendarRepeatMode.Calenddays,
            CalendarRepeatMode.Weekdays,
          ].includes(repeatMode[0]) && (
            <FormRow direction="row" fieldId="repeatStep" label="Шаг повтора">
              <FormTextInput
                name="repeatStep"
                placeholder="введите значение"
                autoComplete="off"
                onUpdate={changeHandler}
              />
            </FormRow>
          )}

          {[
            CalendarRepeatMode.Calenddays,
            CalendarRepeatMode.Weekdays,
          ].includes(repeatMode[0]) && (
            <FormRow direction="row" label="Месяцы">
              {MONTHS_LIST.map((m, idx) => (
                <FormCheckbox
                  key={idx}
                  name={`m${idx + 1}` as keyof ScheduleViewModel}
                  style={{ marginRight: 8 }}
                  onUpdate={changeHandler}
                >
                  {m}
                </FormCheckbox>
              ))}
            </FormRow>
          )}

          {repeatMode[0] === CalendarRepeatMode.Calenddays && (
            <FormRow direction="row" label="Дни месяца">
              {Array.from(Array(31).keys()).map((dIdx) => (
                <FormCheckbox
                  key={dIdx}
                  name={`d${dIdx + 1}` as keyof ScheduleViewModel}
                  style={{ marginRight: 8 }}
                  onUpdate={changeHandler}
                >
                  {dIdx + 1}
                </FormCheckbox>
              ))}
              <FormCheckbox name="dLast" onUpdate={changeHandler}>
                Последний день месяца
              </FormCheckbox>
            </FormRow>
          )}

          {repeatMode[0] === CalendarRepeatMode.Weekdays && (
            <FormRow direction="row" label="Недели">
              {[
                'Первая неделя',
                'Вторая неделя',
                'Третья неделя',
                'Четвертая неделя',
              ].map((w, idx) => (
                <FormCheckbox
                  key={idx}
                  name={`w${idx + 1}` as keyof ScheduleViewModel}
                  style={{ marginRight: 8 }}
                  onUpdate={changeHandler}
                >
                  {w}
                </FormCheckbox>
              ))}
              <FormCheckbox name="wLast" onUpdate={changeHandler}>
                Последняя неделя
              </FormCheckbox>
            </FormRow>
          )}

          {[CalendarRepeatMode.Weekly, CalendarRepeatMode.Weekdays].includes(
            repeatMode[0]
          ) && (
            <FormRow direction="row" label="Дни недели">
              <FormCheckbox
                name={'wd1'}
                style={{ marginRight: 8 }}
                onUpdate={changeHandler}
              >
                Пн
              </FormCheckbox>
              <FormCheckbox
                name={'wd2'}
                style={{ marginRight: 8 }}
                onUpdate={changeHandler}
              >
                Вт
              </FormCheckbox>
              <FormCheckbox
                name={'wd3'}
                style={{ marginRight: 8 }}
                onUpdate={changeHandler}
              >
                Ср
              </FormCheckbox>
              <FormCheckbox
                name={'wd4'}
                style={{ marginRight: 8 }}
                onUpdate={changeHandler}
              >
                Чт
              </FormCheckbox>
              <FormCheckbox
                name={'wd5'}
                style={{ marginRight: 8 }}
                onUpdate={changeHandler}
              >
                Пт
              </FormCheckbox>
              <FormCheckbox
                name={'wd6'}
                style={{ marginRight: 8 }}
                onUpdate={changeHandler}
              >
                Сб
              </FormCheckbox>
              <FormCheckbox
                name={'wd7'}
                style={{ marginRight: 8 }}
                onUpdate={changeHandler}
              >
                Вс
              </FormCheckbox>
            </FormRow>
          )}
        </Flex>
        <strong>Что получилось:</strong>
        <div>{result}</div>

        <hr />
        <h3>Рабочее время</h3>

        <FormRow direction="row" fieldId="mode" label="Тип расписания">
          <FormSelect
            name="workTimeMode"
            placeholder="Тип расписания"
            onUpdate={updateModeHandler}
          >
            <Select.Option value={WorkTimeMode.Timegrid}>
              Четкое расписание
            </Select.Option>
            <Select.Option value={WorkTimeMode.Custom}>
              Произвольное время в рабочие часы
            </Select.Option>
            <Select.Option value={WorkTimeMode.Daily}>Весь день</Select.Option>
            <Select.Option value={WorkTimeMode.None}>
              Нерабочий день
            </Select.Option>
          </FormSelect>
        </FormRow>

        {workTimeMode[0] === WorkTimeMode.Timegrid ? (
          <TimeSlotsComponent
            label="Сеансы"
            timeSlots={timeSlots}
            onAdd={addTimeSlotHandler}
            onRemove={removeTimeSlotHandler}
          />
        ) : workTimeMode[0] === WorkTimeMode.Custom ? (
          <>
            <FormRow direction="row" label="Минимальная длительность">
              <Flex direction="row" gap={4}>
                <FormSelect name="minDurationHours" placeholder="Часов">
                  <Select.Option value="0">0 часов</Select.Option>
                  <Select.Option value="1">1 час</Select.Option>
                  <Select.Option value="2">2 часа</Select.Option>
                </FormSelect>

                <FormSelect name="minDurationMinutes" placeholder="Минут">
                  <Select.Option value="0">0 минут</Select.Option>
                  <Select.Option value="15">15 минут</Select.Option>
                  <Select.Option value="30">30 минут</Select.Option>
                  <Select.Option value="45">45 минут</Select.Option>
                </FormSelect>
              </Flex>
            </FormRow>

            <FormRow direction="row" label="Максимальная длительность">
              <Flex direction="row" gap={4}>
                <FormSelect name="maxDurationHours" placeholder="Часов">
                  <Select.Option value="0">0 часов</Select.Option>
                  <Select.Option value="1">1 час</Select.Option>
                  <Select.Option value="2">2 часа</Select.Option>
                </FormSelect>

                <FormSelect name="maxDurationMinutes" placeholder="Минут">
                  <Select.Option value="0">0 минут</Select.Option>
                  <Select.Option value="15">15 минут</Select.Option>
                  <Select.Option value="30">30 минут</Select.Option>
                  <Select.Option value="45">45 минут</Select.Option>
                </FormSelect>
              </Flex>
            </FormRow>

            <FormRow
              direction="row"
              label="Возможное начало слота (минуты в часе)"
            >
              <FormRadioButton
                name="timeStart"
                options={[
                  { value: '0', content: 'ХХ:00' },
                  { value: '15', content: 'ХХ:15' },
                  { value: '30', content: 'ХХ:30' },
                  { value: '45', content: 'ХХ:45' },
                ]}
              />
            </FormRow>

            <TimeSlotsComponent
              label="Рабочее время"
              timeSlots={timeSlots}
              onAdd={addTimeSlotHandler}
              onRemove={removeTimeSlotHandler}
            />
          </>
        ) : null}

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
        </Flex>
      </Flex>
    </FormProvider>
  );
};
