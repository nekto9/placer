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
import {
  PaginatedQueryOptions,
  PaginatedResponseDto,
} from '@/shared/dto/paginatedResponse.dto';
import { sportDecor } from './decorators';
import { CreateSportDto, SportResponseDto, UpdateSportDto } from './dto';
import { SportService } from './sport.service';

@ApiExtraModels(PaginatedResponseDto<SportResponseDto>)
@ApiTags('Виды спорта')
@Controller('sports')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  /** Создание вида спорта */
  @Post()
  @Roles(ROLES.MANAGER)
  @ApiOperation(sportDecor.createSport.operation)
  @ApiCreatedResponse(sportDecor.createSport.responseCreated)
  async createSport(@Body() createSportDto: CreateSportDto) {
    const sport = await this.sportService.createSport(createSportDto);
    return sport;
  }

  /** Список видов спорта */
  @Get()
  @ApiOperation(sportDecor.getSports.operation)
  @ApiQuery(PaginatedQueryOptions.text)
  @ApiQuery(PaginatedQueryOptions.page)
  @ApiQuery(PaginatedQueryOptions.limit)
  @ApiOkResponse(sportDecor.getSports.responseOk)
  async getSports(
    @Query('text') text: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const { items, total } = await this.sportService.getSports(
      text,
      +page,
      +limit
    );
    if (!items) throw new NotFoundException('Sports not found');
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

  /** Получение вида спорта по ID */
  @Get(':id')
  @ApiOperation(sportDecor.getSportById.operation)
  @ApiParam(sportDecor.getSportById.params.id)
  @ApiOkResponse(sportDecor.getSportById.responseOk)
  async getSportById(@Param('id') id: string) {
    const sport = await this.sportService.getSportById(id);
    return sport;
  }

  /** Обновление вида спорта */
  @Patch(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(sportDecor.updateSport.operation)
  @ApiParam(sportDecor.updateSport.params.id)
  @ApiOkResponse(sportDecor.updateSport.responseOk)
  async updateSport(
    @Param('id') id: string,
    @Body() updateSportDto: UpdateSportDto
  ) {
    const sport = await this.sportService.updateSport(id, updateSportDto);
    return sport;
  }

  /** Удаление вида спорта */
  @Delete(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(sportDecor.deleteSport.operation)
  @ApiParam(sportDecor.deleteSport.params.id)
  @ApiOkResponse(sportDecor.deleteSport.responseOk)
  async deleteSport(@Param('id') id: string) {
    const sport = await this.sportService.deleteSport(id);
    return sport;
  }
}
