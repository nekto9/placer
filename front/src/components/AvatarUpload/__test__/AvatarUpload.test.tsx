import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import * as notifyModule from '@/components/Notify';
import * as apiModule from '@/store/api';
import { AvatarUpload } from '../AvatarUpload';

// Мокаем хук уведомлений
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();

// Мокаем RTK Query мутацию
const mockUploadAvatarAction = jest.fn();
const mockUnwrap = jest.fn();

describe('AvatarUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Мокаем useNotification
    jest.spyOn(notifyModule, 'useNotification').mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showWarning: jest.fn(),
      showInfo: jest.fn(),
    });

    // Мокаем useUploadAvatarMutation
    jest
      .spyOn(apiModule, 'useUploadAvatarMutation')
      .mockReturnValue([
        mockUploadAvatarAction,
        { isLoading: false, reset: jest.fn() },
      ]);

    mockUploadAvatarAction.mockReturnValue({
      unwrap: mockUnwrap,
    });
  });

  it('renders upload button', () => {
    render(<AvatarUpload />);
    expect(screen.getByText('Загрузить аватар')).toBeInTheDocument();
  });

  it('shows error for non-image file', async () => {
    render(<AvatarUpload />);

    const file = new File([''], 'test.txt', { type: 'text/plain' });

    const hiddenInput = screen.getByTestId('file-input');
    if (!hiddenInput) throw new Error('File input not found');

    fireEvent.change(hiddenInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Пожалуйста, выберите изображение' })
      );
    });
  });

  it('shows error for file larger than 5MB', async () => {
    render(<AvatarUpload />);

    const largeFile = new File(['a'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });

    const hiddenInput = screen.getByTestId('file-input');
    if (!hiddenInput) throw new Error('File input not found');

    fireEvent.change(hiddenInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Размер файла не должен превышать 5MB',
        })
      );
    });
  });

  it('uploads valid image and calls onSuccess', async () => {
    const mockOnSuccess = jest.fn();
    const mockResponse = 'https://example.com/avatar.jpg';

    mockUnwrap.mockResolvedValue(mockResponse);

    render(<AvatarUpload onUploadSuccess={mockOnSuccess} />);

    const validFile = new File(['valid'], 'avatar.jpg', { type: 'image/jpeg' });

    const hiddenInput = screen.getByTestId('file-input');
    if (!hiddenInput) throw new Error('File input not found');

    fireEvent.change(hiddenInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(mockUploadAvatarAction).toHaveBeenCalledWith({
        body: { avatar: validFile },
      });
      expect(mockShowSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Аватар успешно загружен' })
      );
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse);
    });

    // Проверяем, что input очищен
    expect((hiddenInput as HTMLInputElement).value).toBe('');
  });

  it('shows error on upload failure', async () => {
    mockUnwrap.mockRejectedValue(new Error('Network error'));

    render(<AvatarUpload />);

    const validFile = new File(['valid'], 'avatar.jpg', { type: 'image/jpeg' });

    const hiddenInput = screen.getByTestId('file-input');
    if (!hiddenInput) throw new Error('File input not found');

    fireEvent.change(hiddenInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Ошибка загрузки аватара' })
      );
    });
  });
});
