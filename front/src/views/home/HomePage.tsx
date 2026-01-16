import { useAuthContext } from '@/context/useAuthContext';
import {
  GameTimeFrame,
  GameUserStatus,
  useGetPlaceFavoritesQuery,
  useGetUserGamesQuery,
} from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { GameList } from './components/GameList';
import { Places } from './components/Places';

// import { Upcoming } from './components/Upcoming';

export const HomePage = () => {
  const { user } = useAuthContext();
  const gameListGetState = useGetUserGamesQuery({
    id: user.id,
    timeframe: GameTimeFrame.Upcoming,
    memberStatuses: [GameUserStatus.Allowed, GameUserStatus.Confirmed],
    limit: 3,
  });

  const placeFavoritesGetState = useGetPlaceFavoritesQuery({});

  const gameInvitedListGetState = useGetUserGamesQuery({
    id: user.id,
    timeframe: GameTimeFrame.Upcoming,
    memberStatuses: [GameUserStatus.Invited],
    limit: 3,
  });

  const gameRequestListGetState = useGetUserGamesQuery({
    id: user.id,
    timeframe: GameTimeFrame.Upcoming,
    memberStatuses: [GameUserStatus.Requested, GameUserStatus.Declined],
    limit: 3,
  });

  useSetPageData({ title: 'Старт' });

  return (
    <div>
      <GameList
        header="Мои ближайшие игры"
        list={gameListGetState.data?.items || []}
      />
      <GameList
        header="Меня пригласили"
        list={gameInvitedListGetState.data?.items || []}
      />
      <GameList
        header="Мои запросы"
        list={gameRequestListGetState.data?.items || []}
      />
      <Places places={placeFavoritesGetState.data?.items || []} />
    </div>
  );
};
