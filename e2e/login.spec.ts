import { test, expect } from '@playwright/test';

test('login to an app', async ({ page }) => {
  await page.goto('/auth');

  await page.getByLabel('Email').fill('test@test.com');
  await page.getByLabel('Hasło').fill('test');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await page.waitForURL('/');

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('banner').getByText('Konto testowe')).toBeVisible();
});
