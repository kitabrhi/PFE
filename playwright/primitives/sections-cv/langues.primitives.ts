import { Page, Locator, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_LANGUES
} from '../../config/section/selectors-langues.config';

const FIXTURE_LANGUE = { nom: 'Français', niveau: 'Langue maternelle' };

export class LanguesPrimitives {

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(2500);
  }

  private static async langueExiste(page: Page, version: Version, nom: string): Promise<boolean> {
    const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
    const inputLangue = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputLangue}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === nom) return true;
      }
      return false;
    } else {
      return (await page.locator(rowSelector).filter({ hasText: nom }).count()) > 0;
    }
  }

  private static async selectionnerNiveauV1(page: Page, nom: string, niveau: string): Promise<void> {
    const rowSelector = getSelector(SECTION_LANGUES.ROW, 'v1');
    const inputLangue = getSelector(SECTION_LANGUES.INPUT_LANGUE, 'v1');
    const selectNiveau = getSelector(SECTION_LANGUES.SELECT_NIVEAU, 'v1');

    const inputs = page.locator(`${rowSelector} ${inputLangue}`);
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      if ((await inputs.nth(i).inputValue()) === nom) {
        const row = inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
        await row.locator(selectNiveau).click({ force: true });
        break;
      }
    }

    await page.locator('.cdk-overlay-container mat-option').filter({ hasText: niveau }).click({ force: true });
  }

  static async trouverLigneParNom(page: Page, version: Version, nom: string): Promise<Locator> {
    const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
    const inputSelector = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === nom) {
          return inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
        }
      }
      throw new Error(`Langue "${nom}" non trouvée`);
    } else {
      return page.locator(rowSelector).filter({ hasText: nom });
    }
  }

  // Préparation

  static async garantirLangueExiste(page: Page, version: Version, nom: string, niveau: string = 'B2'): Promise<void> {
    const existe = await LanguesPrimitives.langueExiste(page, version, nom);
    if (!existe) {
      await LanguesPrimitives.ajouterLangue(page, version, nom, niveau);
    }
  }

  // Ajout

  static async ajouterLangue(page: Page, version: Version, nom: string = FIXTURE_LANGUE.nom, niveau: string = FIXTURE_LANGUE.niveau): Promise<void> {
    const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
    const inputLangue = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);
    const selectNiveau = getSelector(SECTION_LANGUES.SELECT_NIVEAU, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputLangue}`);
      const count = await inputs.count();
      let emptyInput: Locator | null = null;
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === '') { emptyInput = inputs.nth(i); break; }
      }
      if (!emptyInput) throw new Error('Aucune ligne vide disponible');

      await emptyInput.scrollIntoViewIfNeeded();
      await emptyInput.clear();
      await emptyInput.fill(nom);
      await emptyInput.blur();

      await LanguesPrimitives.selectionnerNiveauV1(page, nom, niveau);
      await LanguesPrimitives.attendreAutoSave(page);

      const found = await LanguesPrimitives.langueExiste(page, version, nom);
      expect(found).toBeTruthy();
    } else {
      const lastRow = page.locator(rowSelector).last();
      await lastRow.scrollIntoViewIfNeeded();
      await lastRow.locator(inputLangue).clear();
      await lastRow.locator(inputLangue).fill(nom);
      await lastRow.locator(inputLangue).blur();
      await lastRow.locator(selectNiveau).selectOption(niveau);
      await LanguesPrimitives.attendreAutoSave(page);
    }
  }

  // Modification

  static async modifierLangue(page: Page, version: Version, ancienNom: string, nouveauNom: string, nouveauNiveau: string): Promise<void> {
    const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
    const inputLangue = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);
    const selectNiveau = getSelector(SECTION_LANGUES.SELECT_NIVEAU, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputLangue}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === ancienNom) {
          await inputs.nth(i).scrollIntoViewIfNeeded();
          await inputs.nth(i).clear();
          await inputs.nth(i).fill(nouveauNom);
          await inputs.nth(i).blur();
          break;
        }
      }
      await LanguesPrimitives.selectionnerNiveauV1(page, nouveauNom, nouveauNiveau);
      await LanguesPrimitives.attendreAutoSave(page);
    } else {
      const row = await LanguesPrimitives.trouverLigneParNom(page, version, ancienNom);
      await row.scrollIntoViewIfNeeded();
      await row.locator(inputLangue).clear();
      await row.locator(inputLangue).fill(nouveauNom);
      await row.locator(inputLangue).blur();
      await row.locator(selectNiveau).selectOption(nouveauNiveau);
      await LanguesPrimitives.attendreAutoSave(page);
    }
  }

  // Suppression

  static async supprimerLangue(page: Page, version: Version, nom: string): Promise<void> {
    if (version === 'v1') {
      const supprimerSiExiste = async (): Promise<void> => {
        const existe = await LanguesPrimitives.langueExiste(page, version, nom);
        if (existe) {
          const row = await LanguesPrimitives.trouverLigneParNom(page, version, nom);
          await row.scrollIntoViewIfNeeded();
          await row.locator(getSelector(SECTION_LANGUES.BTN_MENU_CONTEXTUEL, version)).click({ force: true });
          await page.locator('.mat-mdc-menu-panel').waitFor({ state: 'visible' });
          await page.locator('.mat-mdc-menu-panel button').filter({ hasText: 'Supprimer' }).click();
          await page.waitForTimeout(2500);
          await supprimerSiExiste();
        }
      };
      await supprimerSiExiste();
    } else {
      const row = await LanguesPrimitives.trouverLigneParNom(page, version, nom);
      await row.scrollIntoViewIfNeeded();
      await row.locator(getSelector(SECTION_LANGUES.BTN_SUPPRIMER, version)).click();
      await LanguesPrimitives.attendreAutoSave(page);
    }
  }

  // Visibilité

  static async toggleVisibilite(page: Page, version: Version, nom: string, activer: boolean): Promise<void> {
    const row = await LanguesPrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_LANGUES.COL_AFFICHER, version)).locator('input[type="checkbox"]');
    const isChecked = await checkbox.isChecked();

    if ((activer && !isChecked) || (!activer && isChecked)) {
      await checkbox.click({ force: true });
    }

    await LanguesPrimitives.attendreAutoSave(page);
  }

  // Vérifications

  static async verifierLangueExiste(page: Page, version: Version, nom: string): Promise<void> {
    const found = await LanguesPrimitives.langueExiste(page, version, nom);
    expect(found).toBeTruthy();
  }

  static async verifierLangueAbsente(page: Page, version: Version, nom: string): Promise<void> {
    if (version === 'v1') await page.waitForTimeout(3000);
    const found = await LanguesPrimitives.langueExiste(page, version, nom);
    expect(found).toBeFalsy();
  }

  static async verifierVisibilite(page: Page, version: Version, nom: string, attenduVisible: boolean): Promise<void> {
    const row = await LanguesPrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_LANGUES.COL_AFFICHER, version)).locator('input[type="checkbox"]');
    if (attenduVisible) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }
}
