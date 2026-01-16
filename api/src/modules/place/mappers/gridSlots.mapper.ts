import { GameResponseDto } from '@/modules/game/dto';
import { GridScheduleResponseDto } from '../dto/schedule/gridScheduleResponse.dto';

export const mapGridSlotsToDto = (
  schedule: GridScheduleResponseDto
): GridScheduleResponseDto => {
  const result: GridScheduleResponseDto = {
    startDate: schedule.startDate,
    stopDate: schedule.stopDate,
    days: schedule.days.map((day) => ({
      date: day.date,
      workTimeMode: day.workTimeMode,
      id: day.id,
      timeSlots:
        day.timeSlots.map((slot) => ({
          id: slot.id,
          timeStart: slot.timeStart,
          timeEnd: slot.timeEnd,
        })) || [],
      scheduleName: day.scheduleName,
      games:
        day.games.map((game) => {
          const result: GameResponseDto = {
            id: game.id,
            date: game.date,
            timeStart: game.timeStart,
            timeEnd: game.timeEnd,
            status: game.status,
            gameUsers: game.gameUsers,
            createdAt: game.createdAt,
            level: game.level,
            countMembersMax: game.countMembersMax,
            countMembersMin: game.countMembersMin,
            description: game.description,
            requestMode: game.requestMode,
            place: {
              id: game.place.id,
              name: game.place.name,
              description: game.place.description,
              isFree: game.place.isFree,
              isIndoor: game.place.isIndoor,
              latitude: game.place.latitude,
              longitude: game.place.longitude,
            },
          };
          return result;
        }) || [],
    })),
  };
  return result;
};
