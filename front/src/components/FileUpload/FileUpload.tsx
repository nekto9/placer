import { useEffect, useRef, useState } from 'react';
import { FileUploadPreview } from './FileUploadPreview';
import { AddedFile, FileItem, UploadedFile } from './types';

interface FileUploadProps {
  /** Список уже загруженных файлов (например, с сервера) */
  initialFiles?: UploadedFile[];
  /** MIME-типы для input[type="file"]. Например: 'image/*', '*' */
  accept?: string;
  /** Разрешить выбор нескольких файлов */
  multiple?: boolean;
  /** Максимальное количество файлов */
  maxFiles?: number;

  onChange?: (files: FileItem[]) => void;
}

export const FileUpload = (props: FileUploadProps) => {
  const maxFiles = props.maxFiles || 10;
  const accept = props.accept || '*';

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
      alert(`Максимум ${maxFiles} файлов`);
      return;
    }

    if (maxFiles === 1 || !props.multiple) {
      setFiles([
        {
          id: crypto.randomUUID(),
          name: fileList[0].name,
          size: fileList[0].size,
          type: fileList[0].type,
          file: fileList[0],
          url: URL.createObjectURL(fileList[0]),
          status: 'added',
        },
      ]);
    } else {
      const newFiles: AddedFile[] = fileList
        .slice(0, maxFiles - files.length)
        .map((file) => {
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
          };
        });

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
