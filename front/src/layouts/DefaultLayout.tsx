import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageLayout } from '@gravity-ui/navigation';
import { useViewportSize } from '@gravity-ui/uikit';
import { Header } from '@/components/ui/Header';
import {
  DesktopNavigation,
  MobileNavigation,
  useNavigationData,
} from '@/components/ui/Navigation';
import { isDesktop, setViewportSize } from '@/store/slices/viewportSlice';
import { AppDispatch } from '@/store/store';
import { ProfileCheckedRoute } from './ProfileCheckedRoute';

export const DefaultLayout = () => {
  const [compact, setCompact] = React.useState(false);
  const switchCompactHandler = () => setCompact((prev) => !prev);

  const size = useViewportSize();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setViewportSize(size));
  }, [size.width, size.height]);

  const isDesktopMode = useSelector(isDesktop);

  const { navigationItems } = useNavigationData();

  return (
    <>
      {isDesktopMode && (
        <PageLayout compact={compact}>
          <DesktopNavigation
            onSwitch={switchCompactHandler}
            data={navigationItems}
          />
          <PageLayout.Content>
            <div className="g-s__p_4">
              <ProfileCheckedRoute />
            </div>
          </PageLayout.Content>
        </PageLayout>
      )}

      {!isDesktopMode && (
        <div className="g-s__p_4">
          <Header />
          <div style={{ paddingTop: 60, paddingBottom: 60 }}>
            <ProfileCheckedRoute />
          </div>
          <MobileNavigation data={navigationItems} />
        </div>
      )}
    </>
  );
};
