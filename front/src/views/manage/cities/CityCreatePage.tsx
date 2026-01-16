import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { RoutesList } from '@/router/routesList';
import { useCreateCityMutation } from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { CityEditForm } from './components/CityEditForm';
import { convertToCreateDto } from './mappers/convertToCreateDto';
import { getEmptyCity } from './mappers/getEmptyCity';
import { CityViewModel } from './types';

export const CityCreatePage = () => {
  const [cityCreateAction, cityCreateState] = useCreateCityMutation();

  const saveFormHandler = (data: CityViewModel) => {
    try {
      cityCreateAction({
        createCityDto: convertToCreateDto(data),
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
    if (cityCreateState.isSuccess) {
      navigate(RoutesList.Manage.getCitiesList());
    }
  }, [cityCreateState.isSuccess]);

  useSetPageData({ title: 'Город' });

  return (
    <CityEditForm
      isCreate
      data={getEmptyCity()}
      onSave={saveFormHandler}
      onCancel={cancelFormHandler}
    />
  );
};
