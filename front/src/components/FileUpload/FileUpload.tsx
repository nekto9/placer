import { useEffect, useRef, useState } from 'react';
import { useNotification } from '@/components/Notify/useNotification';
import { useImageResize } from '@/workers/useImageResize';
import { FileUploadPreview } from './FileUploadPreview';
import { changeExtension } from './tools';
import { AddedFile, FileItem, UploadedFile } from './types';

interface FileUploadProps {
  /** Список уже загруженных файлов (например, с сервера) */
  initialFiles?: UploadedFile[];

  /** Разрешить выбор нескольких файлов */
  multiple?: boolean;
  /** Максимальное количество файлов */
  maxFiles?: number;

  imageWidth: number;
  imageHeight: number;

  onChange?: (files: FileItem[]) => void;
}

const addedFilesMapper = (file: File): AddedFile => {
  let previewUrl: string | undefined = undefined;
  if (file.type.startsWith('image/')) {
    previewUrl = URL.createObjectURL(file);
  }
  return {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    file,
    url: previewUrl,
    status: 'added',
    isResized: false,
  };
};

/** Используется только для картинок,
 * поэтому их обработка и ресайз сразу включены */
export const FileUpload = (props: FileUploadProps) => {
  const { showError } = useNotification();
  const maxFiles = props.maxFiles || 10;
  const accept = 'image/*';

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Список файлов
  const [files, setFiles] = useState<FileItem[]>(() => {
    return (
      props.initialFiles?.map((f) => ({
        ...f,
        status: 'uploaded',
      })) || []
    );
  });

  // Активные файлы
  const activeFiles = files.filter((el) => el.status !== 'deleted');

  // Передача изменений наружу
  useEffect(() => {
    props.onChange?.(files);

    return () => {
      // Очистка objectURL при изменении/уходе
      files.forEach((f) => {
        if (f.url.startsWith('blob:')) {
          URL.revokeObjectURL(f.url);
        }
      });
    };
  }, [files]);

  const { processImage } = useImageResize();

  useEffect(() => {
    // подмена файлов после ресайза
    const runWorker = async (file: File) => {
      if (files.length === 0) return;
      const resizedFile = await processImage({
        sourceFile: file,
        outputWidth: props.imageWidth,
        outputHeight: props.imageHeight,
      });
      return resizedFile;
    };

    // второй раз запуститься не должно, т.к. после воркера меняем isResized
    const unresizedFiles = files.filter(
      (f) => !!('file' in f && !!f.file) && !f.isResized
    ) as AddedFile[];

    // через воркер прогоняем о одному файлу
    if (unresizedFiles.length) {
      const processingFile = unresizedFiles[0];

      runWorker(processingFile.file)
        .then((workerMessage) => {
          // Собираем файл после воркера
          const blob = new Blob([workerMessage.buffer], {
            type: workerMessage.mimeType,
          });
          // т.к. воркер нам принудительно делает jpg, меняем расширение для аплоада
          const fileName = changeExtension(processingFile.name, 'jpg');

          const resultFile = new File([blob], fileName, {
            type: workerMessage.mimeType,
            lastModified: Date.now(),
          });

          setFiles((prev) =>
            prev.map((stateFile) => {
              if (
                processingFile.id === stateFile.id &&
                !processingFile.isResized
              ) {
                return {
                  ...stateFile,
                  file: resultFile,
                  url: URL.createObjectURL(resultFile),
                  isResized: true,
                };
              } else {
                return stateFile;
              }
            })
          );
        })
        .catch(console.error);
    }
  }, [files]);

  // Окно выбора файлов
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Обработка выбора файлов
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = Array.from(event.target.files || []);
    if (activeFiles.length >= maxFiles) {
      showError({ message: `Максимум ${maxFiles} файлов` });
      return;
    }

    // Сначала забиваем файлами из инпута
    if (maxFiles === 1 || !props.multiple) {
      setFiles([addedFilesMapper(fileList[0])]);
    } else {
      const newFiles = fileList
        .slice(0, maxFiles - files.length)
        .map(addedFilesMapper);

      setFiles((prev) => [...prev, ...newFiles]);
    }

    if (event.target) event.target.value = '';
  };

  // Обработка удаления файлов
  const removeFile = (id: string) => {
    // Свежедобавленные файлы удаляем сразу,
    // загруженные ранее - метим статусом
    setFiles((prev) =>
      prev
        .map((f) =>
          f.id === id
            ? f.status === 'added'
              ? null
              : {
                  ...f,
                  status: f.status === 'deleted' ? 'uploaded' : 'deleted',
                }
            : f
        )
        .filter((f): f is FileItem => f !== null)
    );
  };

  const restoreFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'uploaded' } : f))
    );
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple={props.multiple}
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <FileUploadPreview
        files={files}
        onRemove={removeFile}
        onRestore={restoreFile}
        onAdd={
          (activeFiles.length < maxFiles && props.multiple) ||
          (!props.multiple && !activeFiles.length)
            ? handleFileSelect
            : undefined
        }
      />
    </div>
  );
};
