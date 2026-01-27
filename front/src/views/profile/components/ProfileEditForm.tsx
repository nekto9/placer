import { FormEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Flex } from '@gravity-ui/uikit';
import { yupResolver } from '@hookform/resolvers/yup';
import { FileUpload } from '@/components/FileUpload';
import { FileItem } from '@/components/FileUpload/types';
import { FormTextInput } from '@/components/formUi';
import { UserProfileViewModel } from '../types';
import { validationSchema } from './formRules';

interface ProfileEditFormProps {
  onSave: (data: UserProfileViewModel) => void;
  onCancel: () => void;
  data: UserProfileViewModel;
}

const AVATAR_SIZE = 150;

export const ProfileEditForm = (props: ProfileEditFormProps) => {
  const formMethods = useForm({
    defaultValues: props.data,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, formState, reset } = formMethods;

  const submitHandler = (event: FormEvent) => {
    handleSubmit(props.onSave)(event);
  };

  const resetFormHandler = () => {
    reset();
    props.onCancel();
  };

  const avatarChangeHandler = (filesForUpload: FileItem[]) => {
    const avatarFile = filesForUpload.find((el) => el.status !== 'deleted');
    formMethods.setValue('avatar', avatarFile, {
      shouldDirty: true,
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Flex direction="column" gap={4}>
        <FileUpload
          imageHeight={AVATAR_SIZE}
          imageWidth={AVATAR_SIZE}
          maxFiles={1}
          initialFiles={
            props.data.avatar
              ? [
                  {
                    id: props.data.avatar.id,
                    status: 'uploaded',
                    url: props.data.avatar.url,
                    type: 'image',
                  },
                ]
              : []
          }
          onChange={avatarChangeHandler}
        />

        <FormTextInput
          name="username"
          placeholder="Имя пользователя"
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
      </Flex>
    </FormProvider>
  );
};
