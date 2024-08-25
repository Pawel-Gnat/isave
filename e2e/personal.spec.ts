import { expect } from '@playwright/test';
import { test } from './fixture';

const EXPENSE = {
  name: 'Test expense',
  value: 100,
  'value-edit': 200,
};

test('create, edit and delete personal expense', async ({ page }) => {
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'Transakcje osobiste' }).click({});

  await page.getByRole('button', { name: 'Dodaj wydatek' }).click();
  await page.getByRole('button', { name: 'Utwórz ręcznie' }).click();
  await page.getByRole('button', { name: 'Dodaj nowy wiersz' }).click();
  await page.getByRole('textbox').fill(EXPENSE.name);
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Warzywa' }).click();
  await page.getByRole('spinbutton').fill(EXPENSE.value.toString());
  await page.getByRole('button', { name: 'Zatwierdź' }).click();

  await expect(page.getByText('-100,00 zł').first()).toBeVisible();

  page.getByRole('row', { name: 'Wydatek' }).getByRole('button').first().click();

  await page.getByRole('spinbutton').fill(EXPENSE['value-edit'].toString());
  await page.getByRole('button', { name: 'Zapisz zmiany' }).click();

  await expect(page.getByText('-200,00 zł').first()).toBeVisible();

  page.getByRole('row', { name: 'Wydatek' }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Usuń' }).click();

  await expect(page.getByText(EXPENSE['value-edit'].toString())).not.toBeVisible();
});
