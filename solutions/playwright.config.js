// Same settings as the main config, but runs the tests in this folder.
// Usage: npm run test:solutions
const base = require('../playwright.config.js');

module.exports = { ...base, testDir: '.' };
