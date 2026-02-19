import { DateTime } from "@gravity-ui/date-utils";
import { GameResponseDto, GameUserDto } from "@/store/api";

export type GameUserViewModel = Omit<GameUserDto, "status"> & {
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
  "date" | "gameUsers" | "level" | "countMembersMax" | "countMembersMin"
>;

/** Данные первого шага: площадка, дата, время */
export type GameStep1Data = {
  placeId: string[];
  date: DateTime | null;
  timeStart: number;
  timeEnd: number;
};

/** Данные второго шага: все поля кроме данных шага 1 */
export type GameStep2Data = Omit<
  GameViewModel,
  "placeId" | "date" | "timeStart" | "timeEnd"
>;
