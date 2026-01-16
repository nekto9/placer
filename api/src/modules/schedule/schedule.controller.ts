import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'nest-keycloak-connect';
import { ROLES } from '@/keycloak/roles.constant';
import { scheduleDecor } from './decorators';
import {
  CreateScheduleDto,
  ScheduleResponseDto,
  UpdateScheduleDto,
} from './dto';
import { mapScheduleToResponseDto } from './mappers';
import { ScheduleService } from './schedule.service';

@ApiTags('Шаблоны расписаний')
@Controller('schedules')
/** Шаблоны расписаний */
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /** Данные расписания */
  @Get(':id')
  @ApiOperation(scheduleDecor.getScheduleById.operation)
  @ApiParam(scheduleDecor.getScheduleById.params.id)
  @ApiOkResponse(scheduleDecor.getScheduleById.responseOk)
  async getScheduleById(@Param('id') id: string): Promise<ScheduleResponseDto> {
    const template = await this.scheduleService.getScheduleById(id);
    if (!template) throw new NotFoundException('Schedule not found');
    return mapScheduleToResponseDto(template);
  }

  /** Добавление расписания */
  @Post()
  @Roles(ROLES.MANAGER)
  @ApiOperation(scheduleDecor.createSchedule.operation)
  @ApiCreatedResponse(scheduleDecor.createSchedule.responseCreated)
  async createSchedule(
    @Body()
    createScheduleDto: CreateScheduleDto
  ): Promise<ScheduleResponseDto> {
    const template = await this.scheduleService.createSchedule(
      createScheduleDto
    );
    if (!template) throw new NotFoundException('Schedule not found');
    return mapScheduleToResponseDto(template);
  }

  /** Обновление расписания */
  @Patch(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(scheduleDecor.updateSchedule.operation)
  @ApiParam(scheduleDecor.updateSchedule.params.id)
  @ApiOkResponse(scheduleDecor.updateSchedule.responseOk)
  async updateSchedule(
    @Param('id') id: string,
    @Body()
    updateScheduleDto: UpdateScheduleDto
  ): Promise<ScheduleResponseDto> {
    const template = await this.scheduleService.updateSchedule(
      id,
      updateScheduleDto
    );
    if (!template) throw new NotFoundException('Schedule not found');
    return mapScheduleToResponseDto(template);
  }

  /** Удаление расписания */
  @Delete(':id')
  @Roles(ROLES.MANAGER)
  @ApiOperation(scheduleDecor.deleteSchedule.operation)
  @ApiParam(scheduleDecor.deleteSchedule.params.id)
  @ApiOkResponse(scheduleDecor.deleteSchedule.responseOk)
  async deleteSchedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    const template = await this.scheduleService.deleteSchedule(id);
    if (!template) throw new NotFoundException('Schedule not found');
    return mapScheduleToResponseDto(template);
  }
}
