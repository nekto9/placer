import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useNotification } from "@/components/Notify";
import { Loading } from "@/layouts/components";
import { RoutesList } from "@/router/routesList";
import { useGetGameByIdQuery, useUpdateGameMutation } from "@/store/api";
import { useSetPageData } from "@/tools/hooks";
import { convertToGameUpdateDto } from "../common/mappers/convertFromViewModel";
import { convertGameToViewModel } from "../common/mappers/convertToViewModel";
import { GameStep1Data, GameViewModel } from "../common/types";
import { GameStep1 } from "./components/GameStep1";
import { GameStep2 } from "./components/GameStep2";

export const GameEditPage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();

  const gameGetState = useGetGameByIdQuery({ id: gameId });

  const [gameUpdateAction, gameUpdateState] = useUpdateGameMutation();

  const { showSuccess, showError } = useNotification();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<GameStep1Data | null>(null);

  const saveFormHandler = async (data: GameViewModel) => {
    try {
      await gameUpdateAction({
        id: data.id,
        updateGameDto: convertToGameUpdateDto(data),
      }).unwrap();

      showSuccess({ message: "Игра сохранена" });
      navigate(RoutesList.Game.getGamesList());
    } catch (err) {
      showError({ message: "Ошибка сохранения игры" });
      console.error(err);
      throw err;
    }
  };

  const handleStep1Next = (data: GameStep1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep2Save = async (fullData: GameViewModel) => {
    await saveFormHandler(fullData);
  };

  useSetPageData({ title: "Игра" });

  const isLoading = gameGetState.isLoading || gameUpdateState.isLoading;

  const gameViewModel = useMemo(() => {
    if (!gameGetState.isSuccess) {
      return null;
    }

    return convertGameToViewModel(gameGetState.data);
  }, [gameGetState.data, gameGetState.isSuccess]);

  const step2ViewModel = useMemo(() => {
    if (!gameViewModel || !step1Data) {
      return null;
    }

    return {
      ...gameViewModel,
      placeId: step1Data.placeId,
      date: step1Data.date,
      timeStart: step1Data.timeStart,
      timeEnd: step1Data.timeEnd,
    };
  }, [gameViewModel, step1Data]);

  return (
    <>
      <Loading isActive={isLoading} loadingKey="gameEditForm" />

      {step2ViewModel && currentStep === 2 && (
        <GameStep2
          data={step2ViewModel}
          step1Data={step1Data}
          onBack={handleStep2Back}
          onSave={handleStep2Save}
        />
      )}

      {gameViewModel && currentStep === 1 && (
        <GameStep1 data={gameViewModel} onNext={handleStep1Next} />
      )}
    </>
  );
};
