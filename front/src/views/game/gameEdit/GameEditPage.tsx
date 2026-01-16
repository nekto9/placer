import { useParams } from 'react-router';
import { useNotification } from '@/components/Notify';
import { Loading } from '@/layouts/components';
import { useGetGameByIdQuery, useUpdateGameMutation } from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { convertToGameUpdateDto } from '../common/mappers/convertFromViewModel';
import { convertGameToViewModel } from '../common/mappers/convertToViewModel';
import { GameViewModel } from '../common/types';
import { GameEditForm } from './components/GameEditForm';

export const GameEditPage = () => {
  const { gameId } = useParams();

  const gameGetState = useGetGameByIdQuery({ id: gameId });

  const [gameUpdateAction, gameUpdateState] = useUpdateGameMutation();

  const { showSuccess, showError } = useNotification();

  const saveFormHandler = async (data: GameViewModel) => {
    try {
      await gameUpdateAction({
        id: gameId,
        updateGameDto: convertToGameUpdateDto(data),
      }).unwrap();

      showSuccess({ message: 'Игра сохранена' });
    } catch (err) {
      showError({ message: 'Ошибка сохранения игры' });
      console.error(err);
    }
  };

  useSetPageData({ title: 'Игра' });

  return (
    <>
      <Loading
        isActive={gameGetState.isLoading || gameUpdateState.isLoading}
        loadingKey="gameEditForm"
      />

      {gameGetState.isSuccess && (
        <GameEditForm
          key={gameUpdateState.fulfilledTimeStamp}
          data={convertGameToViewModel(gameGetState.data)}
          onSave={saveFormHandler}
        />
      )}
    </>
  );
};
