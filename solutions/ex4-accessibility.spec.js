// Exercise 4 solution: automated accessibility scan with axe-core.
// Run: npx playwright test accessibility --project=chromium
// FAILS (1 violation) until you fix app/index.html, then PASSES (0 violations).
const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

test('prescription form has no accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  // Print a readable summary of anything axe found.
  console.log(`Violations found: ${results.violations.length}`);
  for (const v of results.violations) {
    console.log(`- ${v.id}: ${v.help}`);
    v.nodes.forEach((n) => console.log(`    element: ${n.html}`));
  }

  expect(results.violations.length).toBe(0);
});
