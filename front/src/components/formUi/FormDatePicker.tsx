import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, DatePickerProps } from '@gravity-ui/date-components';
import type { DateTime } from '@gravity-ui/date-utils';
import { DATE_VIEW_FORMAT } from '@/tools/constants';
import { getFilteredFieldProps } from './tools';
import { LocalFormUi } from './types';

type FormDatePickerProps<T> = LocalFormUi<T, DatePickerProps>;

export const FormDatePicker = <T,>(props: FormDatePickerProps<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      control={props.control || control}
      name={props.name}
      render={({ field, fieldState }) => {
        const filteredFieldProps = getFilteredFieldProps(field);
        return (
          <DatePicker
            format={DATE_VIEW_FORMAT}
            placeholder="введите дату"
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
            size="xl"
          />
        );
      }}
    />
  );
};
