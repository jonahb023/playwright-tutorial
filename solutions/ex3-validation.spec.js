// Exercise 3 solution: unsafe dose must show a warning.
// Run on all 3 browsers: npx playwright test validation
const { test, expect } = require('@playwright/test');

test('unsafe Warfarin dose shows a warning', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Patient name').fill('John Smith');
  await page.getByLabel('Drug').selectOption('Warfarin');
  await page.locator('#dose').fill('50');
  await page.getByRole('button', { name: 'Submit prescription' }).click();

  const alert = page.getByRole('alert');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText('exceeds the maximum safe dose of 10 mg');
  await expect(alert).not.toContainText('Prescription submitted');
});
