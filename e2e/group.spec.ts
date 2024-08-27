import { expect } from '@playwright/test';
import { test } from './fixture';

test('create and delete group budget', async ({ page }) => {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(10000);
  await page.getByRole('link', { name: 'Transakcje grupowe' }).click({});

  await page.getByRole('button', { name: 'Stwórz grupowy budżet' }).click();
  await page.getByRole('textbox').fill('Test budget');
  await page.getByRole('button', { name: 'Utwórz' }).click();

  await page.waitForTimeout(10000);
  await expect(page.getByRole('link', { name: 'Test budget' }).first()).toBeVisible();

  await page
    .locator('div')
    .filter({ hasText: /^Test budget$/ })
    .first()
    .getByRole('button')
    .click();
  await page.getByRole('button', { name: 'Usuń' }).click();

  await expect(page.getByRole('link', { name: 'Test budget' }).first()).not.toBeVisible();
});
