import { DateTime, dateTime } from '@gravity-ui/date-utils';
import { LabelProps } from '@gravity-ui/uikit';
import {
  GameLevel,
  GameStatus,
  GameUserRole,
  GameUserStatus,
  RequestMode,
} from '@/store/api';

/** Название для enum с именем цветовой темы от Gravity */
interface EnumLabelWithTheme {
  text: string;
  theme: LabelProps['theme'];
}

/** Формат: 1 января 2025 */
const formatDate = (dateString: string | DateTime): string => {
  return dateTime({ input: dateString }).format('LL');
};

/** День недели для даты: понедельник */
const weekdayDate = (dateString: string | DateTime): string => {
  return dateTime({ input: dateString }).format('dddd');
};

/** Статус участия в игре */
const getMemberStatusLabel = (status: GameUserStatus): EnumLabelWithTheme => {
  switch (status) {
    case GameUserStatus.Invited:
      return { text: 'Приглашен', theme: 'info' };
    case GameUserStatus.Requested:
      return { text: 'Запрос', theme: 'warning' };
    case GameUserStatus.Allowed:
      return { text: 'Одобрен', theme: 'success' };
    case GameUserStatus.Declined:
      return { text: 'Отклонен', theme: 'danger' };
    case GameUserStatus.Confirmed:
      return { text: 'Подтвержден', theme: 'normal' };
    default:
      return { text: status, theme: 'unknown' };
  }
};

/** Статус игры */
const getGameStatusLabel = (status: GameStatus): EnumLabelWithTheme => {
  switch (status) {
    case GameStatus.Draft:
      return { text: 'Черновик', theme: 'warning' };
    case GameStatus.Aproved:
      return { text: 'Подтверждена', theme: 'success' };
    default:
      return { text: status, theme: 'unknown' };
  }
};

/** Статус юзера */
const getRoleLabel = (role: GameUserRole): EnumLabelWithTheme => {
  switch (role) {
    case GameUserRole.Creator:
      return { text: 'Создатель', theme: 'clear' };
    case GameUserRole.Member:
      return { text: 'Участник', theme: 'clear' };
    default:
      return { text: role, theme: 'unknown' };
  }
};

/** Уровень сложности игры */
const getGameLevelLabel = (level: GameLevel): EnumLabelWithTheme => {
  switch (level) {
    case GameLevel.Easy:
      return { text: 'Простой', theme: 'success' };
    case GameLevel.Medium:
      return { text: 'Средний', theme: 'warning' };
    case GameLevel.Hard:
      return { text: 'Сложный', theme: 'danger' };
    default:
      return { text: level, theme: 'unknown' };
  }
};

/** Режим набора участников */
const getRequestModeLabel = (mode: RequestMode): EnumLabelWithTheme => {
  switch (mode) {
    case RequestMode.Private:
      return { text: 'Приватная игра', theme: 'info' };
    case RequestMode.Moderate:
      return { text: 'По запросу', theme: 'warning' };
    case RequestMode.Public:
      return { text: 'Открыто для всех', theme: 'success' };
    default:
      return { text: mode, theme: 'unknown' };
  }
};

export {
  formatDate,
  weekdayDate,
  getGameStatusLabel,
  getRoleLabel,
  getMemberStatusLabel,
  getGameLevelLabel,
  getRequestModeLabel,
};
