import { Controller, useFormContext } from 'react-hook-form';
import { Select, SelectProps } from '@gravity-ui/uikit';
import { LocalFormUi } from './types';

type FormSelectProps<T> = LocalFormUi<T, SelectProps>;

export const FormSelect = <T,>(props: FormSelectProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={props.control || control}
      name={props.name}
      render={({ field, fieldState }) => {
        return (
          <Select
            {...props}
            {...field}
            value={field.value as string[]}
            id={props.name}
            errorMessage={fieldState?.error?.message}
            validationState={fieldState?.error ? 'invalid' : undefined}
            onUpdate={(value: string[]) => {
              field.onChange(value);
              props.onUpdate?.(value);
            }}
          />
        );
      }}
    />
  );
};
