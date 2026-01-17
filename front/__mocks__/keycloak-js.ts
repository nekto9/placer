const mockKeycloak = jest.fn().mockImplementation(() => ({
  init: jest.fn().mockResolvedValue(true),
  login: jest.fn(),
  logout: jest.fn(),
  updateToken: jest.fn().mockResolvedValue(true),
  token: 'mocked-jwt-token',
  authenticated: true,
}));

// Экспортируем как default и именованный экспорт (на случай, если используется так)
export default mockKeycloak;

// Если в коде используется именованный импорт (редко, но возможно):
export const Keycloak = mockKeycloak;
