import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
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
      'webpack.config.ts',
      'src/store/api.ts',
    ],
  },
  // Базовый JS конфиг
  js.configs.recommended,
  ...tseslint.configs.recommended,

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
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },

  // Конфиг для TypeScript файлов
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      react: react,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...react.configs.recommended.rules,

      // React specific rules
      'react/react-in-jsx-scope': 'off',
      // 'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      // 'react-refresh/only-export-components': [
      //   'warn',
      //   { allowConstantExport: true },
      // ],

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-empty-object-type': 'warn',

      // Code quality rules
      // 'complexity': ['warn', 10],
      // 'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
      // 'max-depth': ['warn', 4],
      // 'max-params': ['warn', 4],

      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
