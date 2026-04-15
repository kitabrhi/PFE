import { Page, Locator, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_HASHTAGS
} from '../../config/section/selectors-hashtags.config';

const FIXTURE_HASHTAG = { nom: 'Chef de projet' };
const FIXTURE_HASHTAG_MODIFIE = { nom: 'Scrum Master' };

export class HashtagsPrimitives {

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(2500);
  }

  private static async hashtagExiste(page: Page, version: Version, nom: string): Promise<boolean> {
    const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
    const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputHashtag}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === nom) return true;
      }
      return false;
    } else {
      return (await page.locator(rowSelector).filter({ hasText: nom }).count()) > 0;
    }
  }

  static async trouverLigneParNom(page: Page, version: Version, nom: string): Promise<Locator> {
    const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
    const inputSelector = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === nom) {
          return inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
        }
      }
      throw new Error(`Hashtag "${nom}" non trouvé`);
    } else {
      return page.locator(rowSelector).filter({ hasText: nom });
    }
  }

  // Préparation

  static async garantirHashtagExiste(page: Page, version: Version, nom: string): Promise<void> {
    const existe = await HashtagsPrimitives.hashtagExiste(page, version, nom);
    if (!existe) {
      await HashtagsPrimitives.ajouterHashtag(page, version, nom);
    }
  }

  // Ajout

  static async ajouterHashtag(page: Page, version: Version, nom: string = FIXTURE_HASHTAG.nom): Promise<void> {
    const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
    const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputHashtag}`);
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

      await HashtagsPrimitives.attendreAutoSave(page);

      const found = await HashtagsPrimitives.hashtagExiste(page, version, nom);
      expect(found).toBeTruthy();
    } else {
      const lastRow = page.locator(rowSelector).last();
      await lastRow.scrollIntoViewIfNeeded();
      await lastRow.locator(inputHashtag).clear();
      await lastRow.locator(inputHashtag).fill(nom);
      await lastRow.locator(inputHashtag).blur();
      await HashtagsPrimitives.attendreAutoSave(page);
    }
  }

  // Modification

  static async modifierHashtag(page: Page, version: Version, ancienNom: string, nouveauNom: string = FIXTURE_HASHTAG_MODIFIE.nom): Promise<void> {
    const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
    const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputHashtag}`);
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
    } else {
      const row = await HashtagsPrimitives.trouverLigneParNom(page, version, ancienNom);
      await row.scrollIntoViewIfNeeded();
      await row.locator(inputHashtag).clear();
      await row.locator(inputHashtag).fill(nouveauNom);
      await row.locator(inputHashtag).blur();
    }

    await HashtagsPrimitives.attendreAutoSave(page);
  }

  // Suppression

  static async supprimerHashtag(page: Page, version: Version, nom: string): Promise<void> {
    if (version === 'v1') {
      const supprimerSiExiste = async (): Promise<void> => {
        const existe = await HashtagsPrimitives.hashtagExiste(page, version, nom);
        if (existe) {
          const row = await HashtagsPrimitives.trouverLigneParNom(page, version, nom);
          await row.scrollIntoViewIfNeeded();
          await row.locator(getSelector(SECTION_HASHTAGS.BTN_MENU_CONTEXTUEL, version)).click({ force: true });
          await page.locator('.mat-mdc-menu-panel').waitFor({ state: 'visible' });
          await page.locator('.mat-mdc-menu-panel button').filter({ hasText: 'Supprimer' }).click();
          await page.waitForTimeout(2500);
          await supprimerSiExiste();
        }
      };
      await supprimerSiExiste();
    } else {
      const row = await HashtagsPrimitives.trouverLigneParNom(page, version, nom);
      await row.scrollIntoViewIfNeeded();
      await row.locator(getSelector(SECTION_HASHTAGS.BTN_SUPPRIMER, version)).click();
      await HashtagsPrimitives.attendreAutoSave(page);
    }
  }

  // Visibilité

  static async toggleVisibilite(page: Page, version: Version, nom: string, activer: boolean): Promise<void> {
    const row = await HashtagsPrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_HASHTAGS.COL_AFFICHER, version)).locator('input[type="checkbox"]');
    const isChecked = await checkbox.isChecked();

    if ((activer && !isChecked) || (!activer && isChecked)) {
      await checkbox.click({ force: true });
    }

    await HashtagsPrimitives.attendreAutoSave(page);
  }

  // Tri / Ordre

  static async changerTri(page: Page, version: Version, nom: string, position: string): Promise<void> {
    const ordreSelector = getSelector(SECTION_HASHTAGS.COL_ORDRE, version);
    const row = await HashtagsPrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    if (version === 'v1') {
      const triActuel = await row.locator(ordreSelector)
        .locator('.mat-mdc-select-value-text, .mat-select-value-text')
        .innerText();

      if (triActuel.trim() !== position) {
        await row.locator(ordreSelector).click({ force: true });

        const overlay = page.locator('.cdk-overlay-container mat-option');
        if ((await overlay.count()) > 0) {
          await overlay.filter({ hasText: new RegExp(`^\\s*${position}\\s*$`) }).click({ force: true });
          await HashtagsPrimitives.attendreAutoSave(page);
        }
      }
    } else {
      await row.locator(ordreSelector).selectOption(position);
      await HashtagsPrimitives.attendreAutoSave(page);
    }
  }

  static async verifierPosition(page: Page, version: Version, nom: string, positionAttendue: string): Promise<void> {
    const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
    const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);
    const posIndex = parseInt(positionAttendue, 10) - 1;

    if (version === 'v1') {
      const value = await page.locator(rowSelector).nth(posIndex).locator(inputHashtag).inputValue();
      expect(value).toBe(nom);
    } else {
      await expect(page.locator(rowSelector).nth(posIndex)).toContainText(nom);
    }
  }

  // Vérifications

  static async verifierExiste(page: Page, version: Version, nom: string): Promise<void> {
    const found = await HashtagsPrimitives.hashtagExiste(page, version, nom);
    expect(found).toBeTruthy();
  }

  static async verifierAbsent(page: Page, version: Version, nom: string): Promise<void> {
    if (version === 'v1') await page.waitForTimeout(3000);
    const found = await HashtagsPrimitives.hashtagExiste(page, version, nom);
    expect(found).toBeFalsy();
  }

  static async verifierVisibilite(page: Page, version: Version, nom: string, attenduVisible: boolean): Promise<void> {
    const row = await HashtagsPrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_HASHTAGS.COL_AFFICHER, version)).locator('input[type="checkbox"]');
    if (attenduVisible) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }
}
