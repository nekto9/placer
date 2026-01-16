import { useState } from 'react';
import { CircleRuble } from '@gravity-ui/icons';
import { Button, Flex, Icon, Label, Text } from '@gravity-ui/uikit';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import {
  formatDate,
  getGameLevelLabel,
  getMemberStatusLabel,
  getRequestModeLabel,
  weekdayDate,
} from '@/components/ui/GameCard/utils';
import { PageBlock } from '@/components/ui/PageBlock';
import { GameLevel, GameUserStatus } from '@/store/api';
import { timeConvertToFormattedString } from '@/tools/dateTools';
import { GameViewModel } from '../../common/types';
import { GameMembers } from './GameMembers';

interface GameDetailsProps {
  data: GameViewModel;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onJoinClick: () => void;
  onUnJoinClick: () => void;
}

export const GameDetails = (props: GameDetailsProps) => {
  // Окно подтверждения удаления игры
  const [deleteGameOpen, setDeleteGameOpen] = useState(false);
  const deleteGameHandler = () => {
    setDeleteGameOpen(true);
  };

  const confirmDeleteHandler = () => {
    setDeleteGameOpen(false);
    props.onDeleteClick();
  };

  const cancelDeleteHandler = () => {
    setDeleteGameOpen(false);
  };

  // Окно подтверждения присоединения к игре
  const [joinGameOpen, setJoinGameOpen] = useState(false);
  const joinClickHandler = () => {
    setJoinGameOpen(true);
  };

  const confirmJoinHandler = () => {
    setJoinGameOpen(false);
    props.onJoinClick();
  };

  const cancelJoinHandler = () => {
    setJoinGameOpen(false);
  };

  // Окно подтверждения отказа от участия
  const [unJoinGameOpen, setUnJoinGameOpen] = useState(false);

  const confirmUnJoinHandler = () => {
    setUnJoinGameOpen(false);
    props.onUnJoinClick();
  };

  const cancelUnJoinHandler = () => {
    setUnJoinGameOpen(false);
  };

  const unJoinClickHandler = () => {
    setUnJoinGameOpen(true);
  };

  const gameLevelLabel = getGameLevelLabel(props.data.level[0] as GameLevel);
  const memberStatusLabel = props.data.meta?.memberStatus
    ? getMemberStatusLabel(props.data.meta.memberStatus)
    : null;

  const gameModeLabel = getRequestModeLabel(props.data.requestMode);

  return (
    <>
      <PageBlock isCard>
        <Flex justifyContent="space-between" alignItems="center">
          <Text variant="subheader-2">{props.data.place.name}</Text>
          {!props.data.place.isFree && <Icon data={CircleRuble} />}
        </Flex>

        <Flex gapRow={2} gap={4} wrap className="g-s__mt_2">
          <Flex direction="column" gap={1}>
            <Text variant="caption-2" className="text--capitalize">
              {weekdayDate(props.data.date)}
            </Text>
            <Text>{formatDate(props.data.date)}</Text>
          </Flex>

          <Flex direction="column" gap={1}>
            <Text variant="caption-2" color="secondary">
              Время
            </Text>
            <Text>
              {timeConvertToFormattedString(props.data.timeStart)} -{' '}
              {timeConvertToFormattedString(props.data.timeEnd)}
            </Text>
          </Flex>

          {!!props.data.sport && (
            <Flex direction="column" gap={1}>
              <Text variant="caption-2" color="secondary">
                Спорт
              </Text>
              <Text>{props.data.sport.name}</Text>
            </Flex>
          )}

          <Flex direction="column" gap={1}>
            <Text variant="caption-2" color="secondary">
              Уровень
            </Text>
            <Label theme={gameLevelLabel.theme}>{gameLevelLabel.text}</Label>
          </Flex>

          {!!memberStatusLabel && (
            <Flex direction="column" gap={1}>
              <Text variant="caption-2" color="secondary">
                Статус участия
              </Text>
              <Label theme={memberStatusLabel.theme}>
                {memberStatusLabel.text}
              </Label>
            </Flex>
          )}

          <Flex direction="column" gap={1}>
            <Text variant="caption-2" color="secondary">
              Режим
            </Text>
            <Label theme={gameModeLabel.theme}>{gameModeLabel.text}</Label>
          </Flex>
        </Flex>
      </PageBlock>

      {(!!props.data.meta?.canJoin ||
        (!!props.data.meta?.isMember &&
          !props.data.meta?.canEdit &&
          props.data.meta.memberStatus !== GameUserStatus.Declined)) && (
        <PageBlock isCard>
          {!!props.data.meta?.canJoin && (
            <Button onClick={joinClickHandler} style={{ marginRight: 10 }}>
              Присоединиться
            </Button>
          )}
          {!!props.data.meta?.isMember &&
            !props.data.meta?.canEdit &&
            props.data.meta.memberStatus !== GameUserStatus.Declined && (
              <Button onClick={unJoinClickHandler} style={{ marginRight: 10 }}>
                Отказаться
              </Button>
            )}

          {!!props.data.meta?.isMember &&
            !props.data.meta?.canEdit &&
            props.data.meta.memberStatus === GameUserStatus.Invited && (
              <Button onClick={joinClickHandler} style={{ marginRight: 10 }}>
                Принять приглашение
              </Button>
            )}
        </PageBlock>
      )}

      {!!props.data.meta?.canEdit && (
        <PageBlock isCard>
          <Button onClick={props.onEditClick} style={{ marginRight: 10 }}>
            Редактировать
          </Button>

          <Button onClick={deleteGameHandler}>Удалить</Button>
        </PageBlock>
      )}

      {!!props.data.meta?.canEdit && <GameMembers data={props.data} />}

      <ConfirmModal
        open={deleteGameOpen}
        onConfirm={confirmDeleteHandler}
        onClose={cancelDeleteHandler}
      >
        Удалить игру
      </ConfirmModal>

      <ConfirmModal
        open={joinGameOpen}
        onConfirm={confirmJoinHandler}
        onClose={cancelJoinHandler}
      >
        Принять участие
      </ConfirmModal>

      <ConfirmModal
        open={unJoinGameOpen}
        onConfirm={confirmUnJoinHandler}
        onClose={cancelUnJoinHandler}
      >
        Отказаться от участия
      </ConfirmModal>
    </>
  );
};
