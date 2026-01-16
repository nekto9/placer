import { Navigate, useParams } from 'react-router';
import { Loading } from '@/layouts/components';
import { RoutesListGame } from '@/router/routesPath/routesListGame';
import { useAcceptInviteMutation } from '@/store/api';

type gameActionType = 'accept' | 'reject' | 'allow' | 'decline';

interface GameActionProps {
  action: gameActionType;
}

/** Используется только для прямых ссылок снаружи */
export const GameAction = (props: GameActionProps) => {
  const { gameId } = useParams();
  const [acceptInviteAction, acceptInviteState] = useAcceptInviteMutation();

  if (props.action === 'accept') {
    acceptInviteAction({ id: gameId });
  }

  const isLoading = acceptInviteState.isLoading;
  return isLoading ? (
    <Loading />
  ) : (
    <Navigate to={RoutesListGame.getGameDetails(gameId)} />
  );
};
