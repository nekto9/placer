/* eslint-env node */

export default {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  endOfLine: 'auto',

  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  // This plugin's options
  importOrder: [
    '^@nestjs/', // React и библиотеки
    '^[a-z]', // Сторонние модули (a-z)
    '^@[a-z]', // Scoped пакеты (@scope/...)
    '^@/', // Алиасы (@/components)
    '^[.][.]/', // Родительские директории (../)
    '^[.]/', // Текущая директория (./)
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
  importOrderCaseSensitive: false,
};
