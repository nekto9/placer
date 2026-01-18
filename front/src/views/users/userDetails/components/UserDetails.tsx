import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Star, StarFill } from '@gravity-ui/icons';
import { Button, Flex, Icon } from '@gravity-ui/uikit';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { PageBlock } from '@/components/ui/PageBlock';
import UserCard from '@/components/ui/UserCard';
import { useAuthContext } from '@/context/useAuthContext';
import { RoutesList } from '@/router/routesList';
import {
  useAddUserToFavoritesMutation,
  useRemoveUserFromFavoritesMutation,
} from '@/store/api';
import { UserViewModel } from '../../common/types';

interface UserDetailsProps {
  data: UserViewModel;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export const UserDetails = (props: UserDetailsProps) => {
  const { user } = useAuthContext();
  const [addUserToFavoritesAction, addUserToFavoritesState] =
    useAddUserToFavoritesMutation();

  const [removeUserFromFavoritesAction, removeUserFromFavoritesState] =
    useRemoveUserFromFavoritesMutation();

  const handleToggleFavorite = async () => {
    try {
      if (props.data.meta?.isFavorite) {
        await removeUserFromFavoritesAction({
          favoriteId: props.data.id,
        }).unwrap();
      } else {
        await addUserToFavoritesAction({ favoriteId: props.data.id }).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const isLoadingFavoriteAction =
    addUserToFavoritesState.isLoading || removeUserFromFavoritesState.isLoading;

  const [favoriteIconKey, setFavoriteIconKey] = useState(0);

  useEffect(() => {
    setFavoriteIconKey(
      (addUserToFavoritesState.fulfilledTimeStamp || 0) +
        (removeUserFromFavoritesState.fulfilledTimeStamp || 0)
    );
  }, [
    addUserToFavoritesState.fulfilledTimeStamp,
    removeUserFromFavoritesState.fulfilledTimeStamp,
  ]);

  // Окно подтверждения удаления юзера
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const deleteUserHandler = () => {
    setDeleteUserOpen(true);
  };

  const confirmDeleteHandler = () => {
    setDeleteUserOpen(false);
    props.onDeleteClick();
  };

  const cancelDeleteHandler = () => {
    setDeleteUserOpen(false);
  };

  return (
    <>
      <UserCard user={props.data} />

      {user.id !== props.data.id ? (
        <PageBlock isCard>
          <Flex gap={4}>
            <Button
              view="outlined"
              loading={isLoadingFavoriteAction}
              onClick={handleToggleFavorite}
            >
              <Icon
                key={favoriteIconKey}
                data={props.data.meta?.isFavorite ? StarFill : Star}
                size={18}
              />
              {props.data.meta?.isFavorite
                ? 'Удалить из избранного'
                : 'Добавить в избранное'}
            </Button>

            {!!props.onEditClick && (
              <>
                <Button view="action" onClick={props.onEditClick}>
                  Редактировать
                </Button>

                <Button view="flat-danger" onClick={deleteUserHandler}>
                  Удалить
                </Button>
              </>
            )}
          </Flex>
        </PageBlock>
      ) : (
        <PageBlock isCard>
          <Button
            view="action"
            onClick={() => navigate(RoutesList.Profile.getUserProfile())}
          >
            Профиль
          </Button>
        </PageBlock>
      )}

      <ConfirmModal
        open={deleteUserOpen}
        onConfirm={confirmDeleteHandler}
        onClose={cancelDeleteHandler}
      >
        Удалить пользователя
      </ConfirmModal>
    </>
  );
};
