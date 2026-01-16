import { useNavigate } from 'react-router';
import { Text } from '@gravity-ui/uikit';
import GameCard from '@/components/ui/GameCard';
import { PageBlock } from '@/components/ui/PageBlock';
import { RoutesList } from '@/router/routesList';
import { GameResponseDto } from '@/store/api';

interface UpcomingProps {
  games: GameResponseDto[];
}
export const Upcoming = (props: UpcomingProps) => {
  const navigate = useNavigate();
  const onDetailsClickHandler = (gameId: string) => {
    navigate(RoutesList.Game.getGameDetails(gameId));
  };
  return (
    <PageBlock header="Мои ближайшие игры" isCard={!props.games.length}>
      {props.games.length === 0 ? (
        <Text>Нет игр</Text>
      ) : (
        props.games.map((game) => (
          <GameCard
            game={game}
            key={game.id}
            isShort
            onDetailsClick={onDetailsClickHandler}
          />
        ))
      )}
    </PageBlock>
  );
};
