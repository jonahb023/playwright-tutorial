const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');
test('prescription form has no accessibility violations', async ({ page }) => {
 await page.goto('/');
 // Scan the page against WCAG 2 A and AA rules
 const results = await new AxeBuilder({ page })
 .withTags(['wcag2a', 'wcag2aa'])
 .analyze();
 // Print what axe found
 console.log(`Violations found: ${results.violations.length}`);
 for (const v of results.violations) {
 console.log(`- ${v.id}: ${v.help}`);
 v.nodes.forEach((n) => console.log(` element: ${n.html}`));
 }
 expect(results.violations.length).toBe(0);
});
