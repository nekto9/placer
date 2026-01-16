import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loading } from '@/layouts/components/Loading';
import { RoutesList } from '@/router/routesList';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/store/api';
import { convertToUpdateDto, convertToViewModel } from '../common/mappers';
import { UserViewModel } from '../common/types';
import { UserEditForm } from './components/UserEditForm';

export const UserEditPage = () => {
  const { userId } = useParams();
  const userGetState = useGetUserByIdQuery({ id: userId });

  const [userUpdateAction, userUpdateState] = useUpdateUserMutation();

  const saveFormHandler = (data: UserViewModel) => {
    try {
      userUpdateAction({
        id: userId,
        userUpdateDto: convertToUpdateDto(data),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const cancelFormHandler = () => {
    navigate(RoutesList.Users.getUsersList());
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (userUpdateState.isSuccess) {
      navigate(RoutesList.Users.getUsersList());
    }
  }, [userUpdateState.isSuccess]);

  const isLoading =
    !(userGetState.isSuccess || userGetState.isUninitialized) ||
    !(userUpdateState.isSuccess || userUpdateState.isUninitialized);

  return (
    <>
      <Loading isActive={isLoading} loadingKey="userEdit" />

      {userGetState.isSuccess && (
        <UserEditForm
          data={convertToViewModel(userGetState.data)}
          onSave={saveFormHandler}
          onCancel={cancelFormHandler}
        />
      )}
    </>
  );
};
