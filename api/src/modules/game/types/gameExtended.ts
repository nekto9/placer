import { Game, GameUser, Place, Sport, User } from '@/prismaClient';

export type GameExtended = Game & {
  place: Place;
  sport?: Sport;
  users?: (GameUser & { user?: User })[];
};
