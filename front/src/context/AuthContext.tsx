import { createContext, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Keycloak from 'keycloak-js';
import { getKeycloakInstance } from '@/context/shared/keycloak';
import { useLinkAuthUserMutation, UserResponseDto } from '@/store/api';
import { setAuthUser } from '@/store/slices/profileSlice';
import { AppDispatch, RootState } from '@/store/store';
import { MIN_VALIDITY_KEYCLOAK } from '@/tools/constants';

export interface AuthContextType {
  /** Данные юзера с бэка */
  user?: UserResponseDto;
  /** Метод выхода */
  logout: () => void;
  /** Флаг наличия залогиненного юзера */
  isAuthenticated: boolean;
  /** Флаг заполненного профиля */
  isProfileComplete: boolean;
  /** Обновление информации об авторизованном юзере в рамках приложения
   * (на бэк ничего не уходит, просто данные для вью) */
  setUserData: (user: UserResponseDto) => void;

  keycloakInstance?: Keycloak;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.authUser.user);
  const dispatch = useDispatch<AppDispatch>();

  const [linkAuthUserAction, linkAuthUserState] = useLinkAuthUserMutation();

  const updateTokenOnFocusHandler = () => {
    getKeycloakInstance().then((keycloakInstance) => {
      if (keycloakInstance) {
        keycloakInstance.updateToken(MIN_VALIDITY_KEYCLOAK);
      }
    });
  };

  useEffect(() => {
    getKeycloakInstance().then((keycloakInstance) => {
      if (keycloakInstance) {
        // Если юзер только после регистрации (а она у нас через кейклок),
        // значит он будет создан на основе данных кейклока
        // Если он уже был, то просто вернутся его данные
        linkAuthUserAction({
          userAuthLinkDto: {
            sub: keycloakInstance.tokenParsed.sub,
            username: keycloakInstance.tokenParsed.name,
          },
        })
          .then((res) => {
            dispatch(setAuthUser(res.data));
          })
          .catch(console.error);
      }
    });

    window.addEventListener('focus', updateTokenOnFocusHandler);
    return () => {
      window.removeEventListener('focus', updateTokenOnFocusHandler);
    };
  }, []);

  const logout = async () => {
    const keycloak = await getKeycloakInstance();
    await keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  const setUserData = (user: UserResponseDto) => {
    dispatch(setAuthUser(user));
  };

  const value = {
    user,
    logout,
    isAuthenticated: !!user,
    isProfileComplete: !!user?.username,
    setUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {linkAuthUserState.isSuccess && user ? children : null}
    </AuthContext.Provider>
  );
};
