import { Page, Locator, expect } from '@playwright/test';
import {
  Version, getSelector, getLabelSection,
  SECTION_NAV, SECTION_ROW, SECTION_TITRES
} from '../../config/section/selectors-titre-cv.config';

export class SectionsCVPrimitives {

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(2500);
  }

  // retourne vrai si le titre existe déjà, sans lever d'assertion
  private static async titreExiste(page: Page, version: Version, titre: string): Promise<boolean> {
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        const value = await inputs.nth(i).inputValue();
        if (value === titre) return true;
      }
      return false;
    } else {
      return (await page.locator(rowSelector).filter({ hasText: titre }).count()) > 0;
    }
  }

  // Navigation

  static async naviguerVersSection(page: Page, version: Version, nomSection: string): Promise<void> {
    const label = getLabelSection(nomSection, version);

    const nav = page.locator(getSelector(SECTION_NAV.NAV_CONTAINER, version)).first();
    await nav.waitFor({ state: 'visible', timeout: 10_000 });

    const link = nav.locator('a').filter({ hasText: label });
    await link.click({ force: true });
    await page.waitForTimeout(1000);
  }

  // Recherche

  static async trouverLigneParTexte(page: Page, version: Version, texte: string): Promise<Locator> {
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        const value = await inputs.nth(i).inputValue();
        if (value === texte) {
          return inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
        }
      }
      throw new Error(`Ligne contenant "${texte}" non trouvée`);
    } else {
      return page.locator(rowSelector).filter({ hasText: texte });
    }
  }

  static async verifierNouvelleLigneVide(page: Page, version: Version): Promise<void> {
    if (version === 'v1') {
      // v1 : pas de nouvelle ligne vide auto-créée
      return;
    }

    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);
    const inputs = page.locator(`${rowSelector} ${inputSelector}`);
    const count = await inputs.count();
    let foundEmpty = false;
    for (let i = 0; i < count; i++) {
      const value = await inputs.nth(i).inputValue();
      if (value === '') { foundEmpty = true; break; }
    }
    expect(foundEmpty).toBeTruthy();
  }

  // Préparation

  static async garantirTitreExiste(page: Page, version: Version, titre: string): Promise<void> {
    const existe = await SectionsCVPrimitives.titreExiste(page, version, titre);
    if (!existe) {
      await SectionsCVPrimitives.ajouterTitre(page, version, titre);
    }
  }

  // Ajout

  static async ajouterTitre(page: Page, version: Version, titre: string): Promise<void> {
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      let emptyInput: Locator | null = null;
      for (let i = 0; i < count; i++) {
        const value = await inputs.nth(i).inputValue();
        if (value === '') { emptyInput = inputs.nth(i); break; }
      }
      if (!emptyInput) throw new Error('Aucune ligne vide disponible');

      await emptyInput.clear();
      await emptyInput.fill(titre);
      await emptyInput.blur();

      // Vérification
      await page.waitForTimeout(1000);
      const found = await SectionsCVPrimitives.titreExiste(page, version, titre);
      expect(found).toBeTruthy();
    } else {
      const lastRow = page.locator(rowSelector).last();
      await lastRow.scrollIntoViewIfNeeded();
      const input = lastRow.locator(inputSelector).first();
      await input.clear();
      await input.fill(titre);
      await input.blur();
      await SectionsCVPrimitives.attendreAutoSave(page);
    }
  }

  // Modification

  static async modifierTitre(page: Page, version: Version, ancienTitre: string, nouveauTitre: string): Promise<void> {
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        const value = await inputs.nth(i).inputValue();
        if (value === ancienTitre) {
          await inputs.nth(i).clear();
          await inputs.nth(i).fill(nouveauTitre);
          await inputs.nth(i).blur();
          break;
        }
      }
      await page.waitForTimeout(1000);
      const found = await SectionsCVPrimitives.titreExiste(page, version, nouveauTitre);
      expect(found).toBeTruthy();
    } else {
      const row = await SectionsCVPrimitives.trouverLigneParTexte(page, version, ancienTitre);
      const input = row.locator(inputSelector).first();
      await input.clear();
      await input.fill(nouveauTitre);
      await input.blur();
      await SectionsCVPrimitives.attendreAutoSave(page);
    }
  }

  // Suppression

  static async supprimerLigne(page: Page, version: Version, texte: string): Promise<void> {
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);

    if (version === 'v1') {
      const supprimerSiExiste = async (): Promise<void> => {
        const inputs = page.locator(`${rowSelector} ${inputSelector}`);
        const count = await inputs.count();
        let found = false;
        for (let i = 0; i < count; i++) {
          const value = await inputs.nth(i).inputValue();
          if (value === texte) {
            const row = inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
            await row.scrollIntoViewIfNeeded();
            await row.locator(getSelector(SECTION_ROW.BTN_SUPPRIMER_LIGNE, version)).click();

            await page.locator('.mat-mdc-menu-panel').waitFor({ state: 'visible' });
            await page.locator('.mat-mdc-menu-panel button').filter({ hasText: 'Supprimer' }).click();

            await page.waitForTimeout(2500);
            found = true;
            break;
          }
        }
        if (found) await supprimerSiExiste();
      };
      await supprimerSiExiste();
    } else {
      const row = await SectionsCVPrimitives.trouverLigneParTexte(page, version, texte);
      await row.locator(getSelector(SECTION_ROW.BTN_SUPPRIMER_LIGNE, version)).click();
      await SectionsCVPrimitives.attendreAutoSave(page);
    }
  }

  // Visibilité

  static async toggleVisibilite(page: Page, version: Version, texte: string, activer: boolean): Promise<void> {
    const row = await SectionsCVPrimitives.trouverLigneParTexte(page, version, texte);
    await row.scrollIntoViewIfNeeded();

    const sel = getSelector(SECTION_ROW.COL_AFFICHER, version);
    const checkbox = row.locator(sel);
    const isChecked = await checkbox.isChecked();

    if ((activer && !isChecked) || (!activer && isChecked)) {
      await checkbox.click({ force: true });
    }

    await SectionsCVPrimitives.attendreAutoSave(page);
  }

  static async verifierVisibilite(page: Page, version: Version, texte: string, attenduVisible: boolean): Promise<void> {
    const row = await SectionsCVPrimitives.trouverLigneParTexte(page, version, texte);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_ROW.COL_AFFICHER, version));

    if (attenduVisible) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }

  // Réordonnancement

  static async changerOrdre(page: Page, version: Version, texte: string, nouvelOrdre: number): Promise<void> {
    const row = await SectionsCVPrimitives.trouverLigneParTexte(page, version, texte);
    await row.scrollIntoViewIfNeeded();

    const ordreSelector = getSelector(SECTION_ROW.COL_ORDRE, version);

    if (version === 'v1') {
      await row.locator(ordreSelector).click();

      await page.locator('.mat-mdc-select-panel')
        .waitFor({ state: 'visible', timeout: 10_000 });
      await page.locator('.cdk-overlay-container mat-option')
        .filter({ hasText: new RegExp(`^\\s*${nouvelOrdre}\\s*$`) })
        .click();
    } else {
      await row.locator(ordreSelector).selectOption(nouvelOrdre.toString());
    }

    await SectionsCVPrimitives.attendreAutoSave(page);
  }

  static async verifierOrdre(page: Page, version: Version, texte: string, ordreAttendu: number): Promise<void> {
    const row = await SectionsCVPrimitives.trouverLigneParTexte(page, version, texte);
    await row.scrollIntoViewIfNeeded();

    if (version === 'v1') {
      const text = await row.locator(getSelector(SECTION_ROW.COL_ORDRE, version))
        .locator('.mat-mdc-select-min-line').innerText();
      expect(text).toBe(ordreAttendu.toString());
    } else {
      await expect(row.locator(getSelector(SECTION_ROW.COL_ORDRE, version)))
        .toHaveValue(ordreAttendu.toString());
    }
  }

  // Vérifications

  static async verifierTitreExiste(page: Page, version: Version, titre: string): Promise<void> {
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);

    if (version === 'v1') {
      const found = await SectionsCVPrimitives.titreExiste(page, version, titre);
      expect(found).toBeTruthy();
    } else {
      await expect(page.locator(rowSelector).filter({ hasText: titre })).toBeVisible();
    }
  }

  static async verifierTitreAbsent(page: Page, version: Version, titre: string): Promise<void> {
    const rowSelector = getSelector(SECTION_ROW.ROW, version);

    if (version === 'v1') {
      await page.waitForTimeout(3000);
      const found = await SectionsCVPrimitives.titreExiste(page, version, titre);
      expect(found).toBeFalsy();
    } else {
      await expect(page.locator(rowSelector).filter({ hasText: titre })).toHaveCount(0);
    }
  }
}
