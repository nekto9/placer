import { RangeDatePicker, RangeValue } from '@gravity-ui/date-components';
import { dateTime, DateTime } from '@gravity-ui/date-utils';
import { Button, Flex, Select } from '@gravity-ui/uikit';
import { GameStatus, GameUserRole, GameUserStatus } from '@/store/api';
import { DATE_VIEW_FORMAT } from '@/tools/constants';

interface UserGamesFiltersProps {
  userRole?: GameUserRole;
  userStatus?: GameUserStatus;
  gameStatus?: GameStatus;
  dateFrom?: string;
  dateTo?: string;
  onUserRoleChange: (value?: GameUserRole) => void;
  onUserStatusChange: (value?: GameUserStatus) => void;
  onGameStatusChange: (value?: GameStatus) => void;
  onDateRangeChange: (value?: RangeValue<DateTime>) => void;
  onClearFilters: () => void;
}

const userStatusOptions = [
  { value: '', label: 'Все статусы участника' },
  { value: GameUserStatus.Invited, label: 'Приглашен' },
  { value: GameUserStatus.Confirmed, label: 'Подтвердил участие' },
  { value: GameUserStatus.Rejected, label: 'Отказался от приглашения' },
  { value: GameUserStatus.Requested, label: 'Запросил приглашение' },
  { value: GameUserStatus.Allowed, label: 'Одобрен' },
  { value: GameUserStatus.Declined, label: 'Отклонен' },
];

const userRoleOptions = [
  { value: '', label: 'Все роли участника' },
  { value: GameUserRole.Creator, label: 'Создатель' },
  { value: GameUserRole.Member, label: 'Участник' },
];

const gameStatusOptions = [
  { value: '', label: 'Все статусы игр' },
  { value: GameStatus.Draft, label: 'Черновик' },
  { value: GameStatus.Aproved, label: 'Подтвержденная' },
];

export const UserGamesFilters = (props: UserGamesFiltersProps) => {
  const updateRangeDateHandler = (value: RangeValue<DateTime>) => {
    props.onDateRangeChange(value);
  };

  const clearFiltersHandler = () => {
    props.onClearFilters();
  };

  return (
    <Flex direction="column" gap={3}>
      <Flex gap={3} wrap>
        <Select
          label="Роль участника"
          value={[props.userRole || '']}
          onUpdate={(value) =>
            props.onUserRoleChange((value[0] as GameUserRole) || undefined)
          }
        >
          {userRoleOptions.map((el) => (
            <Select.Option value={el.value} key={el.value}>
              {el.label}
            </Select.Option>
          ))}
        </Select>

        <Select
          label="Статус участника"
          value={[props.userStatus || '']}
          onUpdate={(value) =>
            props.onUserStatusChange((value[0] as GameUserStatus) || undefined)
          }
        >
          {userStatusOptions.map((el) => (
            <Select.Option value={el.value} key={el.value}>
              {el.label}
            </Select.Option>
          ))}
        </Select>

        <Select
          label="Статус игры"
          value={[props.gameStatus || '']}
          onUpdate={(value) =>
            props.onGameStatusChange((value[0] as GameStatus) || undefined)
          }
        >
          {gameStatusOptions.map((el) => (
            <Select.Option value={el.value} key={el.value}>
              {el.label}
            </Select.Option>
          ))}
        </Select>

        <RangeDatePicker
          onUpdate={updateRangeDateHandler}
          format={DATE_VIEW_FORMAT}
          value={
            props.dateFrom && props.dateTo
              ? {
                  start: dateTime({ input: props.dateFrom }),
                  end: dateTime({ input: props.dateTo }),
                }
              : null
          }
        />
      </Flex>

      <Flex gap={2}>
        <Button onClick={clearFiltersHandler} view="outlined">
          Сбросить фильтры
        </Button>
      </Flex>
    </Flex>
  );
};
