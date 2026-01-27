import { ArrowUturnCcwLeft, Plus, TrashBin } from '@gravity-ui/icons';
import { Button, Flex, Icon } from '@gravity-ui/uikit';
import { FileItem } from './types';

interface FileUploadPreviewProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  onRestore: (id: string) => void;
  onAdd?: () => void;
  onClose?: () => void;

  cssClass?: string;
}

export const FileUploadPreview = (props: FileUploadPreviewProps) => {
  return (
    <Flex
      gap={4}
      wrap="wrap"
      className={`upload-preview${props.cssClass ? ` ${props.cssClass}` : ''}`}
    >
      {props.files.map((fileItem) => (
        <div
          className={`upload-preview__item upload-preview__item--${fileItem.status}`}
          key={fileItem.id}
        >
          <div className="upload-preview__preview">
            {fileItem.type.startsWith('image') && fileItem.url ? (
              <img
                className="upload-preview__image"
                src={fileItem.url}
                alt={fileItem.name}
              />
            ) : (
              <div className="upload-preview__stub"></div>
            )}
          </div>
          <div className="upload-preview__buttons">
            {fileItem.status !== 'deleted' && (
              <Button
                aria-label="Remove file"
                onClick={() => props.onRemove(fileItem.id)}
                className="upload-preview__remove"
                pin="circle-circle"
                size="l"
                view="normal-contrast"
              >
                <Icon data={TrashBin} size={24} />
              </Button>
            )}
            {fileItem.status === 'deleted' && (
              <Button
                aria-label="Restore file"
                onClick={() => props.onRestore(fileItem.id)}
                className="upload-preview__restore"
                pin="circle-circle"
                size="l"
                view="normal-contrast"
              >
                <Icon data={ArrowUturnCcwLeft} size={24} />
              </Button>
            )}
          </div>
        </div>
      ))}
      {props.onAdd ? (
        <div className="upload-preview__item upload-preview__item--new">
          <div className="upload-preview__preview">
            <div className="upload-preview__stub"></div>
          </div>
          <div className="upload-preview__buttons upload-preview__buttons--center">
            <Button
              aria-label="Add file"
              onClick={() => props.onAdd()}
              className="upload-preview__add"
              pin="circle-circle"
              size="l"
              view="normal-contrast"
            >
              <Icon data={Plus} size={24} />
            </Button>
          </div>
        </div>
      ) : null}
    </Flex>
  );
};
