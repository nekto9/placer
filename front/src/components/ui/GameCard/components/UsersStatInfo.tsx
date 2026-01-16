import { Flex, Text } from '@gravity-ui/uikit';
import { GameResponseDto, GameUserStatus } from '@/store/api';

interface UsersStatInfoProps {
  game: GameResponseDto;
}
export const UsersStatInfo = (props: UsersStatInfoProps) => {
  const confirmedUsersCount = props.game.gameUsers.filter((user) =>
    [GameUserStatus.Allowed, GameUserStatus.Confirmed].includes(user.status)
  ).length;

  const requestedUsersCount = props.game.gameUsers.filter((user) =>
    [GameUserStatus.Requested].includes(user.status)
  ).length;

  const invitedUsersCount = props.game.gameUsers.filter((user) =>
    [GameUserStatus.Invited].includes(user.status)
  ).length;

  return (
    <Flex gapRow={2} gap={4} wrap className="g-s__mt_2">
      <Flex direction="column" gap={1}>
        <Text variant="caption-2" color="secondary">
          минимум
        </Text>
        <Text>{props.game.countMembersMin}</Text>
      </Flex>
      <Flex direction="column" gap={1}>
        <Text variant="caption-2" color="secondary">
          максимум
        </Text>
        <Text>{props.game.countMembersMax}</Text>
      </Flex>
      <Flex direction="column" gap={1}>
        <Text variant="caption-2" color="secondary">
          подтверждено
        </Text>
        <Text>{confirmedUsersCount}</Text>
      </Flex>
      <Flex direction="column" gap={1}>
        <Text variant="caption-2" color="secondary">
          запросы
        </Text>
        <Text>{requestedUsersCount}</Text>
      </Flex>
      <Flex direction="column" gap={1}>
        <Text variant="caption-2" color="secondary">
          приглашены
        </Text>
        <Text>{invitedUsersCount}</Text>
      </Flex>
    </Flex>
  );
};
