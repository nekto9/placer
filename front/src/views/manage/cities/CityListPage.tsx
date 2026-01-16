import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, TextInput } from '@gravity-ui/uikit';
import { Loading } from '@/layouts/components';
import { RoutesList } from '@/router/routesList';
import { useGetCitiesQuery } from '@/store/api';
import { debounce } from '@/tools/debounce';
import { useSetPageData } from '@/tools/hooks';

export const CityListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = debounce(setSearchQuery, 500);

  const navigate = useNavigate();

  /** Поле поиска */
  const searchChangeHandler = (value: string) => {
    // value.length > 2 &&
    debouncedSearch(value);
  };

  const cityListGetState = useGetCitiesQuery({ text: searchQuery });

  useSetPageData({ title: 'Города' });

  return (
    <>
      <Loading isActive={!cityListGetState.isSuccess} loadingKey="citysList" />
      <Button
        view="action"
        onClick={() => {
          navigate(RoutesList.Manage.getCityAdd());
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
      {cityListGetState.data?.items.map((city) => (
        <div
          onClick={() => navigate(RoutesList.Manage.getCityEdit(city.id))}
          key={city.id}
        >
          {city.name}
        </div>
      ))}
    </>
  );
};
