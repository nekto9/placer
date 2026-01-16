import { useEffect, useState } from 'react';
// import { Navigate } from 'react-router';
import { getKeycloakInstance } from '@/context/shared/keycloak';

interface ProtectedRouteProps {
  component: () => JSX.Element;
  allowedRoles: string[];
}
export const ProtectedRoute = (props: ProtectedRouteProps) => {
  // Проверка ролей

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRoles = async () => {
      const keycloakInstance = await getKeycloakInstance();

      return props.allowedRoles.some((role) => {
        const result = keycloakInstance.hasRealmRole(role);

        return result;
      });
    };

    checkRoles().then(setHasAccess);
  }, []);

  if (hasAccess === null) return null;

  return hasAccess ? <props.component /> : <div>Нет прав</div>;
};
