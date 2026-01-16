import { ControllerRenderProps, Path } from 'react-hook-form';

/** Пропсы field без ref и value */
export const getFilteredFieldProps = <T>(
  field: ControllerRenderProps<T, Path<T>>
): Omit<ControllerRenderProps<T, Path<T>>, 'ref' | 'value'> => {
  const { ref: _ref, value: _value, ...rest } = field;
  return rest;
};
