import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateCityDto, UpdateCityDto } from './dto';
import { mapCityToResponseDto } from './mappers';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  /** Создание города */
  async createCity(createCityDto: CreateCityDto) {
    const createdCity = await this.prisma.city.create({
      data: createCityDto,
    });

    return mapCityToResponseDto(createdCity);
  }

  /** Список видов спорта */
  async getCities(text: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Построение условий поиска
    const searchCondition = text
      ? { name: { contains: text, mode: 'insensitive' as const } }
      : undefined;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.city.findMany({
        where: searchCondition,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.city.count(),
    ]);

    return {
      items: items.map(mapCityToResponseDto),
      total,
    };
  }

  /** Получение города по ID */
  async getCityById(id: string) {
    const city = await this.prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      throw new NotFoundException('Вид спорта  не найден');
    }

    return mapCityToResponseDto(city);
  }

  /** Обновление города */
  async updateCity(id: string, updateCityDto: UpdateCityDto) {
    const updatedCity = await this.prisma.city.update({
      where: { id },
      data: updateCityDto,
    });

    return mapCityToResponseDto(updatedCity);
  }

  /** Удаление города */
  async deleteCity(id: string) {
    const deletedCity = await this.prisma.city.findFirst({
      where: { id },
    });

    return mapCityToResponseDto(deletedCity);
  }
}
