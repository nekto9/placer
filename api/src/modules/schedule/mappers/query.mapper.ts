import { Prisma } from '@/prismaClient';
import { stringToDate } from '@/tools/dateUtils';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto';

export function mapCreateScheduleDtoToPrismaInput(
  dto: CreateScheduleDto
): Prisma.ScheduleCreateInput {
  const { placeId, ...rest } = dto;
  return {
    ...rest,
    startDate: stringToDate(dto.startDate),
    stopDate: stringToDate(dto.stopDate),
    place: { connect: { id: placeId } },
    timeSlots: {
      createMany: {
        data: dto.timeSlots.map((el) => ({
          timeStart: el.timeStart,
          timeEnd: el.timeEnd,
        })),
        skipDuplicates: true,
      },
    },
  };
}

export function mapUpdateScheduleDtoToPrismaInput(
  dto: UpdateScheduleDto
): Prisma.ScheduleUpdateInput {
  const { timeSlots, ...rest } = dto;
  return {
    ...rest,
    startDate: stringToDate(dto.startDate),
    stopDate: stringToDate(dto.stopDate),
    timeSlots: {
      deleteMany: {
        id: {
          notIn: timeSlots.map((el) => el.id).filter((el) => !!el),
        },
      },
      upsert: timeSlots.map((el) => ({
        where: {
          id: el.id,
        },
        create: {
          timeStart: el.timeStart,
          timeEnd: el.timeEnd,
        },
        update: {
          timeStart: el.timeStart,
          timeEnd: el.timeEnd,
        },
      })),
    },
  };
}
