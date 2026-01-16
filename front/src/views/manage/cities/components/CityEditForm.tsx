import { FormEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Flex } from '@gravity-ui/uikit';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormTextInput } from '@/components/formUi';
import { CityViewModel } from '../types';
import { validationSchema } from './formRules';

interface CityEditFormProps {
  isCreate?: boolean;
  onSave: (data: CityViewModel) => void;
  onCancel: () => void;
  data: CityViewModel;
}
export const CityEditForm = (props: CityEditFormProps) => {
  const formMethods = useForm({
    defaultValues: props.data,
    resolver: yupResolver(validationSchema),
  });

  const { control, handleSubmit, formState, reset } = formMethods;

  const submitHandler = (event: FormEvent) => {
    handleSubmit(props.onSave)(event);
  };

  const resetFormHandler = () => {
    reset();
    props.onCancel();
  };

  return (
    <FormProvider {...formMethods}>
      <FormTextInput
        control={control}
        name="name"
        placeholder="Название"
        autoComplete="off"
      />
      <Flex gap={4}>
        <form onSubmit={submitHandler}>
          <Button view="action" type="submit" disabled={!formState.isDirty}>
            Сохранить
          </Button>
        </form>
        <Button
          view="normal"
          disabled={!formState.isDirty}
          onClick={resetFormHandler}
        >
          Сбросить
        </Button>
      </Flex>
    </FormProvider>
  );
};
