import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthContext } from '@/context/useAuthContext';
import { RoutesList } from '@/router/routesList';

// Не пускаем во вьюхи, если не заполнен профиль
export const ProfileCheckedRoute = () => {
  const { isProfileComplete } = useAuthContext();

  const profilePath = RoutesList.Profile.getUserProfile();
  const location = useLocation();

  if (profilePath !== location.pathname && !isProfileComplete) {
    return <Navigate to={RoutesList.Profile.getUserProfile()} replace />;
  }

  return <Outlet />;
};
