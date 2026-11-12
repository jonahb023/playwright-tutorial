// Exercise 2 solution: roughly what codegen records for a valid prescription.
// Your recorded selectors may look a little different - that's fine.
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Patient name' }).click();
  await page.getByRole('textbox', { name: 'Patient name' }).fill('Jane Doe');
  await page.getByLabel('Drug').selectOption('Amoxicillin');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('500');
  await page.getByRole('button', { name: 'Submit prescription' }).click();
  await expect(page.getByRole('alert')).toContainText('Prescription submitted: 500 mg Amoxicillin for Jane Doe.');
});
