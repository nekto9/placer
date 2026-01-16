import { useState } from 'react';
import { Button, Flex, Pagination, Spin, Text } from '@gravity-ui/uikit';
import GameCard from '@/components/ui/GameCard';
import {
  GameStatus,
  GameUserRole,
  GameUserStatus,
  useGetUserGamesQuery,
} from '@/store/api';
import { DATE_SERV_FORMAT } from '@/tools/constants';
import { UserGamesFilters } from './UserGamesFilters';

interface UserGamesListProps {
  userId: string;
}

export const UserGamesList = ({ userId }: UserGamesListProps) => {
  const [filters, setFilters] = useState({
    userRole: undefined as GameUserRole | undefined,
    userStatus: undefined as GameUserStatus | undefined,
    gameStatus: undefined as GameStatus | undefined,
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error, refetch } = useGetUserGamesQuery({
    id: userId,
    ...filters,
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Сбрасываем на первую страницу при изменении фильтров
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      userRole: undefined,
      userStatus: undefined,
      gameStatus: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (isLoading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: 200 }}
      >
        <Spin size="l" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" gap={3} alignItems="center">
        <Text color="danger">Ошибка загрузки игр</Text>
        <Button onClick={() => refetch()}>Повторить</Button>
      </Flex>
    );
  }

  const games = data?.items || [];
  const meta = data?.meta;

  return (
    <Flex direction="column" gap={4}>
      <Text variant="header-1">Мои игры</Text>

      <UserGamesFilters
        userRole={filters.userRole}
        userStatus={filters.userStatus}
        gameStatus={filters.gameStatus}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onUserRoleChange={(value) => handleFilterChange({ userRole: value })}
        onUserStatusChange={(value) =>
          handleFilterChange({ userStatus: value })
        }
        onGameStatusChange={(value) =>
          handleFilterChange({ gameStatus: value })
        }
        onDateRangeChange={(value) =>
          handleFilterChange({
            dateFrom: value.start
              ? value.start.format(DATE_SERV_FORMAT)
              : undefined,
            dateTo: value.end ? value.end.format(DATE_SERV_FORMAT) : undefined,
          })
        }
        onClearFilters={handleClearFilters}
      />

      {games.length === 0 ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: 200 }}
        >
          <Text color="secondary">Игры не найдены</Text>
        </Flex>
      ) : (
        <>
          <Flex direction="column" gap={3}>
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </Flex>

          {meta && meta.pages > 1 && (
            <Flex justifyContent="center">
              <Pagination
                page={meta.page}
                pageSize={meta.limit}
                total={meta.total}
                onUpdate={handlePageChange}
              />
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};
