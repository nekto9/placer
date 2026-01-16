import { DateTime } from '@gravity-ui/date-utils';
import { GameResponseDto, GameUserDto } from '@/store/api';

export type GameUserViewModel = Omit<GameUserDto, 'status'> & {
  status: string[];
};

export type GameViewModel = {
  placeId: string[];
  sportId: string[];
  gameUsers: GameUserViewModel[];
  date: DateTime | null;
  level: string[];
  countMembersMax: string;
  countMembersMin: string;
} & Omit<
  GameResponseDto,
  'date' | 'gameUsers' | 'level' | 'countMembersMax' | 'countMembersMin'
>;
