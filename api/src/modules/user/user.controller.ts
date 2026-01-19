import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'nest-keycloak-connect';
import { ROLES } from '@/keycloak/roles.constant';
import { GameTimeFrame, GameUserStatus } from '@/prismaClient';
import {
  PaginatedQueryOptions,
  PaginatedResponseDto,
} from '@/shared/dto/paginatedResponse.dto';
import { AuthenticatedRequest } from '@/shared/types/request.types';
import { GameResponseDto } from '../game/dto';
import { GameService } from '../game/game.service';
import { userDecor } from './decorators';
import { UserAuthLinkDto, UserResponseDto, UserUpdateDto } from './dto';
import { DeepLinkDto } from './dto/deepLink.dto';
import { UserService } from './user.service';

/**
 * Контроллер для управления пользователями
 */
@ApiExtraModels(PaginatedResponseDto)
@ApiTags('Пользователи')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly gameService: GameService
  ) {}
  /**
   * Получение пользователя по внутреннему идентификатору
   */
  @Get(':id')
  @ApiOperation(userDecor.getUserById.operation)
  @ApiParam(userDecor.getUserById.params.id)
  @ApiOkResponse(userDecor.getUserById.responseOk)
  async getUserById(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest
  ): Promise<UserResponseDto> {
    const user = await this.userService.getUser({
      userId: id,
      requesterSub: request.user.sub,
      requesterRoles: request.user.realm_access?.roles,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Удаление пользователя
   */
  @Delete(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(userDecor.deleteUser.operation)
  @ApiParam(userDecor.deleteUser.params.id)
  @ApiOkResponse(userDecor.deleteUser.responseOk)
  async deleteUser(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.deleteUser(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Связывание пользователя с Keycloak аккаунтом
   *
   * Создает или обновляет связь между внутренним профилем пользователя
   * и его аккаунтом в Keycloak. Если пользователь с данным Keycloak ID
   * не существует, создается новый профиль.
   */
  @Post()
  @ApiOperation(userDecor.linkAuthUser.operation)
  @ApiCreatedResponse(userDecor.linkAuthUser.responseOk)
  async linkAuthUser(
    @Body() linkAuthUserDto: UserAuthLinkDto,
    @Req()
    request: AuthenticatedRequest
  ): Promise<UserResponseDto> {
    const user = await this.userService.linkAuthUser(
      linkAuthUserDto,
      request.user.sub
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Получение deepLink для связи с аккаунтом телеги
   */
  @Post('deepLink')
  @ApiOperation(userDecor.deepLink.operation)
  @ApiOkResponse(userDecor.deepLink.responseOk)
  async deepLink(
    @Req()
    request: AuthenticatedRequest
  ): Promise<DeepLinkDto> {
    const generatedLink = await this.userService.generateDeepLink(
      request.user.sub
    );
    if (!generatedLink) throw new NotFoundException('DeepLink error');
    return { deepLink: generatedLink };
  }

  /** Удаление связи аккаунта с телегой */
  @Patch('removeTgLink')
  @ApiOperation(userDecor.removeTgLink.operation)
  @ApiOkResponse(userDecor.removeTgLink.responseOk)
  async removeTgLink(
    @Req()
    request: AuthenticatedRequest
  ): Promise<UserResponseDto> {
    const user = await this.userService.removeTgLink(request.user.sub);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Обновление информации о пользователе
   */
  @Patch(':id')
  @ApiOperation(userDecor.updateUser.operation)
  @ApiParam(userDecor.updateUser.params.id)
  @ApiOkResponse(userDecor.updateUser.responseOk)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UserUpdateDto,
    @Req()
    request: AuthenticatedRequest
  ): Promise<UserResponseDto> {
    // TODO: Добавить проверку на права
    const user = await this.userService.updateUser(
      id,
      updateUserDto,
      request.user.sub
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Получение списка пользователей с поиском и пагинацией
   *
   * Возвращает список всех пользователей системы с возможностью поиска
   * по имени пользователя. Поддерживает пагинацию для больших списков.
   * Поиск выполняется без учета регистра и по частичному совпадению.
   */
  @Get()
  @ApiOperation(userDecor.getUsers.operation)
  @ApiQuery(PaginatedQueryOptions.text)
  @ApiQuery(PaginatedQueryOptions.page)
  @ApiQuery(PaginatedQueryOptions.limit)
  @ApiOkResponse(userDecor.getUsers.responseOk)
  async getUsers(
    @Query('text') text: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req()
    request: AuthenticatedRequest
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { items, total } = await this.userService.getUsers(
      text,
      +page,
      +limit,
      request.user.sub
    );
    if (!items) throw new NotFoundException('Users not found');
    return {
      items,
      meta: {
        total,
        page: +page,
        limit: +limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Добавление пользователя в избранное
   */
  @Post('favorites/:favoriteId')
  @ApiOperation(userDecor.addUserToFavorites.operation)
  @ApiParam(userDecor.addUserToFavorites.params.favoriteId)
  @ApiCreatedResponse(userDecor.addUserToFavorites.responseOk)
  async addUserToFavorites(
    @Param('favoriteId') favoriteId: string,
    @Req() request: AuthenticatedRequest
  ): Promise<UserResponseDto> {
    const addedUser = await this.userService.addUserToFavorites(
      favoriteId,
      request.user.sub,
      request.user.realm_access?.roles
    );
    if (!addedUser) throw new NotFoundException('User not found');
    return addedUser;
  }

  /**
   * Удаление пользователя из избранного
   */
  @Delete('favorites/:favoriteId')
  @ApiOperation(userDecor.removeUserFromFavorites.operation)
  @ApiParam(userDecor.removeUserFromFavorites.params.favoriteId)
  @ApiOkResponse(userDecor.removeUserFromFavorites.responseOk)
  async removeUserFromFavorites(
    @Param('favoriteId') favoriteId: string,
    @Req() request: AuthenticatedRequest
  ): Promise<UserResponseDto> {
    const removedUser = await this.userService.removeUserFromFavorites(
      favoriteId,
      request.user.sub,
      request.user.realm_access?.roles
    );
    if (!removedUser) throw new NotFoundException('User not found');
    return removedUser;
  }

  /**
   * Получение списка избранных пользователей
   */
  @Get('favorites/list')
  @ApiOperation(userDecor.getUserFavorites.operation)
  @ApiQuery(PaginatedQueryOptions.text)
  @ApiQuery(PaginatedQueryOptions.page)
  @ApiQuery(PaginatedQueryOptions.limit)
  @ApiOkResponse(userDecor.getUserFavorites.responseOk)
  async getUserFavorites(
    @Query('text') text: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req()
    request: AuthenticatedRequest
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { items, total } = await this.userService.getUserFavorites(
      text,
      +page,
      +limit,
      request.user.sub
    );
    if (!items) throw new NotFoundException('Users not found');
    return {
      items,
      meta: {
        total: total,
        page: +page,
        limit: +limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Получение списка игр с пагинацией
   *
   * Возвращает список игр с участием юзера с поддержкой пагинации.
   * Игры сортируются по дате игры (ближайшие первыми).
   */
  @Get(':id/games')
  @ApiOperation(userDecor.getUserGames.operation)
  @ApiParam(userDecor.getUserGames.params.id)
  @ApiQuery(PaginatedQueryOptions.page)
  @ApiQuery(PaginatedQueryOptions.limit)
  @ApiQuery(userDecor.getUserGames.query.startDate)
  @ApiQuery(userDecor.getUserGames.query.stopDate)
  @ApiQuery(userDecor.getUserGames.query.timeframe)
  @ApiQuery(userDecor.getUserGames.query.memberStatuses)
  @ApiOkResponse(userDecor.getUserGames.responseOk)
  async getUserGames(
    @Param('id') userId: string,
    @Req()
    request: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('startDate') startDate?: string,
    @Query('stopDate') stopDate?: string,
    @Query('timeframe') timeframe?: GameTimeFrame,
    @Query('memberStatuses') memberStatuses?: GameUserStatus[]
  ): Promise<PaginatedResponseDto<GameResponseDto>> {
    const { items, total } = await this.gameService.getGames({
      page: +page,
      limit: +limit,
      startDate,
      stopDate,
      timeframe,
      userId,
      requesterSub: request.user.sub,
      memberStatuses,
    });
    if (!items) throw new NotFoundException('Games not found');
    return {
      items,
      meta: {
        total,
        page: +page,
        limit: +limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
