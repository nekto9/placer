import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  // Игнорируемые файлы
  {
    ignores: [
      'dist',
      'build',
      'node_modules',
      '**/generated',
      'prisma.config.ts',
      'prismaClient',
    ],
  },

  // Базовый JS конфиг
  js.configs.recommended,

  // Конфиг для TypeScript файлов
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/prefer-const': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      'prefer-const': 'error',
    },
  },

  // Конфиг для JS конфигов и скриптов
  {
    files: [
      '*.config.js',
      '*.config.cjs',
      '*.config.mjs',
      'scripts/**/*.js',
      'scripts/**/*.cjs',
      'scripts/**/*.mjs',
    ],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
    },
  }
);
