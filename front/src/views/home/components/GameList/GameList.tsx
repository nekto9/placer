import { useNavigate } from 'react-router';
import { Text } from '@gravity-ui/uikit';
import GameCard from '@/components/ui/GameCard';
import { PageBlock } from '@/components/ui/PageBlock';
import { RoutesList } from '@/router/routesList';
import { GameResponseDto } from '@/store/api';

interface GameListProps {
  list: GameResponseDto[];
  header: string;
}

export const GameList = (props: GameListProps) => {
  const navigate = useNavigate();
  const onDetailsClickHandler = (gameId: string) => {
    navigate(RoutesList.Game.getGameDetails(gameId));
  };
  return (
    <PageBlock header={props.header} isCard={!props.list.length}>
      {props.list.length === 0 ? (
        <Text>Нет данных</Text>
      ) : (
        props.list.map((game) => (
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
