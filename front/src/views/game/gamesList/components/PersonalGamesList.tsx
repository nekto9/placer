import { GamesList } from '@/components/ui/GameList';
import { useAuthContext } from '@/context/useAuthContext';
import { Loading } from '@/layouts/components';
import { GameTimeFrame, useGetUserGamesQuery } from '@/store/api';

interface PersonalGamesListProps {
  timeFrame?: GameTimeFrame;
}

export const PersonalGamesList = (props: PersonalGamesListProps) => {
  const { user } = useAuthContext();

  const userGamesListGetState = useGetUserGamesQuery({
    id: user.id,
    timeframe: props.timeFrame,
  });

  return (
    <>
      {userGamesListGetState.isSuccess && (
        <GamesList data={userGamesListGetState.data.items} />
      )}
      <Loading
        isActive={userGamesListGetState.isLoading}
        loadingKey="gameList"
      />
    </>
  );
};
