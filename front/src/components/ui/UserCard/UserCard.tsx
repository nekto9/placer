import { Card, User } from '@gravity-ui/uikit';
import {
  // useAddUserToFavoritesMutation,
  // useRemoveUserFromFavoritesMutation,
  UserResponseDto,
} from '@/store/api';

interface UserCardProps {
  user: UserResponseDto;

  /** Редактирование пользователя */
  onEditClick?: (id: string) => void;
  /** Информация о пользователе */
  onDetailsClick?: (id: string) => void;
  /** Показывать ли кнопки избранного */
  showFavoriteActions?: boolean;
}

export const UserCard = (props: UserCardProps) => {
  return (
    <Card
      className="g-s__p_2"
      type="action"
      view="outlined"
      theme="normal"
      onClick={
        props.onDetailsClick
          ? () => props.onDetailsClick(props.user.id)
          : undefined
      }
    >
      {/* <Flex direction="column" gap={2}> */}
      <User
        avatar={
          props.user.avatar
            ? { imgUrl: props.user.avatar.fileUrl }
            : { text: props.user.username, theme: 'brand' }
        }
        name={props.user.username}
        size="xl"
      />

      {/* <Flex gap={2} wrap>
          {props.onEditClick && !!props.user.meta?.canEdit && (
            <Button
              view="normal"
              onClick={() => props.onEditClick(props.user.id)}
            >
              Редактировать
            </Button>
          )}

          {props.showFavoriteActions && (
            <Button
              view="outlined"
              loading={isLoadingFavoriteAction}
              onClick={handleToggleFavorite}
              title={
                props.user.meta?.isFavorite
                  ? 'Удалить из избранного'
                  : 'Добавить в избранное'
              }
            >
              <Icon
                data={props.user.meta?.isFavorite ? StarFill : Star}
                size={18}
              />
            </Button>
          )}
        </Flex> */}
      {/* </Flex> */}
    </Card>
  );
};
