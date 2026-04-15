import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';

/**
 * World Playwright pour Cucumber.
 *
 * Chaque scénario reçoit un contexte et une page neufs.
 * Le navigateur est partagé entre tous les scénarios (géré dans hooks.ts).
 */
export class PlaywrightWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(PlaywrightWorld);
