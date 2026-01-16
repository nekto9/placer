export interface EmailJobData {
  /** Получатель */
  to: string;
  /** Тема письма */
  subject: string;
  /** Файл шаблона ejs */
  template?: string;
  /** Данные для шаблона ejs */
  context?: Record<string, string>;
}

export interface EmailJobResult {
  status: 'sent' | 'failed';
  messageId?: string;
  timestamp: number;
}
