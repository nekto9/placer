import '@testing-library/jest-dom';

// Мокаем fetch глобально (для подавления предупреждений)
global.fetch = jest.fn();

// Мокаем localStorage глобально (для подавления предупреждений)
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};

// Мокаем sessionStorage глобально (для подавления предупреждений)
global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};
