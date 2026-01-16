import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto';
import {
  mapCreateScheduleDtoToPrismaInput,
  mapUpdateScheduleDtoToPrismaInput,
} from './mappers';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  /** Добавление шаблона календарного расписания */
  async createSchedule(dto: CreateScheduleDto) {
    const data = mapCreateScheduleDtoToPrismaInput(dto);
    return this.prisma.schedule.create({
      data,
      include: { timeSlots: { orderBy: { timeStart: 'asc' } } },
    });
  }

  /** Данные шаблона календарного расписания */
  async getScheduleById(id: string) {
    const template = await this.prisma.schedule.findUnique({
      where: { id },
      include: { timeSlots: { orderBy: { timeStart: 'asc' } } },
    });
    return template;
  }

  /** Обновление шаблона календарного расписания */
  async updateSchedule(id: string, dto: UpdateScheduleDto) {
    const data = mapUpdateScheduleDtoToPrismaInput(dto);
    return this.prisma.schedule.update({
      where: { id },
      data,
      include: { timeSlots: { orderBy: { timeStart: 'asc' } } },
    });
  }

  /** Удаление шаблона календарного расписания */
  async deleteSchedule(id: string) {
    return this.prisma.schedule.delete({
      where: { id },
      include: { timeSlots: { orderBy: { timeStart: 'asc' } } },
    });
  }
}
