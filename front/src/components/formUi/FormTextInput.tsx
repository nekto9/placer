import { Controller, useFormContext } from 'react-hook-form';
import { TextInput, TextInputProps } from '@gravity-ui/uikit';
import { LocalFormUi } from './types';

type FormTextInputProps<T> = LocalFormUi<T, TextInputProps>;

export const FormTextInput = <T,>(props: FormTextInputProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={props.control || control}
      name={props.name}
      render={({ field, fieldState }) => {
        return (
          <TextInput
            {...props}
            {...field}
            value={field.value as string}
            id={props.name}
            errorMessage={fieldState?.error?.message}
            validationState={fieldState?.error ? 'invalid' : undefined}
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
