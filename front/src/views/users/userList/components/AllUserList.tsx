import { UserList } from '@/components/ui/UserList';
import { Loading } from '@/layouts/components';
import { useGetUsersQuery } from '@/store/api';

interface AllUserListProps {
  searchQuery?: string;
  onDetailsClick: (id: string) => void;
}
export const AllUserList = (props: AllUserListProps) => {
  const userListGetState = useGetUsersQuery({ text: props.searchQuery });
  return (
    <>
      <Loading isActive={!userListGetState.isSuccess} loadingKey="userList" />
      {userListGetState.isSuccess && (
        <UserList
          onDetailsClick={props.onDetailsClick}
          data={userListGetState.data}
        />
      )}
    </>
  );
};
