import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loading } from '@/layouts/components/Loading';
import { RoutesList } from '@/router/routesList';
import { useDeleteUserMutation, useGetUserByIdQuery } from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { convertToViewModel } from '../common/mappers';
import { UserDetails } from './components/UserDetails';

export const UserDetailsPage = () => {
  const { userId } = useParams();
  const userGetState = useGetUserByIdQuery({
    id: userId,
  });

  const navigate = useNavigate();

  const editClickHandler = () => {
    navigate(RoutesList.Users.getUserEdit(userGetState.data.id));
  };

  const [userDeleteAction, userDeleteState] = useDeleteUserMutation();

  const deleteClickHandler = () => {
    userDeleteAction({ id: userId });
  };

  useEffect(() => {
    if (userDeleteState.isSuccess) {
      navigate(RoutesList.Users.getUsersList());
    }
  }, [userDeleteState.isSuccess]);

  useSetPageData({ title: 'Пользователь' });

  const isLoading = userGetState.isLoading || userDeleteState.isLoading;

  return (
    <>
      <Loading isActive={isLoading} loadingKey="userDetails" />

      {userGetState.isSuccess && (
        <UserDetails
          data={convertToViewModel(userGetState.data)}
          onEditClick={
            userGetState.data.meta.canEdit ? editClickHandler : undefined
          }
          onDeleteClick={
            userGetState.data.meta.canEdit ? deleteClickHandler : undefined
          }
        />
      )}
    </>
  );
};
