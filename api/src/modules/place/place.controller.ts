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
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'nest-keycloak-connect';
import { ROLES } from '@/keycloak/roles.constant';
import { GameTimeFrame } from '@/prismaClient';
import {
  PaginatedQueryOptions,
  PaginatedResponseDto,
} from '@/shared/dto/paginatedResponse.dto';
import { AuthenticatedRequest } from '@/shared/types/request.types';
import { GameResponseDto } from '../game/dto';
import { GameService } from '../game/game.service';
import { placeDecor } from './decorators';
import {
  CreatePlaceDto,
  PlaceResponseDto,
  ScheduleShortResponseDto,
  UpdatePlaceDto,
  UpdateScheduleRankDto,
} from './dto';
import { GridScheduleResponseDto } from './dto/schedule/gridScheduleResponse.dto';
import { PlaceService } from './place.service';

@ApiExtraModels(PaginatedResponseDto<PlaceResponseDto>)
@ApiTags('Площадки')
@Controller('places')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly gameService: GameService
  ) {}

  /** Новая площадка */
  @Post()
  @Roles(ROLES.MANAGER)
  @ApiOperation(placeDecor.createPlace.operation)
  @ApiResponse(placeDecor.createPlace.responseCreated)
  async createPlace(
    @Body() createPlaceDto: CreatePlaceDto,
    @Req()
    request: AuthenticatedRequest
  ): Promise<PlaceResponseDto> {
    const place = await this.placeService.createPlace(
      createPlaceDto,
      request.user.sub,
      request.user.realm_access?.roles
    );
    if (!place) throw new NotFoundException('Place not found');
    return place;
  }

  /** Список площадок */
  @Get()
  @ApiOperation(placeDecor.getPlaces.operation)
  @ApiQuery(PaginatedQueryOptions.page)
  @ApiQuery(PaginatedQueryOptions.limit)
  @ApiOkResponse(placeDecor.getPlaces.responseOk)
  async getPlaces(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req()
    request: AuthenticatedRequest
  ): Promise<PaginatedResponseDto<PlaceResponseDto>> {
    const { items, total } = await this.placeService.getPlaces(
      +page,
      +limit,
      request.user.sub
    );

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

  /** Площадка по id */
  @Get(':id')
  @ApiOperation(placeDecor.getPlaceById.operation)
  @ApiParam(placeDecor.getPlaceById.params.id)
  @ApiOkResponse(placeDecor.getPlaceById.responseOk)
  async getPlaceById(
    @Param('id') id: string,
    @Req()
    request: AuthenticatedRequest
  ): Promise<PlaceResponseDto> {
    const place = await this.placeService.getPlaceById(
      id,
      request.user.sub,
      request.user.realm_access?.roles
    );
    if (!place) throw new NotFoundException('Place not found');
    return place;
  }

  /** Обновление площадки */
  @Patch(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(placeDecor.updatePlace.operation)
  @ApiParam(placeDecor.updatePlace.params.id)
  @ApiOkResponse(placeDecor.updatePlace.responseOk)
  async updatePlace(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @Req()
    request: AuthenticatedRequest
  ): Promise<PlaceResponseDto> {
    const place = await this.placeService.updatePlace(
      id,
      updatePlaceDto,
      request.user.sub,
      request.user.realm_access?.roles
    );
    if (!place) throw new NotFoundException('Place not found');
    return place;
  }

  /** Удаление площадки */
  @Delete(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(placeDecor.deletePlace.operation)
  @ApiParam(placeDecor.deletePlace.params.id)
  @ApiOkResponse(placeDecor.deletePlace.responseOk)
  async deletePlace(
    @Param('id') id: string,
    @Req()
    request: AuthenticatedRequest
  ): Promise<PlaceResponseDto> {
    const place = await this.placeService.deletePlace(
      id,
      request.user.sub,
      request.user.realm_access?.roles
    );
    if (!place) throw new NotFoundException('Place not found');
    return place;
  }

  /** Расписания площадки */
  @Get(':id/schedules')
  @ApiOperation(placeDecor.getPlaceSchedules.operation)
  @ApiParam(placeDecor.getPlaceSchedules.params.id)
  @ApiOkResponse(placeDecor.getPlaceSchedules.responseOk)
  async getPlaceSchedules(
    @Param('id') id: string
  ): Promise<ScheduleShortResponseDto[]> {
    const schedules = await this.placeService.getPlaceSchedules(id);
    if (!schedules) throw new NotFoundException('Schedules not found');
    return schedules;
  }

  /** Обновление расписаний площадки */
  @Patch(':id/schedules')
  @Roles(ROLES.MANAGER)
  @ApiOperation(placeDecor.updateRankPlaceSchedules.operation)
  @ApiParam(placeDecor.updateRankPlaceSchedules.params.id)
  @ApiOkResponse(placeDecor.updateRankPlaceSchedules.responseOk)
  @ApiBody(placeDecor.updateRankPlaceSchedules.body)
  async updateRankPlaceSchedules(
    @Param('id') id: string,
    @Body()
    body: UpdateScheduleRankDto[]
    // @Req()
    // request: AuthenticatedRequest
  ): Promise<ScheduleShortResponseDto[]> {
    const schedules = await this.placeService.updateRankPlaceSchedules(
      id,
      body
      // request.user.sub
    );
    if (!schedules) throw new NotFoundException('Schedules not found');
    return schedules;
  }

  /** Слоты */
  @Get(':id/slots')
  @ApiOperation(placeDecor.getPlaceSlots.operation)
  @ApiParam(placeDecor.getPlaceSlots.params.id)
  @ApiQuery(placeDecor.getPlaceSlots.query.startDate)
  @ApiQuery(placeDecor.getPlaceSlots.query.stopDate)
  @ApiOkResponse(placeDecor.getPlaceSlots.responseOk)
  async getPlaceSlots(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('stopDate') stopDate: string
    // @Req()
    // request: AuthenticatedRequest
  ): Promise<GridScheduleResponseDto> {
    const grid = await this.placeService.getPlaceSlots(
      id,
      startDate,
      stopDate
      // request.user.sub
    );
    if (!grid) throw new NotFoundException('Place not found');
    return grid;
  }

  /**
   * Добавление площадки в избранное
   *
   * Добавляет указанную площадку в список избранных текущего пользователя.
   * Требует аутентификации.
   */
  @Post('favorites/:favoriteId')
  @ApiOperation(placeDecor.addPlaceToFavorites.operation)
  @ApiParam(placeDecor.addPlaceToFavorites.params.favoriteId)
  @ApiCreatedResponse(placeDecor.addPlaceToFavorites.responseOk)
  async addPlaceToFavorites(
    @Param('favoriteId') favoriteId: string,
    @Req() request: AuthenticatedRequest
  ): Promise<PlaceResponseDto> {
    const addedPlace = await this.placeService.addPlaceToFavorites(
      favoriteId,
      request.user.sub
    );
    if (!addedPlace) throw new NotFoundException('Place not found');
    return addedPlace;
  }

  /**
   * Удаление площадки из избранного
   *
   * Удаляет указанную площадку из списка избранных текущего пользователя.
   * Требует аутентификации.
   */
  @Delete('favorites/:favoriteId')
  @ApiOperation(placeDecor.removePlaceFromFavorites.operation)
  @ApiParam(placeDecor.removePlaceFromFavorites.params.favoriteId)
  @ApiOkResponse(placeDecor.removePlaceFromFavorites.responseOk)
  async removePlaceFromFavorites(
    @Param('favoriteId') favoriteId: string,
    @Req() request: AuthenticatedRequest
  ): Promise<PlaceResponseDto> {
    const removedPlace = await this.placeService.removePlaceFromFavorites(
      favoriteId,
      request.user.sub
    );
    if (!removedPlace) throw new NotFoundException('Place not found');
    return removedPlace;
  }

  /**
   * Получение списка избранных площадок
   *
   * Возвращает список всех площадок, добавленных в избранное текущим пользователем.
   * Требует аутентификации.
   */
  @Get('favorites/list')
  @ApiOperation(placeDecor.getPlaceFavorites.operation)
  @ApiQuery(PaginatedQueryOptions.text)
  @ApiQuery(PaginatedQueryOptions.page)
  @ApiQuery(PaginatedQueryOptions.limit)
  @ApiOkResponse(placeDecor.getPlaceFavorites.responseOk)
  async getPlaceFavorites(
    @Query('text') text: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req()
    request: AuthenticatedRequest
  ): Promise<PaginatedResponseDto<PlaceResponseDto>> {
    const { items, total } = await this.placeService.getPlaceFavorites(
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
   * Возвращает список игр площадки с поддержкой пагинации.
   * Игры сортируются по дате создания (новые первыми).
   */
  @Get(':id/games')
  @ApiOperation(placeDecor.getPlaceGames.operation)
  @ApiParam(placeDecor.getPlaceGames.params.id)
  @ApiQuery(PaginatedQueryOptions.page)
  @ApiQuery(PaginatedQueryOptions.limit)
  @ApiQuery(placeDecor.getPlaceGames.query.startDate)
  @ApiQuery(placeDecor.getPlaceGames.query.stopDate)
  @ApiQuery(placeDecor.getPlaceGames.query.timeframe)
  @ApiOkResponse(placeDecor.getPlaceGames.responseOk)
  async getPlaceGames(
    @Param('id') placeId: string,
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
      placeId,
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
}
