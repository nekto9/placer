import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StaticPath } from '@/config/static.config';
import { PrismaService } from '@/database/prisma.service';
import { HelperQueueService } from '@/queue/helper/helperQueue.service';
import { UserAuthLinkDto, UserResponseDto, UserUpdateDto } from './dto';
import { mapUserToResponseDto } from './mappers';

/**
 * Сервис для управления пользователями
 *
 * Содержит бизнес-логику для работы с пользователями: создание, обновление,
 * поиск, получение истории игр. Взаимодействует с базой данных через Prisma ORM
 * и обеспечивает интеграцию с системой аутентификации Keycloak.
 */
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private helperQueueService: HelperQueueService,
    private configService: ConfigService
  ) {}

  /** Путь до файлов с аватарами */
  private getAvatarPath() {
    return `${this.configService.get<string>('API_HOST')}/${StaticPath.AVATAR}`;
  }

  /** Поиск пользователя по id либо по keycloakId */
  async getUser(userData: {
    userIdx?: number;
    /** Этот параметр передается только для запроса юзера из контроллера
     * (т.е. когда нужен профиль автора запроса) */
    requesterSub?: string;
    userId?: string;
    telegramId?: string;
    requesterRoles?: string[];
  }): Promise<UserResponseDto> {
    const user = userData.userId
      ? await this.prisma.user.findUnique({
          where: { id: userData.userId },
          include: {
            favoritedBy: !!userData.requesterSub,
          },
        })
      : userData.telegramId
      ? await this.prisma.user.findUnique({
          where: { telegramId: userData.telegramId },
          include: {
            favoritedBy: !!userData.requesterSub,
          },
        })
      : userData.userIdx
      ? await this.prisma.user.findUnique({
          where: { idx: userData.userIdx },
          include: {
            favoritedBy: !!userData.requesterSub,
          },
        })
      : userData.requesterSub
      ? await this.prisma.user.findUnique({
          where: { keycloakId: userData.requesterSub },
        })
      : null;

    if (!user) {
      return null;
    }

    const currenRequestUser = !userData.requesterSub
      ? null
      : user.keycloakId === userData.requesterSub
      ? user
      : await this.getUser({
          requesterSub: userData.requesterSub,
          requesterRoles: userData.requesterRoles,
        });

    const isShort = !userData.requesterSub;

    return mapUserToResponseDto(
      user,
      this.getAvatarPath(),
      currenRequestUser,
      isShort,
      userData.requesterRoles
    );
  }

  /**
   * Получение пользователей по списку внутренних идентификаторов
   *
   * снаружи не используется, нужно для рассылок
   */
  async getUsersByIds(ids: string[], requesterSub?: string) {
    const currenRequestUser = await this.getUser({ requesterSub });

    const resultUsers = await this.prisma.user.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        favoritedBy: !!currenRequestUser,
      },
    });

    return resultUsers.map((user) =>
      mapUserToResponseDto(user, this.getAvatarPath(), currenRequestUser)
    );
  }

  /**
   * Связываание пользователя с аккаунтом telegram
   */
  async linkTelegramUser(deepLink: string, telegramId: string) {
    // Если юзер с такой телегой уже есть, выходим
    const user = await this.getUser({ telegramId });
    if (user) {
      return null;
    }

    // ссылка живая на 5 минут
    const deepLinkData = await this.prisma.userTgLinker.findUnique({
      where: {
        id: deepLink,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });

    if (deepLinkData) {
      // Обновляем юзера
      const updatedUser = await this.prisma.user.update({
        where: {
          id: deepLinkData.userId,
        },
        data: {
          telegramId: telegramId,
        },
      });

      // Удаляем deepLink
      await this.prisma.userTgLinker.delete({
        where: { id: deepLink },
      });

      return mapUserToResponseDto(updatedUser, this.getAvatarPath());
    }

    return null;
  }

  /**
   * Связывание пользователя с Keycloak аккаунтом
   *
   * Создает связь между внутренним профилем пользователя и его аккаунтом
   * в Keycloak. Если пользователь с данным Keycloak ID уже существует,
   * возвращает существующий профиль. Если нет - создает новый.
   */
  async linkAuthUser(userAuthLink: UserAuthLinkDto, requesterSub?: string) {
    const currenRequestUser = await this.getUser({ requesterSub });

    // Проверяем, существует ли уже пользователь с данным Keycloak ID
    const existingUser = await this.getUser({ requesterSub: userAuthLink.sub });

    // Если пользователь существует, возвращаем его
    if (existingUser) {
      return existingUser;
    }

    // Если пользователя нет, создаем новый профиль
    const newUser = await this.prisma.user.create({
      data: {
        keycloakId: userAuthLink.sub,
        username: userAuthLink.username,
      },
    });

    return mapUserToResponseDto(
      newUser,
      this.getAvatarPath(),
      currenRequestUser
    );
  }

  /** Генерация deepLink для привязки к телеге */
  async generateDeepLink(requesterSub: string) {
    // Находим пользователя по Keycloak ID
    const user = await this.getUser({ requesterSub });

    if (!user) {
      return null;
    }

    // Если связь уже есть, то выходим
    if (user.telegramId) {
      return null;
    }

    const deepLinkValue = await this.prisma.userTgLinker.create({
      data: {
        userId: user.id,
      },
    });

    await this.helperQueueService.cleanupUserTgLinker(user.id);

    return deepLinkValue.id;
  }

  /** Удаление связи аккаунта с телегой */
  async removeTgLink(requesterSub: string) {
    const updatedUser = await this.prisma.user.update({
      where: {
        keycloakId: requesterSub,
      },
      data: {
        telegramId: null,
      },
    });

    return mapUserToResponseDto(updatedUser, this.getAvatarPath(), updatedUser);
  }

  /**
   * Обновление информации о пользователе
   *
   * Обновляет профильную информацию пользователя по его идентификатору.
   * Позволяет изменить любые поля профиля: имя пользователя, email,
   * контактные данные и другие настройки. Обновляет только переданные поля.
   */
  async updateUser(
    id: string,
    updateUserData: UserUpdateDto,
    requesterSub?: string
  ) {
    const currenRequestUser = await this.getUser({ requesterSub });

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        username: updateUserData.username,
        avatar: updateUserData.avatar || null,
      },
      include: {
        favoritedBy: !!currenRequestUser,
      },
    });
    return mapUserToResponseDto(
      updatedUser,
      this.getAvatarPath(),
      currenRequestUser
    );
  }

  /**
   * Удаление пользователя
   *
   * Полностью удаляет пользователя из системы. Операция необратима.
   * Права на операцию проверяем по роли на уровне контроллера.
   * Предполагается, что удалять могут только модераторы
   */
  async deleteUser(id: string) {
    // удаляем юзера
    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    if (!deletedUser) {
      return null;
    }

    // TODO: Добавить уведомления соучастникам игр
    // TODO: Добавить удаление аватара

    // TODO: Придумать, что делать с играми и площадками, где юзер был создателем

    return mapUserToResponseDto(deletedUser, this.getAvatarPath());
  }

  /**
   * Получение списка пользователей с поиском и пагинацией
   *
   * Возвращает список всех пользователей системы с возможностью поиска
   * по имени пользователя. Поиск выполняется без учета регистра и по
   * частичному совпадению. Использует транзакцию для атомарного получения
   * данных и подсчета общего количества.
   */
  async getUsers(
    text: string,
    page: number,
    limit: number,
    requesterSub?: string
  ) {
    const currenRequestUser = await this.getUser({ requesterSub });

    const skip = (page - 1) * limit;

    // Построение условий поиска
    const searchCondition = text
      ? { username: { contains: text, mode: 'insensitive' as const } }
      : undefined;

    // Использование транзакции для атомарного получения данных и подсчета
    const [items, total] = await this.prisma.$transaction([
      // Получение пользователей с пагинацией
      this.prisma.user.findMany({
        where: searchCondition,
        include: {
          favoritedBy: !!currenRequestUser,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // Сортировка по дате создания (новые первыми)
      }),
      // Подсчет общего количества пользователей
      this.prisma.user.count({
        where: searchCondition,
      }),
    ]);

    return {
      items: items.map((user) =>
        mapUserToResponseDto(
          user,
          this.getAvatarPath(),
          currenRequestUser,
          true
        )
      ),
      total,
    };
  }

  /**
   * Добавление пользователя в избранное
   *
   * Добавляет указанного пользователя в список избранных текущего пользователя.
   * Если пользователь уже в избранном, операция игнорируется.
   */
  async addUserToFavorites(favoriteId: string, requesterSub: string) {
    const currentRequestUser = await this.getUser({ requesterSub });

    // Проверяем, что пользователь не добавляет себя в избранное
    if (currentRequestUser.id === favoriteId) {
      throw new Error('Cannot add yourself to favorites');
    }

    // Проверяем, что оба пользователя существуют
    const [user, favoriteUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: currentRequestUser.id } }),
      this.prisma.user.findUnique({ where: { id: favoriteId } }),
    ]);

    if (!user || !favoriteUser) {
      throw new Error('User not found');
    }

    // Добавляем в избранное (если уже есть, то ничего не произойдет из-за unique constraint)
    try {
      await this.prisma.userFavorite.create({
        data: {
          userId: currentRequestUser.id,
          favoriteId,
        },
      });
    } catch (error) {
      // Если запись уже существует, игнорируем ошибку
      if (error.code !== 'P2002') {
        throw error;
      }
    }

    // Возвращаем информацию о добавленном пользователе
    const resultUser = mapUserToResponseDto(
      favoriteUser,
      this.getAvatarPath(),
      currentRequestUser,
      true
    );
    // Добавляем метаданные
    resultUser.meta.isFavorite = true;

    return resultUser;
  }

  /**
   * Удаление пользователя из избранного
   *
   * Удаляет указанного пользователя из списка избранных текущего пользователя.
   */
  async removeUserFromFavorites(favoriteId: string, requesterSub: string) {
    const currentRequestUser = await this.getUser({ requesterSub });

    // Сначала получаем информацию о пользователе, которого удаляем из избранного
    const favoriteUser = await this.prisma.user.findUnique({
      where: { id: favoriteId },
    });

    if (!favoriteUser) {
      return null;
    }

    const deleted = await this.prisma.userFavorite.deleteMany({
      where: {
        userId: currentRequestUser.id,
        favoriteId,
      },
    });

    if (deleted.count === 0) {
      return null;
    }

    // Возвращаем информацию об удаленном пользователе
    return mapUserToResponseDto(
      favoriteUser,
      this.getAvatarPath(),
      currentRequestUser,
      true
    );
  }

  /**
   * Получение списка избранных пользователей
   *
   * Возвращает список всех пользователей, добавленных в избранное текущим пользователем.
   */
  async getUserFavorites(
    text: string,
    page: number,
    limit: number,
    requesterSub?: string
  ) {
    const currenRequestUser = await this.getUser({ requesterSub });

    const skip = (page - 1) * limit;

    // Построение условий поиска
    const searchCondition = text
      ? { username: { contains: text, mode: 'insensitive' as const } }
      : undefined;

    // Использование транзакции для атомарного получения данных и подсчета
    const [items, total] = await this.prisma.$transaction([
      // Получение пользователей с пагинацией
      this.prisma.userFavorite.findMany({
        where: {
          favorite: searchCondition,
          userId: currenRequestUser.id,
        },
        include: {
          favorite: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // Сортировка по дате создания (новые первыми)
      }),
      // Подсчет общего количества пользователей
      this.prisma.userFavorite.count({
        where: {
          favorite: searchCondition,
          userId: currenRequestUser.id,
        },
      }),
    ]);

    return {
      items: items.map((favorite) =>
        mapUserToResponseDto(
          favorite.favorite,
          this.getAvatarPath(),
          currenRequestUser,
          true
        )
      ),
      total,
    };
  }

  /** Обовление аватара */
  async updateAvatar(avatarId: string | null, requesterSub: string) {
    const updatedUser = await this.prisma.user.update({
      where: {
        keycloakId: requesterSub,
      },
      data: {
        avatar: avatarId,
      },
    });

    return mapUserToResponseDto(updatedUser, this.getAvatarPath(), updatedUser);
  }
}
