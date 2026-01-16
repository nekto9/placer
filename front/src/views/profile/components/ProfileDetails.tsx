import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button, Flex, User } from '@gravity-ui/uikit';
import { PageBlock } from '@/components/ui/PageBlock';
import { getKeycloakInstance } from '@/context/shared/keycloak';
import { RoutesList } from '@/router/routesList';
import { UserProfileViewModel } from '../types';

interface ProfileDetailsProps {
  data: UserProfileViewModel;
  onEdit: () => void;
  logout: () => void;
  /** Связь с акканутом телеги */
  onLink: () => void;
  /** Удаление связи с акканутом телеги */
  onUnlink: () => void;
  /** Обработчик загрузки аватара */
  onAvatarUpload?: (response: { filename: string; path: string }) => void;
}

export const ProfileDetails = (props: ProfileDetailsProps) => {
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const keycloakInstance = await getKeycloakInstance();
      const result = keycloakInstance.hasRealmRole('place-manager');
      return result;
    };

    checkRole().then(setIsManager);
  }, []);

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="column" gap={4}>
        <User
          avatar={
            props.data.avatar
              ? { imgUrl: props.data.avatar.url }
              : { text: props.data.username, theme: 'brand' }
          }
          name={props.data.username}
          size="xl"
        />

        <Flex gap={4} wrap>
          <Button onClick={props.onEdit} size="l">
            Редактировать
          </Button>
          <Button onClick={props.logout} size="l">
            Выйти
          </Button>
          {!props.data.telegramId ? (
            <Button onClick={props.onLink} size="l">
              Привязать Телеграм
            </Button>
          ) : (
            <Button onClick={props.onUnlink} size="l">
              Отвязать Телеграм
            </Button>
          )}
        </Flex>
      </Flex>
      {isManager && (
        <PageBlock isCard>
          <Link to={RoutesList.Manage.getManage()}>Управление</Link>
        </PageBlock>
      )}
    </Flex>
  );
};
