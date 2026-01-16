import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Button, Dialog, Flex, Sheet } from '@gravity-ui/uikit';
import { isDesktop } from '@/store/slices/viewportSlice';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const isDesktopMode = useSelector(isDesktop);

  return isDesktopMode ? (
    <Dialog size="s" onClose={props.onClose} open={props.open}>
      <Dialog.Header caption="Подтверждение" />
      <Dialog.Body>{props.children}</Dialog.Body>
      <Dialog.Footer
        onClickButtonCancel={props.onClose}
        onClickButtonApply={props.onConfirm}
        textButtonApply="Продолжить"
        textButtonCancel="Отмена"
      />
    </Dialog>
  ) : (
    <Sheet visible={props.open} onClose={props.onClose} title="Подтверждение">
      <div className="g-s__px_4">{props.children}</div>
      <div className="g-s__p_4">
        <Flex gap={4} direction="column">
          <Button onClick={props.onConfirm} view="action" width="max" size="l">
            Продолжить
          </Button>
          <Button onClick={props.onClose} width="max" size="l">
            Отмена
          </Button>
        </Flex>
      </div>
    </Sheet>
  );
};
