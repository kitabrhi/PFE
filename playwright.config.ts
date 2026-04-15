/**
 * ═══════════════════════════════════════════════════════════════════
 * CONFIGURATION PLAYWRIGHT - ReDsume
 * ═══════════════════════════════════════════════════════════════════
 *
 * Ce fichier n'est PAS utilisé directement par Cucumber.
 * Il sert de référence et peut être importé par les hooks Playwright.
 *
 * L'exécution passe par @cucumber/cucumber (voir playwright/cucumber.cjs).
 * Les paramètres de navigateur (viewport, timeouts, baseURL) sont
 * configurés dans playwright/hooks.ts via le BrowserContext.
 *
 * Variables d'environnement supportées :
 *   BASE_URL       — URL de l'application (défaut : https://redsumedev.z6.web.core.windows.net)
 *   APP_VERSION    — Version de l'app : v1 | v2 (défaut : v1)
 *   CI             — Active le mode headless et les retries
 *   HEADLESS       — Force le mode headless (défaut : true en CI)
 *   USER_LOGIN     — Email de connexion
 *   USER_PASSWORD  — Mot de passe
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './cypress/e2e',

  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },

  retries: process.env.CI ? 2 : 0,
  workers: 1,

  use: {
    baseURL: process.env.BASE_URL || 'https://redsumedev.z6.web.core.windows.net',
    headless: process.env.CI === 'true' || process.env.HEADLESS !== 'false',
    viewport: { width: 1400, height: 900 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright/reports', open: 'never' }],
  ],
});
