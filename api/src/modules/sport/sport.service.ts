import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateSportDto, UpdateSportDto } from './dto';
import { mapSportToResponseDto } from './mappers';

@Injectable()
export class SportService {
  constructor(private prisma: PrismaService) {}

  /** Создание вида спорта */
  async createSport(createSportDto: CreateSportDto) {
    const createdSport = await this.prisma.sport.create({
      data: createSportDto,
    });

    return mapSportToResponseDto(createdSport);
  }

  /** Список видов спорта */
  async getSports(text: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Построение условий поиска
    const searchCondition = text
      ? { name: { contains: text, mode: 'insensitive' as const } }
      : undefined;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.sport.findMany({
        where: searchCondition,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.sport.count(),
    ]);

    return {
      items: items.map(mapSportToResponseDto),
      total,
    };
  }

  /** Получение вида спорта по ID */
  async getSportById(id: string) {
    const sport = await this.prisma.sport.findUnique({
      where: { id },
    });

    if (!sport) {
      throw new NotFoundException('Вид спорта  не найден');
    }

    return mapSportToResponseDto(sport);
  }

  /** Обновление вида спорта */
  async updateSport(id: string, updateSportDto: UpdateSportDto) {
    const updatedSport = await this.prisma.sport.update({
      where: { id },
      data: updateSportDto,
    });

    return mapSportToResponseDto(updatedSport);
  }

  /** Удаление вида спорта */
  async deleteSport(id: string) {
    const deletedSport = await this.prisma.sport.findFirst({
      where: { id },
    });

    return mapSportToResponseDto(deletedSport);
  }
}
