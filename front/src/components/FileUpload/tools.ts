/** Размер файла */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2).replace(/\./, ',')} ${
    sizes[i]
  }`;
};

/** Смена расширения файла */
export const changeExtension = (filename: string, newExt: string) => {
  // Убираем точку из нового расширения, если она есть
  newExt = newExt.replace(/^\./, '');

  // Находим последнюю точку в имени файла
  const lastDotIndex = filename.lastIndexOf('.');

  // Если точка не найдена или находится в начале имени
  if (lastDotIndex <= 0) {
    return `${filename}.${newExt}`;
  }

  return `${filename.substring(0, lastDotIndex)}.${newExt}`;
};
