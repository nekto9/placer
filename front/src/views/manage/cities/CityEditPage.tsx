import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { RoutesList } from '@/router/routesList';
import { useGetCityByIdQuery, useUpdateCityMutation } from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { CityEditForm } from './components/CityEditForm';
import { convertToUpdateDto } from './mappers';
import { CityViewModel } from './types';

export const CityEditPage = () => {
  const { cityId } = useParams();
  const cityGetState = useGetCityByIdQuery({ id: cityId });

  const [cityUpdateAction, cityUpdateState] = useUpdateCityMutation();

  const saveFormHandler = (data: CityViewModel) => {
    try {
      cityUpdateAction({
        id: cityId,
        updateCityDto: convertToUpdateDto(data),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const cancelFormHandler = () => {
    navigate(RoutesList.Manage.getCitiesList());
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (cityUpdateState.isSuccess) {
      navigate(RoutesList.Manage.getCitiesList());
    }
  }, [cityUpdateState.isSuccess]);

  useSetPageData({ title: 'Город' });

  return (
    cityGetState.isSuccess && (
      <CityEditForm
        data={cityGetState.data}
        onSave={saveFormHandler}
        onCancel={cancelFormHandler}
      />
    )
  );
};
