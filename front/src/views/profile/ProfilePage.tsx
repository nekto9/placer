import { useEffect, useState } from 'react';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { useNotification } from '@/components/Notify';
import { useAuthContext } from '@/context/useAuthContext';
import { Loading } from '@/layouts/components/Loading';
import {
  useDeepLinkMutation,
  useRemoveTgLinkMutation,
  useUpdateUserMutation,
  useUploadAvatarMutation,
} from '@/store/api';
import { botDeepLink } from '@/tools/bot';
import { useSetPageData } from '@/tools/hooks';
import { ProfileDetails } from './components/ProfileDetails';
import { ProfileEditForm } from './components/ProfileEditForm';
import { convertToUpdateDto, convertToViewModel } from './mappers';
import { UserProfileViewModel } from './types';

export const ProfilePage = () => {
  const { user, logout, setUserData, isAuthenticated, isProfileComplete } =
    useAuthContext();
  const [isEditMode, setIsEditMode] = useState(!isProfileComplete);

  const { showSuccess, showError } = useNotification();

  const [userUpdateAction, userUpdateState] = useUpdateUserMutation();
  const [uploadAvatarAction, uploadAvatarState] = useUploadAvatarMutation();
  const [deepLinkAction, deepLinkState] = useDeepLinkMutation();
  const [removeTgLinkAction, removeTgLinkState] = useRemoveTgLinkMutation();

  const [renderKey, setRenderKey] = useState(0);

  const saveFormHandler = async (data: UserProfileViewModel) => {
    try {
      const updatedUser = await userUpdateAction({
        id: user.id,
        userUpdateDto: convertToUpdateDto(data),
      }).unwrap();
      if (updatedUser) {
        setUserData(updatedUser);
        showSuccess({ message: 'Профиль обновлен' });
      }

      // файл для загрузки
      if (data.avatar?.status === 'added') {
        await uploadAvatarAction({
          body: {
            avatar: data.avatar.file,
            fileId: data.avatar.id,
          },
        });

        setRenderKey((p) => p + 1);
      }
    } catch (err) {
      showError({ message: 'Ошибка сохранения профиля' });
      console.error(err);
    }
  };

  const editButtonHandler = () => setIsEditMode(true);
  const cancelButtonHandler = () => setIsEditMode(false);

  useEffect(() => {
    if (userUpdateState.isSuccess) {
      setIsEditMode(false);
    }
  }, [userUpdateState.isSuccess]);

  const [deepLinkValue, setDeepLinkValue] = useState('');

  /** Окно подтверждения ПРИвязки */
  const tgLinkHandler = async () => {
    const deepLink = await deepLinkAction();
    setDeepLinkValue(deepLink.data.deepLink);
  };

  /** Кнопка подтверждения ПРИвязки */
  const confirmLinkHandler = () => {
    botDeepLink(deepLinkValue);
    setDeepLinkValue('');
  };

  /** Кнопка отмены ПРИвязки */
  const cancelLinkHandler = () => {
    setDeepLinkValue('');
  };

  const [unlinkConfirmOpen, setUnlinkConfirmOpen] = useState(false);

  /** Окно подтверждения ОТвязки */
  const tgUnlinkHandler = () => {
    setUnlinkConfirmOpen(true);
  };

  /** Кнопка подтверждения отвязки */
  const confirmUnlinkHandler = async () => {
    setUnlinkConfirmOpen(false);
    await removeTgLinkAction();
    setUserData({ ...user, telegramId: undefined });
  };

  /** Кнопка отмены отвязки */
  const cancelUnlinkHandler = () => {
    setUnlinkConfirmOpen(false);
  };

  const isLoading =
    uploadAvatarState.isLoading ||
    userUpdateState.isLoading ||
    deepLinkState.isLoading ||
    removeTgLinkState.isLoading;

  useSetPageData({ title: 'Профиль' });

  return isAuthenticated ? (
    isEditMode ? (
      <>
        <Loading isActive={isLoading} loadingKey="updateUser" />
        {!isProfileComplete ? <div>Заполните профиль</div> : null}
        <ProfileEditForm
          onSave={saveFormHandler}
          onCancel={cancelButtonHandler}
          data={convertToViewModel(user)}
        />
      </>
    ) : (
      <>
        <ProfileDetails
          data={convertToViewModel(user)}
          logout={logout}
          onEdit={editButtonHandler}
          onLink={tgLinkHandler}
          onUnlink={tgUnlinkHandler}
          key={renderKey}
        />
        <ConfirmModal
          open={unlinkConfirmOpen}
          onConfirm={confirmUnlinkHandler}
          onClose={cancelUnlinkHandler}
        >
          После отвязки аккаунта в Telegram перестанут приходить уведомления от
          приложения
        </ConfirmModal>

        <ConfirmModal
          open={!!deepLinkValue}
          onConfirm={confirmLinkHandler}
          onClose={cancelLinkHandler}
        >
          Для привязки аккаунта на следующем шаге нужно будет согласиться
          открыть приложение Telegram
        </ConfirmModal>
      </>
    )
  ) : null;
};
