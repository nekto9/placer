import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, TextInput } from '@gravity-ui/uikit';
import { Loading } from '@/layouts/components';
import { RoutesList } from '@/router/routesList';
import { useGetSportsQuery } from '@/store/api';
import { debounce } from '@/tools/debounce';
import { useSetPageData } from '@/tools/hooks';

export const SportListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = debounce(setSearchQuery, 500);

  const navigate = useNavigate();

  /** Поле поиска */
  const searchChangeHandler = (value: string) => {
    // value.length > 2 &&
    debouncedSearch(value);
  };

  const sportListGetState = useGetSportsQuery({ text: searchQuery });

  useSetPageData({ title: 'Вида спорта' });
  return (
    <>
      <Loading
        isActive={!sportListGetState.isSuccess}
        loadingKey="sportsList"
      />
      <Button
        view="action"
        onClick={() => {
          navigate(RoutesList.Manage.getSportAdd());
        }}
      >
        Добавить
      </Button>

      <TextInput
        onUpdate={searchChangeHandler}
        placeholder={'Поиск'}
        style={{ marginBottom: 20 }}
        size="xl"
      />
      {sportListGetState.data?.items.map((sport) => (
        <div
          onClick={() => navigate(RoutesList.Manage.getSportEdit(sport.id))}
          key={sport.id}
        >
          {sport.name}
        </div>
      ))}
    </>
  );
};
