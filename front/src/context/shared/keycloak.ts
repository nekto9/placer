import Keycloak from 'keycloak-js';

let keycloak: Keycloak | null;
let isPending = false;

export const getKeycloakInstance = async (): Promise<Keycloak | null> => {
  if (!keycloak && !isPending) {
    isPending = true;

    const keycloakInstance = new Keycloak({
      url: process.env.AUTH_HOST,
      realm: process.env.KC_REALM,
      clientId: process.env.KC_CLIENT_ID,
    });

    // keycloakInstance.onAuthSuccess = () => {};

    try {
      const isAuth = await keycloakInstance?.init({
        onLoad: 'login-required',
      });
      if (isAuth) {
        keycloak = keycloakInstance;
      } else {
        keycloak = null;
      }
    } catch {
      keycloak = null;
    } finally {
      isPending = false;
    }

    if (keycloak === null) {
      throw new Error('auth error');
    }
  }

  return keycloak;
};

export default keycloak;
