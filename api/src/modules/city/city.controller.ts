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
import { CityService } from './city.service';
import { cityDecor } from './decorators';
import { CityResponseDto, CreateCityDto, UpdateCityDto } from './dto';

@ApiExtraModels(PaginatedResponseDto<CityResponseDto>)
@ApiTags('Города')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  /** Создание города */
  @Post()
  @Roles(ROLES.MANAGER)
  @ApiOperation(cityDecor.createCity.operation)
  @ApiCreatedResponse(cityDecor.createCity.responseCreated)
  async createCity(@Body() createCityDto: CreateCityDto) {
    const city = await this.cityService.createCity(createCityDto);
    return city;
  }

  /** Список городов */
  @Get()
  @ApiOperation(cityDecor.getCities.operation)
  @ApiQuery(PaginatedQueryOptions.text)
  @ApiQuery(PaginatedQueryOptions.page)
  @ApiQuery(PaginatedQueryOptions.limit)
  @ApiOkResponse(cityDecor.getCities.responseOk)
  async getCities(
    @Query('text') text: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const { items, total } = await this.cityService.getCities(
      text,
      +page,
      +limit
    );
    if (!items) throw new NotFoundException('Cities not found');
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

  /** Получение города по ID */
  @Get(':id')
  @ApiOperation(cityDecor.getCityById.operation)
  @ApiParam(cityDecor.getCityById.params.id)
  @ApiOkResponse(cityDecor.getCityById.responseOk)
  async getCityById(@Param('id') id: string) {
    const city = await this.cityService.getCityById(id);
    return city;
  }

  /** Обновление города */
  @Patch(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(cityDecor.updateCity.operation)
  @ApiParam(cityDecor.updateCity.params.id)
  @ApiOkResponse(cityDecor.updateCity.responseOk)
  async updateCity(
    @Param('id') id: string,
    @Body() updateCityDto: UpdateCityDto
  ) {
    const city = await this.cityService.updateCity(id, updateCityDto);
    return city;
  }

  /** Удаление города */
  @Delete(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(cityDecor.deleteCity.operation)
  @ApiParam(cityDecor.deleteCity.params.id)
  @ApiOkResponse(cityDecor.deleteCity.responseOk)
  async deleteCity(@Param('id') id: string) {
    const city = await this.cityService.deleteCity(id);
    return city;
  }
}
