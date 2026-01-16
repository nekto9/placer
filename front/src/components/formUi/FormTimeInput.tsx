import { Controller, useFormContext } from 'react-hook-form';
import { DateField, DateFieldProps } from '@gravity-ui/date-components';
import { DateTime } from '@gravity-ui/date-utils';
import { getFilteredFieldProps } from './tools';
import { LocalFormUi } from './types';

type FormTimeInputProps<T> = LocalFormUi<T, DateFieldProps>;

export const FormTimeInput = <T,>(props: FormTimeInputProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={props.control || control}
      name={props.name}
      render={({ field, fieldState }) => {
        const filteredFieldProps = getFilteredFieldProps(field);
        return (
          <DateField
            {...props}
            {...filteredFieldProps}
            value={field.value as DateTime}
            id={props.name}
            errorMessage={fieldState?.error?.message}
            validationState={fieldState?.error ? 'invalid' : undefined}
            onUpdate={(value: DateTime) => {
              field.onChange(value);
              props.onUpdate?.(value);
            }}
            format="HH:mm"
          />
        );
      }}
    />
  );
};
