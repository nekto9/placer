import { test as setup } from '@playwright/test';

const USERNAME = process.env.E2E_USERNAME;
const PASSWORD = process.env.E2E_PASSWORD;

setup('authenticate', async ({ page }) => {
  // Идём на главную — нас отправит на Keycloak
  await page.goto('/');

  // Ждём появления формы логина Keycloak
  await page.waitForSelector('#username');

  // Вводим креды
  await page.fill('#username', USERNAME!);
  await page.fill('#password', PASSWORD!);
  await page.click('#kc-login');

  // Ждём, пока вернёмся на основной сайт
  await page.waitForURL('/');

  // Сохраняем куки и storage
  await page.context().storageState({ path: 'state/.auth/user.json' });
});
