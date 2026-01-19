export default [
  {
    // Игнорируем всё в корне и выше, кроме front/, api/, e2e/
    ignores: [
      '.vscode/**',
      'lint-staged.config.mjs',
      'eslint.config.js', // сам себя тоже игнорируем, чтобы избежать рекурсии
      '*.json',
      '*.md',
      '*.yml',
      '*.yaml',
      'package.json',
      'pnpm-lock.yaml',
      'node_modules/**',
      'dist/**',
      'build/**',
    ],
  },
];
