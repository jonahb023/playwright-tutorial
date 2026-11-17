import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('html').click();
  await page.locator('html').click();
  await page.getByRole('textbox', { name: 'Patient name' }).click();
  await page.getByRole('textbox', { name: 'Patient name' }).fill('Jeremy Huggins');
  await page.getByRole('textbox', { name: 'Patient name' }).press('Tab');
  await page.getByLabel('Drug').selectOption('Amoxicillin');
  await page.getByLabel('Drug').selectOption('');
  await page.getByLabel('Drug').selectOption('Ibuprofen');
  await page.locator('#dose').click();
  await page.locator('#dose').click();
  await page.getByRole('textbox', { name: 'Patient name' }).click();
  await page.locator('html').click();
  await page.getByRole('textbox', { name: 'Patient name' }).fill('Jane Doe');
  await page.getByLabel('Drug').selectOption('Amoxicillin');
  await page.locator('#dose').click();
  await page.locator('#dose').fill('500');
  await page.locator('html').click();
  await page.getByRole('button', { name: 'Submit prescription' }).click();
  await expect(page.locator('#message')).toContainText('Prescription submitted: 500 mg Amoxicillin for Jane Doe.');
  await page.locator('html').click();
});
