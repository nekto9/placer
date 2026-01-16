import { Flex } from '@gravity-ui/uikit';
import UserCard from '@/components/ui/UserCard';
import { GetUsersApiResponse, UserResponseDto } from '@/store/api';

interface UserListProps {
  data: GetUsersApiResponse;
  onDetailsClick: (id: string) => void;
}

export const UserList = (props: UserListProps) => {
  return (
    <Flex direction="column" gap={3}>
      {props.data.items.length > 0 ? (
        props.data.items.map((user: UserResponseDto) => (
          <UserCard
            user={user}
            key={user.id}
            onDetailsClick={props.onDetailsClick}
          />
        ))
      ) : (
        <div>Пользователи не найдены</div>
      )}
    </Flex>
  );
};
