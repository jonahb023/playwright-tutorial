// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
  },
  // Three browsers. Use --project=chromium to run just one.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  // Starts the sample app automatically before the tests run.
  webServer: {
    command: 'npx http-server app -p 3000 -c-1 --silent',
    cwd: __dirname,
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
    env: { NODE_NO_WARNINGS: '1' },
  },
});
