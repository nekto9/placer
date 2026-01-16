import { FormEvent, useState } from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { FormRow } from '@gravity-ui/components';
import { Button, Checkbox, Flex, Select } from '@gravity-ui/uikit';
// import { CoverUpload } from '@/components/CoverUpload';
import { FileUpload } from '@/components/FileUpload';
import { FileItem } from '@/components/FileUpload/types';
import {
  FormRadioButton,
  FormSelect,
  FormTextArea,
  FormTextInput,
} from '@/components/formUi';
import { EditMap } from '@/components/ui/Map';
import { MapPoint } from '@/components/ui/Map/types';
import { CityResponseDto, SportResponseDto } from '@/store/api';
import { EditFormMode } from '@/types';
import { PlaceViewModel } from '../../common/types';

interface PlaceEditFormModel {
  data: PlaceViewModel;
  /** Доступные виды спорта */
  sportsDict: SportResponseDto[];
  /** Доступные города */
  citiesDict: CityResponseDto[];
  onSave: (data: PlaceViewModel) => void;
  mode?: EditFormMode;
}

export const PlaceEditForm = (props: PlaceEditFormModel) => {
  const formMethods = useForm({
    defaultValues: props.data,
  });

  const { handleSubmit, formState, reset, control } = formMethods;

  const [rndKey, setRndKey] = useState(0);

  const {
    fields: placeSports,
    append: appendPlaceSport,
    remove: removePlaceSport,
  } = useFieldArray({ control, name: 'sports', keyName: '_itemId' });

  const { fields: placeCovers, replace: replaceCovers } = useFieldArray({
    control,
    name: 'coverFiles',
    keyName: '_itemId',
  });

  const submitHandler = (event: FormEvent) => {
    handleSubmit(props.onSave)(event);
  };

  const resetFormHandler = () => {
    reset();
    // из-за чекбоксов с видами спорта и точки на карте
    setRndKey(Date.now());
  };

  const sportChangeHandler = (checked: boolean, sport: SportResponseDto) => {
    if (checked) {
      appendPlaceSport(sport);
    } else {
      const removeIdx = placeSports.findIndex((item) => item.id === sport.id);
      removePlaceSport(removeIdx);
    }
  };

  const geoChangeHandler = (point: MapPoint) => {
    formMethods.setValue('latitude', point.latitude, { shouldDirty: true });
    formMethods.setValue('longitude', point.longitude, { shouldDirty: true });
  };

  const coversChangeHandler = (files: FileItem[]) => {
    replaceCovers(files);
  };

  const updateCityHandler = (value: string[]) => {
    const cityId = value[0];
    const cityName = cityId
      ? props.citiesDict.find((el) => el.id === cityId).name
      : '';
    formMethods.setValue('cityName', cityName);
  };

  const cityName = useWatch({ name: 'cityName', control });

  return (
    <FormProvider {...formMethods}>
      <Flex direction="column" gap={4}>
        <Flex direction="column">
          <FormRow
            direction="row"
            fieldId="name"
            label="Название"
            className="mod"
          >
            <FormTextInput
              control={control}
              name="name"
              placeholder="введите название"
              autoComplete="off"
            />
          </FormRow>
          <FormRow direction="row" fieldId="description" label="Описание">
            <FormTextArea
              control={control}
              name="description"
              placeholder="введите описание"
              autoComplete="off"
            />
          </FormRow>
          <FormRow direction="row" label="Тип">
            <FormRadioButton
              control={control}
              name="isIndoor"
              options={[
                { value: 'true', content: 'Крытая' },
                { value: 'false', content: 'Открытая' },
              ]}
            />
          </FormRow>
          <FormRow direction="row" label="Бесплатная">
            <FormRadioButton
              control={control}
              name="isFree"
              options={[
                { value: 'true', content: 'Да' },
                { value: 'false', content: 'Нет' },
              ]}
            />
          </FormRow>

          {/* 
          Весь список чекбоксов не входит в модель (там только выбранные), 
          поэтому их надо вручную рендерить, обновлять и обрабатывать reset 
          */}
          <FormRow direction="row" label="Виды спорта" key={rndKey}>
            {props.sportsDict.map((sport) => (
              <Checkbox
                defaultChecked={placeSports.some((el) => el.id === sport.id)}
                key={sport.id}
                style={{ marginRight: 8 }}
                onUpdate={(checked) => sportChangeHandler(checked, sport)}
                size="xl"
              >
                {sport.name}
              </Checkbox>
            ))}
          </FormRow>

          <FormRow direction="row" fieldId="cityId" label="Город">
            <FormSelect
              name="cityId"
              placeholder="Город"
              control={control}
              onUpdate={updateCityHandler}
            >
              {props.citiesDict?.map((el) => (
                <Select.Option key={el.id} value={el.id}>
                  {el.name}
                </Select.Option>
              ))}
            </FormSelect>
          </FormRow>
        </Flex>

        {cityName ? (
          <EditMap
            key={rndKey}
            onChange={geoChangeHandler}
            point={
              props.mode === 'update'
                ? {
                    latitude: formMethods.getValues('latitude'),
                    longitude: formMethods.getValues('longitude'),
                  }
                : undefined
            }
            city={cityName}
          />
        ) : null}

        <FileUpload
          multiple
          accept="image/*"
          initialFiles={placeCovers.map((f) => ({
            id: f.id,
            status: 'uploaded',
            url: f.url,
            type: 'image',
          }))}
          onChange={coversChangeHandler}
          maxFiles={10}
        />

        <Flex gap={4}>
          <form onSubmit={submitHandler}>
            <Button view="action" type="submit" disabled={!formState.isDirty}>
              Сохранить
            </Button>
          </form>
          <Button
            view="normal"
            disabled={!formState.isDirty}
            onClick={resetFormHandler}
          >
            Сбросить
          </Button>
        </Flex>
      </Flex>
    </FormProvider>
  );
};
