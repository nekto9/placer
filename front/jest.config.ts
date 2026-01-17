import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from '@jest/types';

/* eslint-disable @typescript-eslint/no-require-imports */
const { compilerOptions } = require('./tsconfig.json');

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    // Обработка CSS/Sass/Stylus — возвращаем пустой объект (identity-obj-proxy)
    '\\.(css|scss|sass|styl|stylus)$': 'identity-obj-proxy',

    // Обработка статических файлов (картинки, шрифты и т.д.)
    '\\.(jpg|jpeg|png|gif|webp|svg|woff|woff2|eot|ttf)$':
      '<rootDir>/__mocks__/fileMock.js',

    // Автоматическое сопоставление путей из tsconfig.json (если есть baseUrl + paths)
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
      prefix: '<rootDir>/',
    }),
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        // Опционально: отключить диагностику типов во время тестов для ускорения
        // isolatedModules: true,
      },
    ],
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};

export default config;
