import { FieldArrayWithId } from 'react-hook-form';
import { FormRow } from '@gravity-ui/components';
import { Plus, Xmark } from '@gravity-ui/icons';
import { Button, Flex, Icon } from '@gravity-ui/uikit';
import { FormTimeInput } from '@/components/formUi/FormTimeInput';

interface TimeSlotsComponentProps<T> {
  label: string;
  timeSlots: FieldArrayWithId<T>[];
  onRemove: (idx: number) => void;
  onAdd: () => void;
}

export const TimeSlotsComponent = <T,>(props: TimeSlotsComponentProps<T>) => {
  return (
    <FormRow direction="row" label={props.label}>
      {props.timeSlots.map((el, idx) => (
        <Flex
          direction="row"
          key={`${el.id}_${idx}`}
          gap={2}
          style={{ marginBottom: 8 }}
        >
          <FormTimeInput
            name={`timeSlots.${idx}.timeStart`}
            placeholder="Начало"
          />
          <FormTimeInput
            name={`timeSlots.${idx}.timeEnd`}
            placeholder="Конец"
          />
          <Button onClick={() => props.onRemove(idx)}>
            <Icon data={Xmark} size={18} />
          </Button>
        </Flex>
      ))}
      <Button onClick={props.onAdd}>
        <Icon data={Plus} size={18} /> Добавить
      </Button>
    </FormRow>
  );
};
