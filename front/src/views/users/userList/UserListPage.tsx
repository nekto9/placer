import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, TextInput } from '@gravity-ui/uikit';
import { RoutesList } from '@/router/routesList';
import { debounce } from '@/tools/debounce';
import { useSetPageData } from '@/tools/hooks';
import { AllUserList } from './components/AllUserList';
import { FavoritesUserList } from './components/FavoritesUserList';

interface UserListPageProps {
  isFavorites?: boolean;
}
export const UserListPage = (props: UserListPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = debounce(setSearchQuery, 500);

  /** Поле поиска */
  const searchChangeHandler = (value: string) => {
    // value.length > 2 &&
    debouncedSearch(value);
  };

  const navigate = useNavigate();

  /** Избранные пользователи */
  const favoritsClickHandler = () => {
    navigate(RoutesList.Users.getUsersFavorites());
  };

  /** Все пользователи */
  const allClickHandler = () => {
    navigate(RoutesList.Users.getUsersList());
  };

  const onDetailsClickHandler = (userId: string) => {
    navigate(RoutesList.Users.getUserDetails(userId));
  };

  useSetPageData({ title: 'Пользователи' });

  return (
    <>
      <div className="g-s__py_4">
        <Button
          view="normal"
          onClick={favoritsClickHandler}
          size="l"
          selected={props.isFavorites}
          pin="circle-clear"
        >
          Мои избранные
        </Button>
        <Button
          view="normal"
          onClick={allClickHandler}
          selected={!props.isFavorites}
          size="l"
          pin="clear-circle"
        >
          Все
        </Button>
      </div>
      <TextInput
        onUpdate={searchChangeHandler}
        placeholder={'Поиск'}
        style={{ marginBottom: 20 }}
        size="xl"
      />
      {props.isFavorites ? (
        <FavoritesUserList
          searchQuery={searchQuery}
          onDetailsClick={onDetailsClickHandler}
        />
      ) : (
        <AllUserList
          searchQuery={searchQuery}
          onDetailsClick={onDetailsClickHandler}
        />
      )}
    </>
  );
};
