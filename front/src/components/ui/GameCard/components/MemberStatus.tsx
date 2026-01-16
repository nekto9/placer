import { Flex, Label, Text } from '@gravity-ui/uikit';
import { GameUserStatus } from '@/store/api';
import { getMemberStatusLabel } from '../utils';

interface MemberStatusProps {
  memberStatus?: GameUserStatus;
}
export const MemberStatus = (props: MemberStatusProps) => {
  if (props.memberStatus) {
    const memberStatusLabel = getMemberStatusLabel(props.memberStatus);

    return (
      <Flex direction="column" gap={1}>
        <Text variant="caption-2" color="secondary">
          Статус участия
        </Text>
        <Label theme={memberStatusLabel.theme}>{memberStatusLabel.text}</Label>
      </Flex>
    );
  }
  return null;
};
