import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Patient name' }).click();
  await page.getByRole('textbox', { name: 'Patient name' }).fill('Jonah Beck');
  await page.getByLabel('Drug').selectOption('Amoxicillin');
  await page.locator('#dose').click();
  await page.locator('#dose').fill('500');
  await page.locator('html').click();
  await page.locator('html').click();
  await page.getByRole('button', { name: 'Submit prescription' }).click();
  await expect(page.locator('#message')).toContainText('Prescription submitted: 500 mg Amoxicillin for Jonah Beck.');
});