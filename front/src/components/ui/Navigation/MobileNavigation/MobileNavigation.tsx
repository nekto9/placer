import { useNavigate } from 'react-router';
import { House } from '@gravity-ui/icons';
import { MenuItem } from '@gravity-ui/navigation';
import { Flex, Icon, Text } from '@gravity-ui/uikit';
import { RoutesList } from '@/router/routesList';

interface MobileNavigationProps {
  data: MenuItem[];
}

export const MobileNavigation = (props: MobileNavigationProps) => {
  const navigate = useNavigate();
  const homeClickHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(RoutesList.Root);
  };

  return (
    <div className="mobile-navigation">
      <Flex direction="row" gap={2} justifyContent="space-between">
        {/* <Card
          type="selection"
          style={{ textAlign: 'center' }}
          className="g-s__p_2"
          view="clear"
          onClick={homeClickHandler}
        >
          <Icon data={House} size={24} />
          <div>
            <Text variant="caption-2">Настройки</Text>
          </div>
        </Card> */}
        <div style={{ textAlign: 'center' }} onClick={homeClickHandler}>
          <Icon data={House} size={24} />
          <div>
            <Text variant="caption-2">Старт</Text>
          </div>
        </div>
        {props.data.map((item) => (
          <div
            key={item.id}
            style={{ textAlign: 'center' }}
            onClick={(e) => item.onItemClick(item, false, e)}
          >
            <Icon data={item.icon} size={24} />
            <div>
              <Text variant="caption-2">{item.title}</Text>
            </div>
          </div>
        ))}
      </Flex>
    </div>
  );
};
