/** Приведение строк, чисел и т.п. к boolean */
export const parseBool = (value: unknown): boolean => {
  if (typeof value === 'string') {
    // Приводим строку к нижнему регистру и проверяем на пустоту и 'false'
    return value.trim().toLowerCase() !== 'false' && value.trim() !== '';
  }
  // Для всех остальных типов используем стандартное приведение
  return !!value;
};

/** Отформатированная строка => число */
export const numberNormalize = (
  value: string | number | null | undefined
): number => {
  // Приводим значение к строке, заменяем запятые на точки и удаляем всё, кроме цифр, точек и минусов
  const preparedValue = String(value || '0')
    .replace(/,/g, '.')
    .replace(/[^\d.-]/g, '');

  // Парсим результат в число
  return parseFloat(preparedValue);
};

export const parseEmptyStringToUndefined = (
  value?: string | number | null
): string | undefined => {
  if (!value && value !== 0 && value !== '0') return undefined;
  return String(value);
};

export const parseEmptyNumberToUndefined = (
  value?: string | number | null
): number | undefined => {
  if (!value && value !== 0 && value !== '0') return undefined;
  return numberNormalize(value);
};

export const parseEmptyString = (value?: string | number | null): string => {
  if (!value && value !== 0 && value !== '0') return '';
  return String(value);
};
