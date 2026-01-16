import { UserList } from '@/components/ui/UserList';
import { Loading } from '@/layouts/components';
import { useGetUserFavoritesQuery } from '@/store/api';

interface FavoritesUserListProps {
  searchQuery?: string;
  onDetailsClick: (id: string) => void;
}
export const FavoritesUserList = (props: FavoritesUserListProps) => {
  const userFavoritesGetState = useGetUserFavoritesQuery({
    text: props.searchQuery,
  });
  return (
    <>
      <Loading
        isActive={!userFavoritesGetState.isSuccess}
        loadingKey="userFavorites"
      />
      {userFavoritesGetState.isSuccess && (
        <UserList
          onDetailsClick={props.onDetailsClick}
          data={userFavoritesGetState.data}
        />
      )}
    </>
  );
};
