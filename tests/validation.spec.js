const { test, expect } = require('@playwright/test');

test('unsafe Warfarin dose shows a warning', async ({ page }) => {
  await page.goto('/');

  // Fill the form with a dose above Warfarin's 10 mg limit
  await page.getByLabel('Patient name').fill('John Smith');
  await page.getByLabel('Drug').selectOption('Warfarin');
  await page.locator('#dose').fill('50');
  await page.getByRole('button', { name: 'Submit prescription' }).click();

  // The warning must appear, and the prescription must NOT be accepted
  const alert = page.getByRole('alert');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText('exceeds the maximum safe dose of 10 mg');
  await expect(alert).not.toContainText('Prescription submitted');
});
