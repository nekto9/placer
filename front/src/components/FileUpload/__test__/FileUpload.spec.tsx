import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNotification } from '@/components/Notify';
import { useImageResize } from '@/workers/useImageResize';
import { FileUpload } from '../FileUpload';
import { UploadedFile } from '../types';

// Мокаем хук для worker
jest.mock('@/workers/useImageResize', () => ({
  useImageResize: jest.fn(),
}));

// Мокаем хук уведомлений
jest.mock('@/components/Notify/useNotification', () => ({
  useNotification: jest.fn(),
}));

const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();

// Мокаем crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: jest.fn().mockReturnValue('mock-uuid'),
  },
});

// Мокаем URL.createObjectURL и URL.revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = jest.fn();

Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: mockCreateObjectURL,
});
Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: mockRevokeObjectURL,
});

// Мок файла
const createMockFile = (name: string, type = 'image/png') =>
  new File([''], name, { type });

describe('Компонент FileUpload', () => {
  const defaultProps = {
    imageWidth: 800,
    imageHeight: 600,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useImageResize as jest.Mock).mockReturnValue({
      processImage: jest.fn().mockResolvedValue({
        buffer: new ArrayBuffer(100),
        mimeType: 'image/jpeg',
      }),
    });

    // Мокаем useNotification
    (useNotification as jest.Mock).mockReturnValue({
      showError: mockShowError,
      showSuccess: mockShowSuccess,
    });
  });

  it('Рендер компонента с кнопкой добавления', () => {
    render(<FileUpload {...defaultProps} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('Отображение ранее загруженных файлов', () => {
    const initialFiles: UploadedFile[] = [
      {
        id: '1',
        name: 'exist.jpg',
        size: 12345,
        type: 'image/jpeg',
        url: '/exist.jpg',
        status: 'uploaded',
      },
    ];

    render(<FileUpload {...defaultProps} initialFiles={initialFiles} />);

    const img = document.querySelector('img[src="/exist.jpg"]');
    expect(img).toBeInTheDocument();
  });

  it('Выбор одного файла, если multiple=false', async () => {
    const onChange = jest.fn();
    render(
      <FileUpload {...defaultProps} multiple={false} onChange={onChange} />
    );

    const uploadInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
    const file = createMockFile('test.png');
    await userEvent.upload(uploadInput, file);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'test.png',
            status: 'added',
            isResized: false,
          }),
        ])
      );
    });
  });

  it('Проверка максимального количества файлов', async () => {
    const onChange = jest.fn();
    render(
      <FileUpload {...defaultProps} maxFiles={2} multiple onChange={onChange} />
    );

    const uploadInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLElement;

    const file1 = createMockFile('1.png');
    const file2 = createMockFile('2.png');
    const file3 = createMockFile('3.png');

    // Добавляем разрешенное количество
    await userEvent.upload(uploadInput, [file1, file2]);

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: '1.png' }),
          expect.objectContaining({ name: '2.png' }),
        ])
      );
    });

    // Пробуем добавить ещё
    await userEvent.upload(uploadInput, [file3]);

    expect(mockShowError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Максимум 2 файлов',
      })
    );
  });

  it('Ресайз изображений после добавления', async () => {
    const onChange = jest.fn();
    render(<FileUpload {...defaultProps} onChange={onChange} />);

    const uploadInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
    const file = createMockFile('resize-test.png');
    await userEvent.upload(uploadInput, file);

    // Вызываем хук для передачи данных в воркер
    await waitFor(() => {
      expect(useImageResize().processImage).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceFile: file,
          outputWidth: 800,
          outputHeight: 600,
        })
      );
    });

    // Проверяем, что файл подменен данными из воркера
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            isResized: true,
            url: 'blob:mock-url',
          }),
        ])
      );
    });
  });

  it('Удаление свежедобавленных файлов', async () => {
    const onChange = jest.fn();
    render(<FileUpload {...defaultProps} onChange={onChange} />);

    const uploadInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
    const file = createMockFile('to-delete.png');
    await userEvent.upload(uploadInput, file);

    await userEvent.upload(uploadInput, [file]);

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'to-delete.png' }),
        ])
      );
    });

    fireEvent.click(screen.getByRole('button', { name: /remove/i }));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.not.arrayContaining([
          expect.objectContaining({
            name: 'to-delete.png',
            status: 'deleted',
          }),
        ])
      );
    });
  });

  it('Пометка на удаление ранее загруженных файлов', async () => {
    const initialFiles: UploadedFile[] = [
      {
        id: 'pre-1',
        name: 'pre.jpg',
        size: 100,
        type: 'image/jpeg',
        url: '/pre.jpg',
        status: 'uploaded',
      },
    ];
    const onChange = jest.fn();
    render(
      <FileUpload
        {...defaultProps}
        initialFiles={initialFiles}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /remove/i }));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'pre-1',
            status: 'deleted',
          }),
        ])
      );
    });
  });

  it('Восстаноление помеченных на удаление файлов', async () => {
    const initialFiles: UploadedFile[] = [
      {
        id: 'pre-1',
        name: 'pre.jpg',
        size: 100,
        type: 'image/jpeg',
        url: '/pre.jpg',
        status: 'uploaded',
      },
    ];
    const onChange = jest.fn();
    render(
      <FileUpload
        {...defaultProps}
        initialFiles={initialFiles}
        onChange={onChange}
      />
    );

    // Delete
    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ status: 'deleted' })])
      );
    });

    // Restore
    fireEvent.click(screen.getByRole('button', { name: /restore/i }));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ status: 'uploaded' }),
        ])
      );
    });
  });

  it('Очистка blob URLs при размонтировании', async () => {
    const { unmount } = render(<FileUpload {...defaultProps} />);

    const uploadInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
    const file = createMockFile('cleanup.png');
    await userEvent.upload(uploadInput, file);

    // Wait until resize happens and blob URL is created
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    unmount();

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
