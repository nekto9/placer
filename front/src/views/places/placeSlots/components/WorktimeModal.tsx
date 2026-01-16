import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RangeValue } from '@gravity-ui/date-components';
import { DateTime } from '@gravity-ui/date-utils';
import { Dialog } from '@gravity-ui/uikit';
import { useGetScheduleByIdQuery } from '@/store/api';
import { TimeRange } from '@/views/places/placeSlots/components/TimeRange';
import { GridSlot } from '../types';

// import { WorkTimeSelector } from './WorkTimeSelector';

const calcDurationMinutes = (hours: number, minutes: number) => {
  return hours * 60 + minutes;
};

interface WorktimeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: RangeValue<DateTime>) => void;
  timeSlot: GridSlot;
  scheduleId: string;
}

export const WorktimeModal = (props: WorktimeModalProps) => {
  const scheduleGetState = useGetScheduleByIdQuery({
    id: props.scheduleId,
  });

  const formMethods = useForm({
    defaultValues: { slot: undefined },
  });

  const { handleSubmit } = formMethods;

  const dialogTitleId = 'app-data-dialog-title';

  const [rangeValue, setRangeValue] = useState<RangeValue<DateTime>>();

  const updateHandler = (data: RangeValue<DateTime>) => {
    setRangeValue(data);
  };

  const submitHandler = () => {
    handleSubmit(() => props.onConfirm(rangeValue))();
  };

  return (
    // isSuccess &&
    // timeSchedule &&
    props.timeSlot && (
      <FormProvider {...formMethods}>
        <Dialog
          size="s"
          onClose={props.onClose}
          open={props.open}
          // onEnterKeyDown={() => {
          //   alert('onEnterKeyDown');
          // }}
          aria-labelledby={dialogTitleId}
        >
          <Dialog.Header caption="Выбор времени" id={dialogTitleId} />
          <Dialog.Body>
            {/* <WorkTimeSelector
              name="slot"
              onUpdate={updateHandler}
              timeSlot={props.timeSlot}
              scheduleId={props.scheduleId}
            /> */}

            <TimeRange
              minRangeSize={calcDurationMinutes(
                scheduleGetState.data.minDurationHours,
                scheduleGetState.data.minDurationMinutes
              )}
              maxRangeSize={calcDurationMinutes(
                scheduleGetState.data.maxDurationHours,
                scheduleGetState.data.maxDurationMinutes
              )}
              step={15}
              startTimeScale={props.timeSlot.timeStart}
              endTimeScale={props.timeSlot.timeEnd}
              onUpdate={updateHandler}
              name="slot"
            />
          </Dialog.Body>
          <Dialog.Footer
            onClickButtonCancel={props.onClose}
            textButtonCancel="Закрыть"
            onClickButtonApply={submitHandler}
            textButtonApply="Продолжить"
          />
        </Dialog>
      </FormProvider>
    )
  );
};
