import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loading } from '@/layouts/components';
import { RoutesList } from '@/router/routesList';
import {
  useDeleteGameMutation,
  useGetGameByIdQuery,
  useRequestJoinMutation,
  useUnJoinMutation,
} from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { convertGameToViewModel } from '../common/mappers/convertToViewModel';
import { GameDetails } from './components/GameDetails';

export const GameDetailsPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [reguestJoinAction, reguestJoinState] = useRequestJoinMutation();
  const [unJoinAction, unJoinState] = useUnJoinMutation();

  const gameGetState = useGetGameByIdQuery({ id: gameId });

  const [gameDeleteAction, gameDeleteState] = useDeleteGameMutation();

  const editClickHandler = () => {
    navigate(RoutesList.Game.getGameEdit(gameId));
  };

  const deleteClickHandler = () => {
    gameDeleteAction({ id: gameId });
  };

  const requestJoinHandler = () => {
    reguestJoinAction({ id: gameId });
  };

  const unJoinHandler = () => {
    unJoinAction({ id: gameId });
  };

  useEffect(() => {
    if (gameDeleteState.isSuccess) {
      navigate(RoutesList.Game.getGamesList());
    }
  }, [gameDeleteState.isSuccess]);

  useSetPageData({ title: 'Игра' });

  const isLoading =
    gameGetState.isLoading ||
    gameDeleteState.isLoading ||
    reguestJoinState.isLoading ||
    unJoinState.isLoading;

  return (
    <>
      <Loading isActive={isLoading} loadingKey="gameDetails" />
      {gameGetState.isSuccess && (
        <GameDetails
          data={convertGameToViewModel(gameGetState.data)}
          onEditClick={editClickHandler}
          onDeleteClick={deleteClickHandler}
          onJoinClick={requestJoinHandler}
          onUnJoinClick={unJoinHandler}
        />
      )}
    </>
  );
};
