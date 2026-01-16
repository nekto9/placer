import { Card, User } from '@gravity-ui/uikit';
import { UserResponseDto } from '@/store/api';

interface UserInfoProps {
  user: UserResponseDto;
}
export const UserInfo = (props: UserInfoProps) => {
  return (
    <Card className="g-s__p_2">
      <User
        avatar={
          props.user.avatar
            ? { imgUrl: props.user.avatar }
            : { text: props.user.username, theme: 'brand' }
        }
        name={props.user.username}
        description="мастер"
        size="xl"
      />
    </Card>
  );
};
