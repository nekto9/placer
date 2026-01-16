import { Button, Dialog } from '@gravity-ui/uikit';
import {
  dateToStringView,
  timeConvertToFormattedString,
} from '@/tools/dateTools';
import { GridSlot } from '../types';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  slot: GridSlot;
  onDeleteBooking: () => void;
  onClickAdvanced: () => void;
}

export const InfoModal = (props: InfoModalProps) => {
  const dialogTitleId = 'app-data-dialog-title';

  return (
    <Dialog
      size="s"
      onClose={props.onClose}
      open={props.open}
      // onEnterKeyDown={() => {
      //   alert('onEnterKeyDown');
      // }}
      aria-labelledby={dialogTitleId}
    >
      <Dialog.Header caption="Данные слота" id={dialogTitleId} />
      <Dialog.Body>
        {props.slot ? (
          <>
            <div>
              {dateToStringView(props.slot.date)} -{' '}
              {timeConvertToFormattedString(props.slot.timeStart)} -
              {timeConvertToFormattedString(props.slot.timeEnd)}
            </div>
            <div>
              {props.slot.timeSlotId === props.slot.gameId &&
                'Заказ на слот, которого нет в расписании'}
            </div>
            <Button onClick={props.onDeleteBooking}>Удалить бронь</Button>
            <Button onClick={props.onClickAdvanced} style={{ marginLeft: 10 }}>
              Перейти к игре
            </Button>
          </>
        ) : (
          'Нет даных'
        )}
      </Dialog.Body>
      <Dialog.Footer
        onClickButtonCancel={props.onClose}
        textButtonCancel="Закрыть"
      />
    </Dialog>
  );
};
