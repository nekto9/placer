import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';

dotenv.config({ path: '.env' });

export default defineConfig({
  testDir: './tests',
  outputDir: './results/',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Запускаем dev-сервер, если не в CI
  webServer: process.env.CI
    ? undefined
    : {
        command:
          'concurrently "yarn workspace @placer/api start:dev" "yarn workspace @placer/front serve"',
        url: process.env.BASE_URL,
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },

  // Проекты: сначала аутентификация, потом тесты
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'authenticated',
      dependencies: ['setup'],
    },
  ],
});
