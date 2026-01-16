import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox, CheckboxProps } from '@gravity-ui/uikit';
import { LocalFormUi } from './types';

type FormCheckboxProps<T> = LocalFormUi<T, CheckboxProps>;

export const FormCheckbox = <T,>(props: FormCheckboxProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={props.control || control}
      name={props.name}
      render={({ field }) => {
        return (
          <Checkbox
            {...props}
            {...field}
            value={field.value as string}
            id={props.name}
            checked={field.value === true}
            onUpdate={(checked: boolean) => {
              field.onChange(checked);
              props.onUpdate?.(checked);
            }}
          />
        );
      }}
    />
  );
};
