export interface CleanupUserTgLinkerJobData {
  userId: string; // ID пользователя, который инициировал очистку
}

export interface HelperJobResult {
  status: 'success' | 'failed';
  deletedCount?: number; // Количество удаленных записей
  error?: string;
  timestamp: number;
}
