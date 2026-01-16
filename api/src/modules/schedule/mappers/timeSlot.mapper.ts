import { TimeSlot } from '@/prismaClient';
import { TimeSlotResponseDto } from '../dto';

export const mapTimeSlotToResponseDto = (
  slot: TimeSlot
): TimeSlotResponseDto => {
  return {
    id: slot.id,
    timeStart: slot.timeStart,
    timeEnd: slot.timeEnd,
  };
};
