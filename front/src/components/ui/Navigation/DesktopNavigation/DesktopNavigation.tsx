import React from 'react';
import { useNavigate } from 'react-router';
import { Aperture } from '@gravity-ui/icons';
import { MenuItem, PageLayoutAside } from '@gravity-ui/navigation';
import { RoutesList } from '@/router/routesList';

interface DesktopNavigationProps {
  onSwitch: () => void;
  data: MenuItem[];
}

export const DesktopNavigation = (props: DesktopNavigationProps) => {
  const navigate = useNavigate();

  const homeClickHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(RoutesList.Root);
  };

  return (
    <PageLayoutAside
      logo={{
        text: 'Placer',
        icon: Aperture,
        onClick: homeClickHandler,
      }}
      menuItems={props.data}
      onChangeCompact={props.onSwitch}
    />
  );
};
