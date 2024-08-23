import { expect } from '@playwright/test';
import { test } from './fixture';

test('add personal expense', async ({ page }) => {
  await page.getByRole('link', { name: 'Transakcje osobiste' }).click();
  await page.getByRole('button', { name: 'Dodaj wydatek' }).click();
});
