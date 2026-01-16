import { Control, Path } from 'react-hook-form';

export type LocalFormUi<T, GravityUiFormControlType> = Omit<
  GravityUiFormControlType,
  'name'
> & {
  /** Поле формы */
  name: Path<T>;

  /** Желательно задавать для типизации параметра name.
   * Если параметр задан, то FormProvider можно не использовать
   */
  control?: Control<T, object>;
};
