import { GamesList } from '@/components/ui/GameList';
import { Loading } from '@/layouts/components';
import { GameTimeFrame, useGetGamesQuery } from '@/store/api';

interface PublicGamesListProps {
  timeFrame?: GameTimeFrame;
}

export const PublicGamesList = (props: PublicGamesListProps) => {
  const gameListGetState = useGetGamesQuery({ timeframe: props.timeFrame });

  return (
    <>
      {gameListGetState.isSuccess && (
        <GamesList data={gameListGetState.data.items} />
      )}
      <Loading isActive={gameListGetState.isLoading} loadingKey="gameList" />
    </>
  );
};
