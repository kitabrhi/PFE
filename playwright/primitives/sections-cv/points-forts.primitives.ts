import { Page, Locator, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_POINTS_FORTS
} from '../../config/section/selectors-points-forts.config';

const FIXTURE_POINT_FORT = 'Cadrage stratégique';
const FIXTURE_POINT_FORT_MODIFIE = 'Gestion de projet Agile';

export class PointsFortsPrimitives {

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(2500);
  }

  private static async pointFortExiste(page: Page, version: Version, texte: string): Promise<boolean> {
    const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, version);
    const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === texte) return true;
      }
      return false;
    } else {
      return (await page.locator(rowSelector).filter({ hasText: texte }).count()) > 0;
    }
  }

  static async trouverLigneParTexte(page: Page, version: Version, texte: string): Promise<Locator> {
    const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, version);
    const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === texte) {
          return inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
        }
      }
      throw new Error(`Point fort "${texte}" non trouvé`);
    } else {
      return page.locator(rowSelector).filter({ hasText: texte });
    }
  }

  // Préparation

  static async garantirPointFortExiste(page: Page, version: Version, texte: string): Promise<void> {
    const existe = await PointsFortsPrimitives.pointFortExiste(page, version, texte);
    if (!existe) {
      await PointsFortsPrimitives.ajouterPointFort(page, version, texte);
    }
  }

  // Ajout

  static async ajouterPointFort(page: Page, version: Version, texte: string = FIXTURE_POINT_FORT): Promise<void> {
    const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, version);
    const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      let emptyInput: Locator | null = null;
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === '') { emptyInput = inputs.nth(i); break; }
      }
      if (!emptyInput) throw new Error('Aucune ligne vide disponible');

      await emptyInput.scrollIntoViewIfNeeded();
      await emptyInput.clear();
      await emptyInput.fill(texte);
      await emptyInput.blur();

      await PointsFortsPrimitives.attendreAutoSave(page);

      const found = await PointsFortsPrimitives.pointFortExiste(page, version, texte);
      expect(found).toBeTruthy();
    } else {
      const lastRow = page.locator(rowSelector).last();
      await lastRow.scrollIntoViewIfNeeded();
      await lastRow.locator(inputSelector).clear();
      await lastRow.locator(inputSelector).fill(texte);
      await lastRow.locator(inputSelector).blur();
      await PointsFortsPrimitives.attendreAutoSave(page);
    }
  }

  // Modification

  static async modifierPointFort(page: Page, version: Version, ancien: string, nouveau: string = FIXTURE_POINT_FORT_MODIFIE): Promise<void> {
    const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, version);
    const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === ancien) {
          await inputs.nth(i).scrollIntoViewIfNeeded();
          await inputs.nth(i).clear();
          await inputs.nth(i).fill(nouveau);
          await inputs.nth(i).blur();
          break;
        }
      }
    } else {
      const row = await PointsFortsPrimitives.trouverLigneParTexte(page, version, ancien);
      await row.scrollIntoViewIfNeeded();
      await row.locator(inputSelector).clear();
      await row.locator(inputSelector).fill(nouveau);
      await row.locator(inputSelector).blur();
    }

    await PointsFortsPrimitives.attendreAutoSave(page);
  }

  // Suppression

  static async supprimerPointFort(page: Page, version: Version, texte: string): Promise<void> {
    if (version === 'v1') {
      const supprimerSiExiste = async (): Promise<void> => {
        const existe = await PointsFortsPrimitives.pointFortExiste(page, version, texte);
        if (existe) {
          const row = await PointsFortsPrimitives.trouverLigneParTexte(page, version, texte);
          await row.scrollIntoViewIfNeeded();
          await row.locator(getSelector(SECTION_POINTS_FORTS.BTN_MENU_CONTEXTUEL, version)).click({ force: true });
          await page.locator('.mat-mdc-menu-panel').waitFor({ state: 'visible' });
          await page.locator('.mat-mdc-menu-panel button').filter({ hasText: 'Supprimer' }).click();
          await page.waitForTimeout(2500);
          await supprimerSiExiste();
        }
      };
      await supprimerSiExiste();
    } else {
      const row = await PointsFortsPrimitives.trouverLigneParTexte(page, version, texte);
      await row.scrollIntoViewIfNeeded();
      await row.locator(getSelector(SECTION_POINTS_FORTS.BTN_MENU_CONTEXTUEL, version)).click();
      await PointsFortsPrimitives.attendreAutoSave(page);
    }
  }

  // Visibilité

  static async toggleVisibilite(page: Page, version: Version, texte: string, activer: boolean): Promise<void> {
    const row = await PointsFortsPrimitives.trouverLigneParTexte(page, version, texte);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_POINTS_FORTS.COL_AFFICHER, version)).locator('input[type="checkbox"]');
    const isChecked = await checkbox.isChecked();

    if ((activer && !isChecked) || (!activer && isChecked)) {
      await checkbox.click({ force: true });
    }

    await PointsFortsPrimitives.attendreAutoSave(page);
  }

  // Vérifications

  static async verifierExiste(page: Page, version: Version, texte: string): Promise<void> {
    const found = await PointsFortsPrimitives.pointFortExiste(page, version, texte);
    expect(found).toBeTruthy();
  }

  static async verifierAbsent(page: Page, version: Version, texte: string): Promise<void> {
    if (version === 'v1') await page.waitForTimeout(3000);
    const found = await PointsFortsPrimitives.pointFortExiste(page, version, texte);
    expect(found).toBeFalsy();
  }

  static async verifierVisibilite(page: Page, version: Version, texte: string, attenduVisible: boolean): Promise<void> {
    const row = await PointsFortsPrimitives.trouverLigneParTexte(page, version, texte);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_POINTS_FORTS.COL_AFFICHER, version)).locator('input[type="checkbox"]');
    if (attenduVisible) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }
}
