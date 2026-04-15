import { Page, expect } from '@playwright/test';
import {
  Version,
  getSelector,
  AUTH_URLS,
  AUTH_SELECTORS,
  AUTH_CREDENTIALS
} from '../../config/auth/selectors-auth.config';

export class AuthPrimitives {

  // Navigation

  static async naviguerPageConnexion(page: Page, version: Version): Promise<void> {
    await page.goto(getSelector(AUTH_URLS.BASE, version));
    // Attendre que le formulaire B2C soit chargé (après la redirection)
    await page.locator(getSelector(AUTH_SELECTORS.INPUT_EMAIL, version))
      .waitFor({ state: 'visible', timeout: 30_000 });
  }

  static async tenterAccesPageProtegee(page: Page, version: Version): Promise<void> {
    await page.goto(getSelector(AUTH_URLS.PAGE_PROTEGEE, version));
  }

  // Connexion

  static async saisirEmail(page: Page, version: Version, email: string): Promise<void> {
    const loc = page.locator(getSelector(AUTH_SELECTORS.INPUT_EMAIL, version));
    await loc.waitFor({ state: 'visible', timeout: 10_000 });
    await loc.clear();
    await loc.fill(email);
  }

  static async saisirPassword(page: Page, version: Version, password: string): Promise<void> {
    const loc = page.locator(getSelector(AUTH_SELECTORS.INPUT_PASSWORD, version));
    await loc.waitFor({ state: 'visible' });
    await loc.clear();
    await loc.fill(password);
  }

  static async cliquerConnexion(page: Page, version: Version): Promise<void> {
    await page.locator(getSelector(AUTH_SELECTORS.BTN_CONNEXION, version)).click();
  }

  static async seConnecter(page: Page, version: Version, email: string, password: string): Promise<void> {
    await AuthPrimitives.saisirEmail(page, version, email);
    await AuthPrimitives.saisirPassword(page, version, password);
    await AuthPrimitives.cliquerConnexion(page, version);
    await page.waitForTimeout(3000);
  }

  // Scénarios prêts à l'emploi

  static async seConnecterCompteValide(page: Page, version: Version): Promise<void> {
    await AuthPrimitives.seConnecter(
      page, version,
      AUTH_CREDENTIALS.VALID.email,
      AUTH_CREDENTIALS.VALID.password
    );
  }

  static async seConnecterIdentifiantsIncorrects(page: Page, version: Version): Promise<void> {
    await AuthPrimitives.seConnecter(
      page, version,
      AUTH_CREDENTIALS.INVALID.email,
      AUTH_CREDENTIALS.INVALID.password
    );
  }

  static async seConnecterEmailInexistant(page: Page, version: Version): Promise<void> {
    await AuthPrimitives.seConnecter(
      page, version,
      AUTH_CREDENTIALS.EMAIL_INVALIDE.email,
      AUTH_CREDENTIALS.EMAIL_INVALIDE.password
    );
  }

  static async authentifierComplet(page: Page, version: Version): Promise<void> {
    await AuthPrimitives.naviguerPageConnexion(page, version);
    await AuthPrimitives.seConnecterCompteValide(page, version);
  }

  // Déconnexion

  static async seDeconnecter(page: Page, version: Version): Promise<void> {
    if (version === 'v1') {
      // Fermer tout overlay CDK qui pourrait intercepter les clics
      await page.evaluate(() => {
        document.querySelectorAll('.cdk-overlay-backdrop').forEach(el => el.remove());
        document.querySelectorAll('.cdk-overlay-pane').forEach(pane => {
          if (!pane.innerHTML.trim()) pane.remove();
        });
      });

      // Cliquer sur la flèche du menu utilisateur
      const arrow = page.locator('mat-icon').filter({ hasText: 'keyboard_arrow_down' });
      await arrow.waitFor({ state: 'visible' });
      await arrow.click();

      // Attendre que le menu déroulant soit visible (comme cy.contains().should('be.visible'))
      const deconnexion = page.getByText(getSelector(AUTH_SELECTORS.DECONNEXION_TEXT, version));
      await deconnexion.waitFor({ state: 'visible', timeout: 5_000 });
      await deconnexion.click();
    } else {
      await page.locator(getSelector(AUTH_SELECTORS.MENU_UTILISATEUR, version)).click();
      await page.locator(getSelector(AUTH_SELECTORS.BTN_DECONNEXION, version)).click();
    }

    // Attendre que MSAL déclenche le logout redirect (plus long que cy.wait(2000))
    await page.waitForTimeout(5000);
  }

  // Vérifications

  private static async verifierElement(
    page: Page,
    version: Version,
    selectorMap: { v1: string; v2: string },
    textMap: { v1: string; v2: string },
    timeout: number = 10_000
  ): Promise<void> {
    const selector = getSelector(selectorMap, version);
    const text = getSelector(textMap, version);

    if (selector) {
      await expect(page.locator(selector)).toBeVisible({ timeout });
    } else if (text) {
      await expect(page.getByText(text)).toBeVisible({ timeout });
    }
  }

  private static async verifierErreur(
    page: Page,
    version: Version,
    selectorMap: { v1: string; v2: string },
    textMap: { v1: string; v2: string },
    timeout: number = 5000
  ): Promise<void> {
    const selector = getSelector(selectorMap, version);
    const text = getSelector(textMap, version);

    if (selector) {
      await expect(page.locator(selector)).toContainText(text, { timeout });
    } else {
      await expect(page.getByText(text)).toBeVisible({ timeout });
    }
  }

  static async verifierAuthentificationReussie(page: Page, version: Version): Promise<void> {
    // Attendre que l'URL ne contienne plus b2clogin (redirection OAuth terminée)
    await page.waitForURL((url) => !url.href.includes(getSelector(AUTH_URLS.URL_LOGIN, version)), {
      timeout: 30_000,
      waitUntil: 'commit',
    });
    // Attendre que la page soit pleinement chargée après la redirection
    await page.waitForLoadState('domcontentloaded');
    await AuthPrimitives.verifierElement(page, version, AUTH_SELECTORS.APP_LOADED, AUTH_SELECTORS.APP_LOADED_TEXT, 30_000);
  }

  static async verifierEspacePersonnel(page: Page, version: Version): Promise<void> {
    await AuthPrimitives.verifierElement(page, version, AUTH_SELECTORS.ESPACE_PERSONNEL, AUTH_SELECTORS.ESPACE_PERSONNEL_TEXT);
  }

  static async verifierErreurIdentifiants(page: Page, version: Version): Promise<void> {
    await AuthPrimitives.verifierErreur(
      page, version,
      AUTH_SELECTORS.ERROR_IDENTIFIANTS,
      AUTH_SELECTORS.ERROR_IDENTIFIANTS_TEXT
    );
  }

  static async verifierErreurCompteInexistant(page: Page, version: Version): Promise<void> {
    await AuthPrimitives.verifierErreur(
      page, version,
      AUTH_SELECTORS.ERROR_COMPTE_INEXISTANT,
      AUTH_SELECTORS.ERROR_COMPTE_INEXISTANT_TEXT
    );
  }

  static async verifierSurPageConnexion(page: Page, version: Version, timeout: number = 30_000): Promise<void> {
    const loginUrl = getSelector(AUTH_URLS.URL_LOGIN, version);
    const loginRegex = new RegExp(loginUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    // Si l'URL contient déjà le domaine de login B2C, c'est bon
    if (loginRegex.test(page.url())) return;

    // Après un logout MSAL, la page peut rester sur l'URL de l'app.
    // Naviguer vers une page protégée déclenche le guard Angular → redirect B2C.
    await page.goto(getSelector(AUTH_URLS.PAGE_PROTEGEE, version), {
      waitUntil: 'commit',
      timeout: timeout,
    });
    await expect(page).toHaveURL(loginRegex, { timeout });
  }
}
