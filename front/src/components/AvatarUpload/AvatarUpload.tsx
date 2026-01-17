import { useRef } from 'react';
import { Button, Flex } from '@gravity-ui/uikit';
import { useNotification } from '@/components/Notify';
import { useUploadAvatarMutation } from '@/store/api';

interface AvatarUploadProps {
  onUploadSuccess?: (avatar: string) => void;
  disabled?: boolean;
}

export const AvatarUpload = (props: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useNotification();

  const [uploadAvatarAction, uploadAvatarState] = useUploadAvatarMutation();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      showError({ message: 'Пожалуйста, выберите изображение' });
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError({ message: 'Размер файла не должен превышать 5MB' });
      return;
    }

    try {
      const updatedUser = await uploadAvatarAction({
        body: { avatar: file },
      }).unwrap();
      showSuccess({ message: 'Аватар успешно загружен' });
      props.onUploadSuccess?.(updatedUser);
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      showError({ message: 'Ошибка загрузки аватара' });
    } finally {
      // Очищаем input для возможности повторного выбора того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Flex direction="column" gap={2}>
      <input
        data-testid="file-input"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        onClick={handleFileSelect}
        disabled={props.disabled || uploadAvatarState.isLoading}
        loading={uploadAvatarState.isLoading}
        size="l"
      >
        {uploadAvatarState.isLoading ? 'Загрузка...' : 'Загрузить аватар'}
      </Button>
    </Flex>
  );
};
