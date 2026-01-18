import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default defineConfig(
  // Игнорируемые файлы
  {
    ignores: [
      'dist',
      'build',
      'node_modules',
      '**/generated',
      'prisma.config.ts',
      'prismaClient',
      '__mocks__',
    ],
  },

  // Конфиг для JS конфигов и скриптов
  js.configs.recommended,
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
  },

  // Конфиг для TypeScript файлов
  tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
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
  }
);
