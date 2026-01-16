import { useNavigate } from 'react-router';
import { Flex } from '@gravity-ui/uikit';
import GameCard from '@/components/ui/GameCard';
import { RoutesList } from '@/router/routesList';
import { GameResponseDto } from '@/store/api';

interface GamesListProps {
  data: GameResponseDto[];
}

export const GamesList = (props: GamesListProps) => {
  const navigate = useNavigate();

  const detailsClickHandler = (gameId: string) => {
    navigate(RoutesList.Game.getGameDetails(gameId));
  };

  return (
    <Flex direction="column" gap={3}>
      {props.data.map((game: GameResponseDto) => (
        <GameCard
          game={game}
          key={game.id}
          onDetailsClick={detailsClickHandler}
        />
      ))}
    </Flex>
  );
};
