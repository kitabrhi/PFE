import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium } from 'playwright';
import { PlaywrightWorld } from './world';
import * as fs from 'fs';
import * as path from 'path';

// Timeout par défaut Cucumber : 120s (aligné sur pageLoadTimeout Cypress)
setDefaultTimeout(120_000);

// Charger les variables depuis cypress.env.json (même source que Cypress)
// Les variables d'environnement système ont priorité.
const cypressEnvPath = path.resolve(process.cwd(), 'cypress.env.json');
if (fs.existsSync(cypressEnvPath)) {
  const cypressEnv = JSON.parse(fs.readFileSync(cypressEnvPath, 'utf-8'));
  for (const [key, value] of Object.entries(cypressEnv)) {
    if (!process.env[key] && typeof value === 'string') {
      process.env[key] = value;
    }
  }
}

let browser: Browser;

BeforeAll(async () => {
  const headless = process.env.CI === 'true' || process.env.HEADLESS !== 'false';
  browser = await chromium.launch({ headless });
});

AfterAll(async () => {
  await browser?.close();
});

Before(async function (this: PlaywrightWorld) {
  this.browser = browser;

  this.context = await browser.newContext({
    baseURL: process.env.BASE_URL || 'https://redsumedev.z6.web.core.windows.net',
    viewport: { width: 1400, height: 900 },
    ignoreHTTPSErrors: true,
  });

  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(15_000);
  this.page.setDefaultNavigationTimeout(120_000);
});

After(async function (this: PlaywrightWorld, scenario) {
  // Capture un screenshot en cas d'échec
  if (scenario.result?.status === Status.FAILED) {
    const name = scenario.pickle.name.replace(/\s+/g, '-').toLowerCase();
    await this.page?.screenshot({
      path: `playwright/reports/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  await this.page?.close();
  await this.context?.close();
});
