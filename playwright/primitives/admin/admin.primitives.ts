import { Locator, Page, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_ADMIN
} from '../../config/admin/selectors-admin.config';

export class AdminPrimitives {

  // Utilitaires

  private static async attendreChargement(page: Page): Promise<void> {
    await page.waitForTimeout(2000);
  }

  private static verifierEnvironnementNonProd(): void {
    const baseUrl = process.env.BASE_URL || '';
    if (baseUrl.includes('prod')) {
      throw new Error('Action destructive interdite sur l\'environnement de production');
    }
  }

  private static async trouverMaCarteCV(page: Page): Promise<Locator> {
    const monEmail = process.env.TEST_USER_EMAIL;
    if (!monEmail) {
      throw new Error('TEST_USER_EMAIL non défini dans les variables d’environnement');
    }
  
    const cards = page
      .locator('mat-card.result-card')
      .filter({ hasText: `Propriétaire : ${monEmail}` });
  
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    expect(await cards.count()).toBeGreaterThan(0);
  
    return cards.first();
  }

  // Navigation

  static async naviguerVersInvitation(page: Page, version: Version): Promise<void> {
    await page.locator('.mat-sidenav a').filter({ hasText: 'Invitation Candidat' }).scrollIntoViewIfNeeded();
    await page.locator('.mat-sidenav a').filter({ hasText: 'Invitation Candidat' }).click({ force: true });
    await page.waitForTimeout(1000);
    await expect(page.getByText('Invitation Candidat')).toBeVisible({ timeout: 10000 });
  }

  static async naviguerVersRechercheCV(page: Page, version: Version): Promise<void> {
    await page.locator('.mat-sidenav a').filter({ hasText: 'Recherche CV' }).scrollIntoViewIfNeeded();
    await page.locator('.mat-sidenav a').filter({ hasText: 'Recherche CV' }).click({ force: true });
    await page.waitForTimeout(1000);
    await expect(page.locator('input[name="searchTerm"]')).toBeAttached({ timeout: 10000 });
  }

  // Invitation Candidat

  static async envoyerInvitation(page: Page, version: Version, email: string): Promise<void> {
    const inputSel = getSelector(SECTION_ADMIN.INPUT_EMAIL_INVITATION, version);
    const btnSel = getSelector(SECTION_ADMIN.BTN_ENVOYER_INVITATION, version);

    const input = page.locator(inputSel);
    await input.scrollIntoViewIfNeeded();
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.clear();
    await input.fill(email);

    const btn = page.locator(btnSel);
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });

    await AdminPrimitives.attendreChargement(page);
  }

  static async verifierInvitationEnvoyee(page: Page): Promise<void> {
    await expect(page.locator('body')).not.toContainText('Erreur');
  }

  static async verifierErreurEmailInvalide(page: Page): Promise<void> {
    const form = page.locator('red-user-invitation form');
    await expect(form).toHaveClass(/ng-invalid/, { timeout: 10000 });
  }

  static async verifierChampEmailVide(page: Page): Promise<void> {
    await expect(page.locator('input.input-invit')).toHaveValue('', { timeout: 10000 });
  }

  // Recherche CV

  static async rechercherCV(page: Page, version: Version, terme: string): Promise<void> {
    const inputSel = getSelector(SECTION_ADMIN.INPUT_RECHERCHE, version);
    const btnSel = getSelector(SECTION_ADMIN.BTN_RECHERCHE, version);

    const input = page.locator(inputSel);
    await input.scrollIntoViewIfNeeded();
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.clear();
    await input.fill(terme);

    const btn = page.locator(btnSel);
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });

    await AdminPrimitives.attendreChargement(page);
  }

  static async verifierResultatsAffiches(page: Page): Promise<void> {
    const cards = page.locator('mat-card.result-card');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    expect(await cards.count()).toBeGreaterThan(0);
  }

  static async verifierResultatContient(page: Page, nom: string): Promise<void> {
    await expect(page.locator('div.results-grid')).toContainText(nom, { timeout: 10000 });
  }

  static async verifierNombreResultats(page: Page, nombreMin: number): Promise<void> {
    const cards = page.locator('mat-card.result-card');
    await cards.first().waitFor({ timeout: 15000 });
    expect(await cards.count()).toBeGreaterThanOrEqual(nombreMin);
  }

  static async verifierAucunResultat(page: Page): Promise<void> {
    await page.waitForTimeout(2000);
    const count = await page.locator('mat-card.result-card').count();
    expect(count).toBe(0);
  }

  static async verifierStatutCV(page: Page, nom: string, statut: string): Promise<void> {
    const normaliser = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    const cards = page.locator('mat-card.result-card');
    const count = await cards.count();
    const nomNorm = normaliser(nom);
    const statutNorm = normaliser(statut);

    let found = false;
    for (let i = 0; i < count; i++) {
      const texte = normaliser(await cards.nth(i).innerText());
      if (texte.includes(nomNorm) && texte.includes(statutNorm)) {
        found = true;
        break;
      }
    }

    expect(found, `Aucune carte "${nom}" avec statut "${statut}" trouvée`).toBeTruthy();
  }

  static async verifierCVExistePourNom(page: Page, nom: string): Promise<void> {
    const card = page.locator('mat-card.result-card').filter({ hasText: nom });
    await expect(card.first()).toBeVisible({ timeout: 10000 });
  }

  // Actions sur les cartes CV (par nom)

  static async cliquerVoirCV(page: Page, version: Version, nom: string): Promise<void> {
    const card = page.locator('mat-card, .cv-card, .card').filter({ hasText: nom });
    await card.scrollIntoViewIfNeeded();
    await card.locator(getSelector(SECTION_ADMIN.BTN_CARTE_VOIR, version)).click({ force: true });
    await AdminPrimitives.attendreChargement(page);
  }

  static async cliquerModifierCV(page: Page, version: Version, nom: string): Promise<void> {
    const card = page.locator('mat-card, .cv-card, .card').filter({ hasText: nom });
    await card.scrollIntoViewIfNeeded();
    await card.locator(getSelector(SECTION_ADMIN.BTN_CARTE_MODIFIER, version)).click({ force: true });
    await AdminPrimitives.attendreChargement(page);
  }

  // Actions sécurisées sur MON propre CV (par email unique)

  static async cliquerVoirMonCV(page: Page, version: Version): Promise<void> {
    const card = await AdminPrimitives.trouverMaCarteCV(page);
    await card.locator(getSelector(SECTION_ADMIN.BTN_CARTE_VOIR, version)).click({ force: true });
    await AdminPrimitives.attendreChargement(page);
  }

  static async cliquerModifierMonCV(page: Page, version: Version): Promise<void> {
    const card = await AdminPrimitives.trouverMaCarteCV(page);
    await card.locator(getSelector(SECTION_ADMIN.BTN_CARTE_MODIFIER, version)).click({ force: true });
    await AdminPrimitives.attendreChargement(page);
  }

  static async cliquerSupprimerMonCV(page: Page, version: Version): Promise<void> {
    AdminPrimitives.verifierEnvironnementNonProd();
    const card = await AdminPrimitives.trouverMaCarteCV(page);
    await card.locator(getSelector(SECTION_ADMIN.BTN_CARTE_SUPPRIMER, version)).click({ force: true });
    await AdminPrimitives.attendreChargement(page);
  }

  static async cliquerSupprimerCV(page: Page, version: Version, _nom: string): Promise<void> {
    await AdminPrimitives.cliquerSupprimerMonCV(page, version);
  }
}
