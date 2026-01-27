/** Типы статусов файла */
export type FileStatus = 'uploaded' | 'added' | 'deleted';

/** Базовый интерфейс файла */
export interface BaseFile {
  id: string;
  /** Имя файла */
  name?: string;
  /** Размер в байтах */
  size?: number;
  /** Тип */
  type?: string;
  /** Статус */
  status: FileStatus;

  /** Статус преобразования через воркер */
  isResized?: boolean;

  url?: string; // опциональна (например, для PDF может не быть preview)
}

/** Загруженный файл (из initialFiles) */
export interface UploadedFile extends BaseFile {
  status: 'uploaded';
}

/** Добавленный, но не загруженный файл */
export interface AddedFile extends BaseFile {
  status: 'added';
  file: File;
}

/** Файл, помеченный на удаление */
export interface DeletedFile extends BaseFile {
  status: 'deleted';
}

/** Объединённый тип */
export type FileItem = UploadedFile | AddedFile | DeletedFile;
