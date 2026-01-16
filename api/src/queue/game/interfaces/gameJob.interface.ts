/** Удаление черновика задачи */
export interface GameCheckForResetJobData {
  gameId: string;
}

/** Отправка приглашений нескольким юзерам */
export interface GameSendInviteJobData {
  gameId: string;
  userIds: string[]; // ID пользователей для приглашения
}

/** Отправка обезличенных уведомлений создателю игры */
export interface GameSendCreatorMessageJobData {
  gameId: string;
}

/** Отправка уведомлений с данными участника игры */
export interface GameSendMemberMessageJobData {
  gameId: string;
  userId: string; // ID участника
}

export interface GameJobResult {
  status: 'success' | 'failed';
  gameId: string;
  updatedFields?: string[];
  error?: string;
  timestamp: number;
}
