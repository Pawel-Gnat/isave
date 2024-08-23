import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    await page.addInitScript(() => {
      (window as any).Playwright = true;
    });

    await page.goto('/auth');

    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Hasło').fill('test');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();

    use(page);
  },
});

export { expect } from '@playwright/test';
