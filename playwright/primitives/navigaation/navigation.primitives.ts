import { Page, expect } from '@playwright/test';
import { Version, getSelector, CARTE_CV } from '../../config/carte-cv/selectors-carte-cv.config';
import { AuthPrimitives } from '../auth/auth.primitives';
import { CarteCVPrimitives } from '../carte-cv/actions.primitives';
import { SectionsCVPrimitives } from '../sections-cv/titre-cv.primitives';
import { fermerOverlays } from '../shared/overlay.utils';

export class NavigationPrimitives {

  // Connexion

  static async seConnecterEtVerifier(page: Page, version: Version): Promise<void> {
    await AuthPrimitives.authentifierComplet(page, version);
    await AuthPrimitives.verifierAuthentificationReussie(page, version);
  }

  // Accès à la page "Mes CV"

  static async naviguerVersPageMesCVs(page: Page, version: Version): Promise<void> {
    if (version === 'v1') {
      await page.locator('.mat-sidenav').first().waitFor({ state: 'visible', timeout: 10_000 });
      await page.locator('.mat-sidenav a').filter({ hasText: 'Mes CVS' }).first().click({ force: true });
      await expect(page).toHaveURL(/\/user\/versioning/);
    } else {
      await page.getByText('Mes CV').click({ force: true });
    }

    await CarteCVPrimitives.assurerTableVisible(page, version);
  }

  // Navigation vers une page par son nom

  static async naviguerVersPage(page: Page, version: Version, pageName: string): Promise<void> {
    if (pageName === 'Mes CVS') {
      await NavigationPrimitives.naviguerVersPageMesCVs(page, version);

    } else if (pageName === 'Invitation Candidat') {
      await page.locator('.mat-sidenav').first().waitFor({ state: 'visible', timeout: 10_000 });
      await page.locator('.mat-sidenav a').filter({ hasText: 'Invitation Candidat' }).first().click({ force: true });
      await page.waitForTimeout(1000);
      await expect(page.locator('.mat-sidenav a').filter({ hasText: 'Invitation Candidat' }).first()).toBeVisible({ timeout: 10_000 });

    } else if (pageName === 'Recherche CV') {
      await page.locator('.mat-sidenav').first().waitFor({ state: 'visible', timeout: 10_000 });
      await page.locator('.mat-sidenav a').filter({ hasText: 'Recherche CV' }).click({ force: true });
      await page.waitForTimeout(1000);
      await expect(page.locator('input[name="searchTerm"]')).toBeAttached({ timeout: 10_000 });

    } else {
      throw new Error(`Page inconnue : "${pageName}"`);
    }
  }

  // Ouvre le premier CV de la liste

  static async selectionnerPremierCV(page: Page, version: Version): Promise<void> {
    const rowSelector = getSelector(CARTE_CV.TABLE_ROW, version);

    // Attendre que les lignes soient chargées (count() ne fait pas d'auto-wait)
    await page.locator(rowSelector).first().waitFor({ state: 'visible', timeout: 10_000 });

    // Fermer tout overlay CDK/Material qui pourrait intercepter les clics
    await fermerOverlays(page);

    await page.locator(rowSelector).first().click();
    await page.waitForTimeout(1500);
    await CarteCVPrimitives.verifierNavigationPageDetail(page, version);
  }

  // Enchaîne la navigation complète jusqu'à la section demandée

  static async naviguerVersSectionCVExistant(page: Page, version: Version, nomSection: string): Promise<void> {
    await NavigationPrimitives.naviguerVersPageMesCVs(page, version);
    await NavigationPrimitives.selectionnerPremierCV(page, version);
    await SectionsCVPrimitives.naviguerVersSection(page, version, nomSection);
  }
}
