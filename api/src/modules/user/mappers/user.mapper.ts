import { StaticPath } from '@/config/static.config';
import { User, UserFavorite } from '@/prismaClient';
import { UserRequestDto, UserResponseDto } from '../dto';
import { UserMetaDto } from '../dto/UserMetaDto';

export const mapUserToResponseDto = (
  user: User & { favoritedBy?: UserFavorite[] },
  avatarPath: string,
  /** Если нужны метеданные, нужно сюда передать юзера */
  userRequest?: UserRequestDto,
  /** Флаг кратких данных (для публичных списков и тд) */
  isShort?: boolean
): UserResponseDto => {
  const resultUser: UserResponseDto = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  if (!isShort) {
    resultUser.idx = user.idx;
    resultUser.keycloakId = user.keycloakId;
    resultUser.email = user.email;
    resultUser.telegramId = user.telegramId;
  }

  if (user.avatar) {
    resultUser.avatar = {
      fileId: user.avatar,
      fileUrl: `${avatarPath}/${user.avatar}.jpg`,
    };
  }

  if (userRequest) {
    // Критерии для прав добавим позже, пока права только у самомго юзера

    const meta: UserMetaDto = {
      canEdit: userRequest.keycloakId === user.keycloakId,
      isFavorite: user.favoritedBy
        ? user.favoritedBy?.some((fav) => fav.favoriteId === user.id)
        : undefined,
    };

    resultUser.meta = meta;
  }

  return resultUser;
};
