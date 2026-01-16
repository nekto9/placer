import { useState } from 'react';
import { Dialog, TextInput } from '@gravity-ui/uikit';
import { Loading } from '@/layouts/components';
import {
  GameUserDto,
  GameUserRole,
  GameUserStatus,
  useGetUsersQuery,
  UserResponseDto,
} from '@/store/api';
import { debounce } from '@/tools/debounce';

interface UserSearchModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (user: GameUserDto) => void;
  selectedUsers?: string[];
}

export const UserSearchModal = (props: UserSearchModalProps) => {
  const dialogTitleId = 'app-confirmation-dialog-title';

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = debounce(setSearchQuery, 500);

  const searchChangeHandler = (value: string) => {
    // value.length > 2 &&
    debouncedSearch(value);
  };

  const userListGetState = useGetUsersQuery({ text: searchQuery });

  const selectUserHandler = (user: UserResponseDto) => {
    props.onConfirm({
      userName: user.username,
      userId: user.id,
      role: GameUserRole.Member,
      status: GameUserStatus.Invited,
    });
    props.onClose();
  };

  return (
    <Dialog
      size="s"
      onClose={props.onClose}
      open={props.open}
      // onEnterKeyDown={() => {
      //   alert('onEnterKeyDown');
      // }}
      aria-labelledby={dialogTitleId}
    >
      <Dialog.Header caption="Выбор пользователя" id={dialogTitleId} />
      <Dialog.Body>
        <TextInput
          onUpdate={searchChangeHandler}
          placeholder={'Поиск'}
          style={{ marginBottom: 20 }}
        />
        <Loading isActive={userListGetState.isFetching} loadingKey="userList" />
        {userListGetState.isSuccess &&
          userListGetState.data.items
            .filter((user) => !props.selectedUsers?.includes(user.id))
            .map((user: UserResponseDto) => (
              <div key={user.id} onClick={() => selectUserHandler(user)}>
                {user.username}
              </div>
            ))}
      </Dialog.Body>
      <Dialog.Footer
        onClickButtonCancel={props.onClose}
        // onClickButtonApply={props.onConfirm}
        // textButtonApply="Продолжить"
        textButtonCancel="Отмена"
      />
    </Dialog>
  );
};
