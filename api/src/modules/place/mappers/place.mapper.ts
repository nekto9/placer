import { UserRequestDto } from '@/modules/user/dto';
import { Place, PlaceFavorite, Schedule } from '@/prismaClient';
import { PlaceResponseDto, ScheduleShortResponseDto } from '../dto';
import { PlaceMetaDto } from '../dto/PlaceMeta.dto';

const checkEditPermissions = (requestRoles?: string[]) => {
  return !!requestRoles?.some((role) => role === 'place-manager');
};

export const mapPlaceToResponseDto = (
  place: Place & {
    favoritedUsers?: PlaceFavorite[];
    covers?: { id: string; order: number }[];
    sports?: { sport: { id: string; name: string } }[];
    city?: { id: string; name: string };
  },
  coverPath: string,
  /** Если нужны метаданные, нужно сюда передать юзера */
  userRequest?: UserRequestDto,
  requestRoles?: string[]
): PlaceResponseDto => {
  const resultPlace: PlaceResponseDto = {
    id: place.id,
    name: place.name,
    description: place.description,
    isIndoor: place.isIndoor,
    isFree: place.isFree,
    latitude: place.latitude,
    longitude: place.longitude,
  };

  if (place.covers?.length) {
    resultPlace.covers = place.covers
      ?.sort((a, b) => a.order - b.order)
      .map((cover) => ({
        fileId: cover.id,
        fileUrl: `${coverPath}/${cover.id}.jpg`,
      }));
  }

  if (place.sports?.length) {
    resultPlace.sports = place.sports.map((sportRelation) => ({
      id: sportRelation.sport.id,
      name: sportRelation.sport.name,
    }));
  }

  if (place.city) {
    resultPlace.city = place.city;
  }

  if (userRequest) {
    // Критерии для прав добавим позже, пока права только у создателя

    const meta: PlaceMetaDto = {
      canEdit: checkEditPermissions(requestRoles),
      isFavorite: place.favoritedUsers
        ? place.favoritedUsers?.some((fav) => fav.userId === userRequest.id)
        : undefined,
    };

    resultPlace.meta = meta;
  }

  return resultPlace;
};

export const mapSchedulesToShortDto = (
  schedules: Schedule[]
): ScheduleShortResponseDto[] => {
  return schedules.map((schedule) => {
    return {
      id: schedule.id,
      placeId: schedule.placeId,
      rank: schedule.rank,
      name: schedule.name,
      startDate: schedule.startDate.toISOString(),
      stopDate: schedule.stopDate.toISOString(),
      status: schedule.status,
    };
  });
};
