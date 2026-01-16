import { Fragment, useState } from 'react';
import { Button, Divider, Flex, Label, Loader, Text } from '@gravity-ui/uikit';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { getMemberStatusLabel } from '@/components/ui/GameCard/utils';
import { PageBlock } from '@/components/ui/PageBlock';
import {
  GameUserStatus,
  useAllowJoinMutation,
  useDeclineJoinMutation,
} from '@/store/api';
import { GameViewModel } from '../../common/types';

interface GameMembersProps {
  data: GameViewModel;
}
export const GameMembers = (props: GameMembersProps) => {
  // Окно принятия запроса (в стейте хранится id пользователя либо пустота)
  const [allowJoinOpen, setAllowJoinOpen] = useState('');
  const [allowJoinAction, allowJoinState] = useAllowJoinMutation();

  const allowJoinHandler = (userId: string) => {
    setAllowJoinOpen(userId);
  };

  const cancelAllowJoinHandler = () => {
    setAllowJoinOpen('');
  };

  const confirmAllowJoinHandler = () => {
    allowJoinAction({ id: props.data.id, userId: allowJoinOpen });
    cancelAllowJoinHandler();
  };

  // Окно отклонения запроса (в стейте хранится id пользователя либо пустота)
  const [declineJoinOpen, setDeclineJoinOpen] = useState('');
  const [declineJoinAction, declineJoinState] = useDeclineJoinMutation();

  const declineJoinHandler = (userId: string) => {
    setDeclineJoinOpen(userId);
  };

  const cancelDeclineJoinHandler = () => {
    setDeclineJoinOpen('');
  };

  const confirmDeclineJoinHandler = () => {
    declineJoinAction({ id: props.data.id, userId: declineJoinOpen });
    cancelDeclineJoinHandler();
  };

  return (
    <>
      {(allowJoinState.isLoading || declineJoinState.isLoading) && <Loader />}

      <PageBlock isCard header="Участники">
        {props.data.gameUsers.length === 0 ? (
          <Text>Нет данных</Text>
        ) : (
          props.data.gameUsers.map((user, idx) => {
            const userStatus = user.status[0] as GameUserStatus;
            const userStatusLabel = getMemberStatusLabel(userStatus);
            return (
              <Fragment key={user.userId}>
                {idx > 0 && <Divider className="g-s__mt_4 g-s__mb_4" />}
                <Flex gapRow={2} gap={4} key={user.userId}>
                  <Text>{user.userName}</Text>
                  <Label theme={userStatusLabel.theme}>
                    {userStatusLabel.text}
                  </Label>
                  {userStatus === GameUserStatus.Requested && (
                    <>
                      <Button onClick={() => allowJoinHandler(user.userId)}>
                        Принять
                      </Button>
                      <Button onClick={() => declineJoinHandler(user.userId)}>
                        Отклонить
                      </Button>
                    </>
                  )}
                </Flex>
              </Fragment>
            );
          })
        )}
      </PageBlock>

      <ConfirmModal
        open={!!allowJoinOpen}
        onConfirm={confirmAllowJoinHandler}
        onClose={cancelAllowJoinHandler}
      >
        Принять запрос от пользователя
      </ConfirmModal>

      <ConfirmModal
        open={!!declineJoinOpen}
        onConfirm={confirmDeclineJoinHandler}
        onClose={cancelDeclineJoinHandler}
      >
        Отклонить запрос от пользователя
      </ConfirmModal>
    </>
  );
};
