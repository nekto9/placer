/** Расширение файла из имени */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || 'bin';
};
