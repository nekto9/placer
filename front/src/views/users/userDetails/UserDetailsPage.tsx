import { useNavigate, useParams } from 'react-router';
import { Loading } from '@/layouts/components/Loading';
import { RoutesList } from '@/router/routesList';
import { useGetUserByIdQuery } from '@/store/api';
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

  useSetPageData({ title: 'Пользователь' });

  return (
    <>
      <Loading isActive={userGetState.isFetching} loadingKey="userDetails" />

      {userGetState.isSuccess && (
        <UserDetails
          data={convertToViewModel(userGetState.data)}
          onEditClick={
            userGetState.data.meta.canEdit ? editClickHandler : undefined
          }
        />
      )}
    </>
  );
};
