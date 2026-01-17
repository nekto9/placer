import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // Игнорируемые файлы
  {
    ignores: ['playwright-report', 'results', 'state'],
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
  }
);
