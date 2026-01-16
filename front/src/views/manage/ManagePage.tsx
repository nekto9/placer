import { useNavigate } from 'react-router';
import { Button } from '@gravity-ui/uikit';
import { RoutesList } from '@/router/routesList';
import { useSetPageData } from '@/tools/hooks';

export const ManagePage = () => {
  const navigate = useNavigate();

  useSetPageData({ title: 'Управление' });

  return (
    <div>
      <Button
        size="l"
        onClick={() => {
          navigate(RoutesList.Manage.getSportsList());
        }}
      >
        Виды спорта
      </Button>

      <Button
        size="l"
        onClick={() => {
          navigate(RoutesList.Manage.getCitiesList());
        }}
      >
        Города
      </Button>

      <Button
        size="l"
        onClick={() => {
          navigate(RoutesList.Place.getPlaceAdd());
        }}
      >
        Добавить площадку
      </Button>
    </div>
  );
};
