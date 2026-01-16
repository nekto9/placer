import { Controller, useFormContext } from 'react-hook-form';
import {
  RangeDateSelection,
  RangeDateSelectionProps,
} from '@gravity-ui/date-components';
import { getFilteredFieldProps } from './tools';
import { LocalFormUi } from './types';

type FormRangeDateSelectionProps<T> = LocalFormUi<T, RangeDateSelectionProps>;

export const FormRangeDateSelection = <T,>(
  props: FormRangeDateSelectionProps<T>
) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={props.control || control}
      name={props.name}
      render={({ field }) => {
        const filteredFieldProps = getFilteredFieldProps(field);
        return (
          <RangeDateSelection
            {...props}
            {...filteredFieldProps}
            value={props.value}
            id={props.name}
          />
        );
      }}
    />
  );
};
