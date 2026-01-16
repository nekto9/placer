import type { ConfigFile } from '@rtk-query/codegen-openapi';

// https://redux-toolkit.js.org/rtk-query/usage/code-generation

const config: ConfigFile = {
  schemaFile: 'http://localhost:3000/swagger/json',
  apiFile: './templateApi.ts',
  apiImport: 'templateApi',
  outputFile: '../src/store/api.ts',
  exportName: 'api',
  hooks: true,
  useEnumType: true,
};

export default config;
