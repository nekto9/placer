import { expect, test } from '@playwright/test';

test.use({ storageState: 'state/.auth/user.json' });

test('пользователь может зайти на главную', async ({ page }) => {
  await page.goto('/');

  // Проверяем, что мы внутри — например, есть заголовок
  await expect(page.getByText('Мои ближайшие игры')).toBeVisible();
});
