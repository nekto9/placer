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
import { GameTimeFrame } from '@/prismaClient';
import {
  PaginatedQueryOptions,
  PaginatedResponseDto,
} from '@/shared/dto/paginatedResponse.dto';
import { AuthenticatedRequest } from '@/shared/types/request.types';
import { gameDecor } from './decorators';
import { CreateGameDto, GameResponseDto, UpdateGameDto } from './dto';
import { GameService } from './game.service';

/**
 * Контроллер для управления играми
 *
 * Предоставляет REST API для работы с играми: создание, обновление, удаление,
 * получение информации о играх, управление участниками и приглашениями.
 * Все эндпоинты требуют аутентификации через Keycloak.
 */
@ApiExtraModels(PaginatedResponseDto<GameResponseDto>)
@ApiTags('Игры')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  /**
   * Создание игры на основе существующего временного слота
   *
   * Создает черновик новой игры, используя предопределенный временной слот площадки.
   * Автоматически устанавливает время начала и окончания игры на основе слота.
   * После создания добавляет задачу в очередь для проверки автоматического удаления,
   * если создание игры не было завершено.
   */
  @Post(':placeId/slot/:slotId/:date')
  @ApiOperation(gameDecor.createGameForSlot.operation)
  @ApiParam(gameDecor.createGameForSlot.params.placeId)
  @ApiParam(gameDecor.createGameForSlot.params.slotId)
  @ApiParam(gameDecor.createGameForSlot.params.date)
  @ApiCreatedResponse(gameDecor.createGameForSlot.responseOk)
  async createGameForSlot(
    @Param('placeId') placeId: string,
    @Param('slotId') slotId: string,
    @Param('date') date: string,
    @Req()
    request: AuthenticatedRequest
  ): Promise<GameResponseDto> {
    const game = await this.gameService.createGameForSlot(
      placeId,
      slotId,
      date,
      request.user.sub
    );
    return game;
  }

  /**
   * Создание игры с кастомным временным интервалом
   *
   * Создает новую игру с произвольным временем начала и окончания,
   * не привязанную к существующим временным слотам площадки.
   * Позволяет создавать игры в любое время в рамках рабочих часов площадки.
   */
  @Post(':placeId/customslot')
  @ApiOperation(gameDecor.createGameForCustomSlot.operation)
  @ApiParam(gameDecor.createGameForCustomSlot.params.placeId)
  @ApiCreatedResponse(gameDecor.createGameForCustomSlot.responseOk)
  async createGameForCustomSlot(
    @Param('placeId') placeId: string,
    @Body() createSlotDto: CreateGameDto,
    @Req()
    request: AuthenticatedRequest
  ): Promise<GameResponseDto> {
    const game = await this.gameService.createGameForCustomSlot(
      placeId,
      request.user.sub,
      createSlotDto
    );
    return game;
  }

  /**
   * Обновление существующей игры
   *
   * Позволяет изменить параметры игры: время, статус, участников.
   * При добавлении новых участников автоматически отправляет им приглашения
   * через систему очередей. Только создатель игры может её обновлять.
   */
  @Patch(':id')
  @ApiOperation(gameDecor.updateGame.operation)
  @ApiParam(gameDecor.updateGame.params.id)
  @ApiOkResponse(gameDecor.updateGame.responseOk)
  async updateGame(
    @Req()
    request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto
  ): Promise<GameResponseDto> {
    const game = await this.gameService.updateGame(
      id,
      updateGameDto,
      request.user.sub
    );
    return game;
  }

  /**
   * Удаление игры
   *
   * Полностью удаляет игру из системы. Операция необратима.
   */
  @Delete(':id')
  @ApiOperation(gameDecor.deleteGame.operation)
  @ApiParam(gameDecor.deleteGame.params.id)
  @ApiOkResponse(gameDecor.deleteGame.responseOk)
  async deleteGame(
    @Param('id') id: string,
    @Req()
    request: AuthenticatedRequest
  ): Promise<GameResponseDto> {
    const game = await this.gameService.deleteGame(id, request.user.sub);
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  /**
   * Получение игры по идентификатору
   *
   * Возвращает подробную информацию об игре, включая данные о площадке
   * и всех участниках с их ролями и статусами.
   */
  @Get(':id')
  @ApiOperation(gameDecor.getGameById.operation)
  @ApiParam(gameDecor.getGameById.params.id)
  @ApiOkResponse(gameDecor.getGameById.responseOk)
  async getGameById(
    @Req()
    request: AuthenticatedRequest,
    @Param('id') id: string
  ): Promise<GameResponseDto> {
    const game = await this.gameService.getGameById(id, request.user.sub);
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  /**
   * Получение списка игр с пагинацией
   *
   * Возвращает список всех игр в системе с поддержкой пагинации.
   * Игры сортируются по дате игры в зависимости от timeframe.
   *
   * По умолчанию показываем ближайшие игры с сортировкой по дате (ближайшие игры - первые).
   *
   * Прошедшие и все - с обратной сортировкой по дате.
   */
  @Get()
  @ApiOperation(gameDecor.getGames.operation)
  @ApiQuery(PaginatedQueryOptions.page)
  @ApiQuery(PaginatedQueryOptions.limit)
  @ApiQuery(gameDecor.getGames.query.startDate)
  @ApiQuery(gameDecor.getGames.query.stopDate)
  @ApiQuery(gameDecor.getGames.query.timeframe)
  @ApiOkResponse(gameDecor.getGames.responseOk)
  async getGames(
    @Req()
    request: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('startDate') startDate?: string,
    @Query('stopDate') stopDate?: string,
    @Query('timeframe') timeframe?: GameTimeFrame
  ): Promise<PaginatedResponseDto<GameResponseDto>> {
    const { items, total } = await this.gameService.getGames({
      page: +page,
      limit: +limit,
      startDate,
      stopDate,
      timeframe,
      requesterSub: request.user.sub,
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

  /**
   * Принятие участником приглашения в игру
   *
   * После получения приглашения пользователь может его принять.
   * Изменяет статус участника с INVITED на CONFIRMED.
   * Доступно только для участников со статусом INVITED.
   */
  @Patch(':id/accept')
  @ApiOperation(gameDecor.acceptInvite.operation)
  @ApiParam(gameDecor.acceptInvite.params.id)
  @ApiOkResponse(gameDecor.acceptInvite.responseOk)
  async acceptInvite(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest
  ): Promise<GameResponseDto> {
    const game = await this.gameService.acceptInvite({
      gameId: id,
      requesterSub: request.user.sub,
    });
    if (!game) throw new NotFoundException('Game or invitation not found');
    return game;
  }

  /**
   * Отклонение участником приглашения в игру
   *
   * После получения приглашения пользователь может его отклонить.
   * У пользователя меняется статус с INVITED на REJECTED,
   * и делает недоступным его повторное приглашение.
   * Доступно только для участников со статусом INVITED.
   */
  @Patch(':id/reject')
  @ApiOperation(gameDecor.rejectInvite.operation)
  @ApiParam(gameDecor.rejectInvite.params.id)
  @ApiOkResponse(gameDecor.rejectInvite.responseOk)
  async rejectInvite(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest
  ): Promise<GameResponseDto> {
    const game = await this.gameService.rejectInvite({
      gameId: id,
      requesterSub: request.user.sub,
    });
    if (!game) throw new NotFoundException('Game or invitation not found');
    return game;
  }

  /**
   * Запрос на участие в игре
   *
   * Для игры со статусом MODERATE пользователь может запросить участие в игре.
   */
  @Patch(':id/request')
  @ApiOperation(gameDecor.requestJoin.operation)
  @ApiParam(gameDecor.requestJoin.params.id)
  @ApiOkResponse(gameDecor.requestJoin.responseOk)
  async requestJoin(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest
  ): Promise<GameResponseDto> {
    const game = await this.gameService.requestJoin({
      gameId: id,
      requesterSub: request.user.sub,
    });
    if (!game) throw new NotFoundException('Game or request not found');
    return game;
  }

  /**
   * Отклонение запроса на участие в игре
   *
   * Создатель игры может отклонить запрос от участника,
   * статус участика меняется с REQUESTED на DECLINED
   */
  @Patch(':id/decline/:userId')
  @ApiOperation(gameDecor.declineJoin.operation)
  @ApiParam(gameDecor.declineJoin.params.id)
  @ApiParam(gameDecor.declineJoin.params.userId)
  @ApiOkResponse(gameDecor.declineJoin.responseOk)
  async declineJoin(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() request: AuthenticatedRequest
  ): Promise<GameResponseDto> {
    const game = await this.gameService.declineJoin({
      gameId: id,
      userId,
      requesterSub: request.user.sub,
    });
    if (!game) throw new NotFoundException('Game or request not found');
    return game;
  }

  /**
   * Принятие запроса на участие в игре
   *
   * Создатель игры может принять запрос от участника,
   * статус участика меняется с REQUESTED на ALLOWED
   */
  @Patch(':id/allow/:userId')
  @ApiOperation(gameDecor.allowJoin.operation)
  @ApiParam(gameDecor.allowJoin.params.id)
  @ApiParam(gameDecor.declineJoin.params.userId)
  @ApiOkResponse(gameDecor.allowJoin.responseOk)
  async allowJoin(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() request: AuthenticatedRequest
  ): Promise<GameResponseDto> {
    const game = await this.gameService.allowJoin({
      gameId: id,
      userId,
      requesterSub: request.user.sub,
    });
    if (!game) throw new NotFoundException('Game or request not found');
    return game;
  }

  /**
   * Выход из участника игры
   *
   * Пользователь может удалить себя из участников игры,
   * если его запрос на участие не был ранее отклонен,
   * т.е. он не в статусе DECLINED.
   */
  @Patch(':id/unjoin')
  @ApiOperation(gameDecor.unJoin.operation)
  @ApiParam(gameDecor.unJoin.params.id)
  @ApiOkResponse(gameDecor.unJoin.responseOk)
  async unJoin(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest
  ): Promise<GameResponseDto> {
    const game = await this.gameService.unJoin({
      gameId: id,
      requesterSub: request.user.sub,
    });
    if (!game) throw new NotFoundException('Game or request not found');
    return game;
  }

  /**
   * Добавление себя в список участников
   *
   * Для игры со статусом PUBLIC (доступна для всех)
   * пользователь может присоединиться к игре.
   * Он добавлется в список участников сразу со статусом ALLOWED
   */
  @Patch(':id/join')
  @ApiOperation(gameDecor.join.operation)
  @ApiParam(gameDecor.join.params.id)
  @ApiOkResponse(gameDecor.join.responseOk)
  async join(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest
  ): Promise<GameResponseDto> {
    const game = await this.gameService.join({
      gameId: id,
      requesterSub: request.user.sub,
    });
    if (!game) throw new NotFoundException('Game or request not found');
    return game;
  }
}
