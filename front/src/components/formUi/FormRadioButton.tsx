import { Controller, useFormContext } from 'react-hook-form';
import {
  SegmentedRadioGroup,
  SegmentedRadioGroupProps,
} from '@gravity-ui/uikit';
import { LocalFormUi } from './types';

type FormRadioButtonProps<T> = LocalFormUi<T, SegmentedRadioGroupProps>;

export const FormRadioButton = <T,>(props: FormRadioButtonProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={props.control || control}
      name={props.name}
      render={({ field }) => {
        return (
          <SegmentedRadioGroup
            {...props}
            {...field}
            value={String(field.value)}
            onUpdate={(value: string) => {
              field.onChange(value);
              props.onUpdate?.(value);
            }}
          />
        );
      }}
    />
  );
};
