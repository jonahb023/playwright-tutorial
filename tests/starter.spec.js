// Exercise 1: starter test. Run it with:
//   npx playwright test --project=chromium
const { test, expect } = require('@playwright/test');

test('prescription form loads', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('MedSafe Prescribing');
  await expect(page.getByRole('heading', { name: 'New Prescription' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit prescription' })).toBeVisible();
});
