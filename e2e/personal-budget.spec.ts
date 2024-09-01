import { expect } from '@playwright/test';
import { test } from './fixture/fixture';
import { test as mockTest } from './mocks/test';

const EXPENSE = {
  name: 'Test expense',
  value: 100,
  'value-edit': 200,
};

test('create, edit and delete personal expense (manual)', async ({ page }) => {
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'Transakcje osobiste' }).click({});
  await page.waitForURL('/personal');

  await page.getByRole('button', { name: 'Dodaj wydatek' }).click();
  await page.getByRole('button', { name: 'Utwórz ręcznie' }).click();
  await page.getByRole('button', { name: 'Dodaj nowy wiersz' }).click();
  await page.getByRole('textbox').fill(EXPENSE.name);
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Warzywa' }).click();
  await page.getByRole('spinbutton').fill(EXPENSE.value.toString());
  await page.getByRole('button', { name: 'Zatwierdź' }).click();

  await expect(page.getByText('-100,00 zł').first()).toBeVisible();

  await page.getByRole('row', { name: 'Wydatek' }).getByRole('button').first().click();

  await page.getByRole('spinbutton').fill(EXPENSE['value-edit'].toString());
  await page.getByRole('button', { name: 'Zapisz zmiany' }).click();

  await expect(page.getByText('-200,00 zł').first()).toBeVisible();

  await page.getByRole('row', { name: 'Wydatek' }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Usuń' }).click();

  await expect(page.getByText(EXPENSE['value-edit'].toString())).not.toBeVisible();
});

mockTest('create and delete personal expense (AI mock)', async ({ page }) => {
  await page.goto('/auth');

  await page.getByLabel('Email').fill('test@test.com');
  await page.getByLabel('Hasło').fill('test');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await page.waitForURL('/');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(15000);
  await page.getByRole('link', { name: 'Transakcje osobiste' }).click({});
  await page.waitForURL('/personal');

  await expect(page.getByTestId('skeleton')).not.toBeVisible();

  await page.getByRole('button', { name: 'Dodaj wydatek' }).click();
  await page.getByText('Dodaj zdjęcie rachunku').setInputFiles('./e2e/mocks/receipt.jpg');
  await page.getByRole('button', { name: 'Utwórz automatycznie' }).click();
  await page.getByRole('button', { name: 'Zatwierdź' }).click();

  await expect(page.getByText('-31,21 zł').first()).toBeVisible();

  await page.getByRole('row', { name: 'Wydatek' }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Usuń' }).click();

  await expect(page.getByText('-31,21 zł')).not.toBeVisible();
});
