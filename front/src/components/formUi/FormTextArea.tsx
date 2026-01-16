import { Controller, useFormContext } from 'react-hook-form';
import { TextArea, TextAreaProps } from '@gravity-ui/uikit';
import { LocalFormUi } from './types';

type FormTextAreaProps<T> = LocalFormUi<T, TextAreaProps>;

export const FormTextArea = <T,>(props: FormTextAreaProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={props.control || control}
      name={props.name}
      render={({ field, fieldState }) => {
        return (
          <TextArea
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
