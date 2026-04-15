import { Page, Locator, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_DOMAINES_ACTIVITE
} from '../../config/section/selectors-domaines-activite.config';
import { fermerOverlays } from '../shared/overlay.utils';

const FIXTURE_DOMAINE = { nom: 'Santé', experience: '3 ANS' };
const FIXTURE_DOMAINE_MODIFIE = { nom: 'Finance', experience: '> 5 ANS' };

export class DomainesActivitePrimitives {

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(2500);
  }

  private static async selectionnerExperienceV1(page: Page, nom: string, experience: string): Promise<void> {
    const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, 'v1');
    const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, 'v1');
    const selectExp = getSelector(SECTION_DOMAINES_ACTIVITE.SELECT_EXPERIENCE, 'v1');

    const inputs = page.locator(`${rowSelector} ${inputDomaine}`);
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      if ((await inputs.nth(i).inputValue()) === nom) {
        const row = inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
        await row.scrollIntoViewIfNeeded();
        await row.locator(selectExp).click({ force: true });
        break;
      }
    }

    await page.locator('.cdk-overlay-container mat-option').filter({ hasText: experience }).click({ force: true });
  }

  private static async domaineExiste(page: Page, version: Version, nom: string): Promise<boolean> {
    const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
    const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputDomaine}`);
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
    const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
    const inputSelector = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === nom) {
          return inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
        }
      }
      throw new Error(`Domaine d'activité "${nom}" non trouvé`);
    } else {
      return page.locator(rowSelector).filter({ hasText: nom });
    }
  }

  // Préparation

  static async garantirDomaineExiste(page: Page, version: Version, nom: string, experience: string = '3 ANS'): Promise<void> {
    const existe = await DomainesActivitePrimitives.domaineExiste(page, version, nom);
    if (!existe) {
      await DomainesActivitePrimitives.ajouterDomaine(page, version, nom, experience);
    }
  }

  // Ajout

  static async ajouterDomaine(page: Page, version: Version, nom: string = FIXTURE_DOMAINE.nom, experience: string = FIXTURE_DOMAINE.experience): Promise<void> {
    const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
    const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
    const selectExp = getSelector(SECTION_DOMAINES_ACTIVITE.SELECT_EXPERIENCE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputDomaine}`);
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

      await DomainesActivitePrimitives.selectionnerExperienceV1(page, nom, experience);
      await DomainesActivitePrimitives.attendreAutoSave(page);

      const found = await DomainesActivitePrimitives.domaineExiste(page, version, nom);
      expect(found).toBeTruthy();
    } else {
      const lastRow = page.locator(rowSelector).last();
      await lastRow.scrollIntoViewIfNeeded();
      await lastRow.locator(inputDomaine).clear();
      await lastRow.locator(inputDomaine).fill(nom);
      await lastRow.locator(inputDomaine).blur();
      await lastRow.locator(selectExp).selectOption(experience);
      await DomainesActivitePrimitives.attendreAutoSave(page);
    }
  }

  // Modification

  static async modifierDomaine(page: Page, version: Version, ancienNom: string, nouveauNom: string = FIXTURE_DOMAINE_MODIFIE.nom, nouvelleExp: string = FIXTURE_DOMAINE_MODIFIE.experience): Promise<void> {
    const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
    const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
    const selectExp = getSelector(SECTION_DOMAINES_ACTIVITE.SELECT_EXPERIENCE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputDomaine}`);
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

      await DomainesActivitePrimitives.selectionnerExperienceV1(page, nouveauNom, nouvelleExp);
      await DomainesActivitePrimitives.attendreAutoSave(page);
    } else {
      const row = await DomainesActivitePrimitives.trouverLigneParNom(page, version, ancienNom);
      await row.scrollIntoViewIfNeeded();
      await row.locator(inputDomaine).clear();
      await row.locator(inputDomaine).fill(nouveauNom);
      await row.locator(inputDomaine).blur();
      await row.locator(selectExp).selectOption(nouvelleExp);
      await DomainesActivitePrimitives.attendreAutoSave(page);
    }
  }

  // Suppression

  static async supprimerDomaine(page: Page, version: Version, nom: string): Promise<void> {
    if (version === 'v1') {
      const supprimerSiExiste = async (): Promise<void> => {
        const existe = await DomainesActivitePrimitives.domaineExiste(page, version, nom);
        if (existe) {
          await fermerOverlays(page);
          const row = await DomainesActivitePrimitives.trouverLigneParNom(page, version, nom);
          await row.scrollIntoViewIfNeeded();
          await row.locator(getSelector(SECTION_DOMAINES_ACTIVITE.BTN_MENU_CONTEXTUEL, version)).click({ force: true });
          await page.locator('.mat-mdc-menu-panel').waitFor({ state: 'visible', timeout: 10_000 });
          await page.locator('.mat-mdc-menu-panel button').filter({ hasText: 'Supprimer' }).click();
          await page.waitForTimeout(2500);
          await supprimerSiExiste();
        }
      };
      await supprimerSiExiste();
    } else {
      const row = await DomainesActivitePrimitives.trouverLigneParNom(page, version, nom);
      await row.scrollIntoViewIfNeeded();
      await row.locator(getSelector(SECTION_DOMAINES_ACTIVITE.BTN_SUPPRIMER, version)).click();
      await DomainesActivitePrimitives.attendreAutoSave(page);
    }
  }

  // Visibilité

  static async toggleVisibilite(page: Page, version: Version, nom: string, activer: boolean): Promise<void> {
    const row = await DomainesActivitePrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_DOMAINES_ACTIVITE.COL_AFFICHER, version)).locator('input[type="checkbox"]');
    const isChecked = await checkbox.isChecked();

    if ((activer && !isChecked) || (!activer && isChecked)) {
      await checkbox.click({ force: true });
    }

    await DomainesActivitePrimitives.attendreAutoSave(page);
  }

  // Vérifications

  static async verifierExiste(page: Page, version: Version, nom: string): Promise<void> {
    const found = await DomainesActivitePrimitives.domaineExiste(page, version, nom);
    expect(found).toBeTruthy();
  }

  static async verifierAbsent(page: Page, version: Version, nom: string): Promise<void> {
    if (version === 'v1') await page.waitForTimeout(3000);
    const found = await DomainesActivitePrimitives.domaineExiste(page, version, nom);
    expect(found).toBeFalsy();
  }

  static async verifierVisibilite(page: Page, version: Version, nom: string, attenduVisible: boolean): Promise<void> {
    const row = await DomainesActivitePrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_DOMAINES_ACTIVITE.COL_AFFICHER, version)).locator('input[type="checkbox"]');
    if (attenduVisible) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }

  // Tri / Ordre

  static async changerTri(page: Page, version: Version, nom: string, position: string): Promise<void> {
    const ordreSelector = getSelector(SECTION_DOMAINES_ACTIVITE.COL_ORDRE, version);
    const row = await DomainesActivitePrimitives.trouverLigneParNom(page, version, nom);
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
          await DomainesActivitePrimitives.attendreAutoSave(page);
        }
      }
    } else {
      await row.locator(ordreSelector).selectOption(position);
      await DomainesActivitePrimitives.attendreAutoSave(page);
    }
  }

  static async verifierPosition(page: Page, version: Version, nom: string, positionAttendue: string): Promise<void> {
    const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
    const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
    const posIndex = parseInt(positionAttendue, 10) - 1;

    if (version === 'v1') {
      const value = await page.locator(rowSelector).nth(posIndex).locator(inputDomaine).inputValue();
      expect(value).toBe(nom);
    } else {
      await expect(page.locator(rowSelector).nth(posIndex)).toContainText(nom);
    }
  }
}
