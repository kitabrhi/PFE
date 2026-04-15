/**
 * Configuration Cucumber pour Playwright
 *
 * Les features sont partagées avec Cypress (cypress/e2e/).
 * Les step definitions et primitives sont propres à Playwright.
 *
 * Usage :
 *   npx cucumber-js --config playwright/cucumber.cjs                          → toutes les features
 *   npx cucumber-js --config playwright/cucumber.cjs cypress/e2e/04-section/07-competences.feature  → une seule
 */

// Si des paths sont passés en CLI (arguments après les options), ne pas forcer ceux du config
const cliHasFeaturePaths = process.argv.slice(2).some(
  (arg) => arg.endsWith('.feature') || arg.includes('/e2e/')
);

module.exports = {
  default: {
    ...(cliHasFeaturePaths ? {} : { paths: ['cypress/e2e/**/*.feature'] }),
    require: ['playwright/steps/**/*.ts', 'playwright/hooks.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:playwright/reports/report.html',
    ],
  },
};
