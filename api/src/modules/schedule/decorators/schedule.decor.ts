import {
  ApiOperationOptions,
  ApiParamOptions,
  ApiResponseNoStatusOptions,
} from '@nestjs/swagger';
import { ScheduleResponseDto } from '../dto';

const idParam = {
  name: 'id',
  description: 'ID шаблона',
  required: true,
  type: 'string',
  format: 'uuid',
};

type ScheduleDecor = {
  getScheduleById: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
  createSchedule: {
    operation: ApiOperationOptions;
    responseCreated: ApiResponseNoStatusOptions;
  };
  updateSchedule: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
  deleteSchedule: {
    operation: ApiOperationOptions;
    params: { id: ApiParamOptions };
    responseOk: ApiResponseNoStatusOptions;
  };
};

export const scheduleDecor: ScheduleDecor = {
  getScheduleById: {
    operation: {
      summary: 'Данные расписания',
    },
    params: { id: idParam },
    responseOk: { type: ScheduleResponseDto },
  },
  createSchedule: {
    operation: {
      summary: 'Добавление расписания',
    },
    responseCreated: {
      type: ScheduleResponseDto,
    },
  },
  updateSchedule: {
    operation: {
      summary: 'Обновление расписания',
    },
    params: { id: idParam },
    responseOk: { type: ScheduleResponseDto },
  },
  deleteSchedule: {
    operation: {
      summary: 'Удаление расписания',
    },
    params: { id: idParam },
    responseOk: { type: ScheduleResponseDto },
  },
};
