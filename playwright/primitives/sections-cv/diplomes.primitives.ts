import { Page, Locator, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_DIPLOMES
} from '../../config/section/selectors-diplomes.config';

const FIXTURE_DIPLOME = { nom: 'Master Informatique', lieu: 'Université Hassan II', annee: '2024' };
const FIXTURE_DIPLOME_MODIFIE = { nom: 'Master Génie Logiciel', lieu: 'ENSIAS Rabat', annee: '2025' };

export class DiplomesPrimitives {

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(2500);
  }

  private static async diplomeExiste(page: Page, version: Version, nom: string): Promise<boolean> {
    const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
    const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputDiplome}`);
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
    const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
    const inputSelector = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === nom) {
          return inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
        }
      }
      throw new Error(`Diplôme "${nom}" non trouvé`);
    } else {
      return page.locator(rowSelector).filter({ hasText: nom });
    }
  }

  // Préparation

  static async garantirDiplomeExiste(page: Page, version: Version, nom: string, lieu: string = 'Université Hassan II', annee: string = '2024'): Promise<void> {
    const existe = await DiplomesPrimitives.diplomeExiste(page, version, nom);
    if (!existe) {
      await DiplomesPrimitives.ajouterDiplome(page, version, nom, lieu, annee);
    }
  }

  // Ajout

  static async ajouterDiplome(page: Page, version: Version, nom: string = FIXTURE_DIPLOME.nom, lieu: string = FIXTURE_DIPLOME.lieu, annee: string = FIXTURE_DIPLOME.annee): Promise<void> {
    const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
    const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputDiplome}`);
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

      // Remplir lieu et année dans la même ligne
      const row = emptyInput.locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
      const lieuInput = row.locator(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version));
      await lieuInput.clear();
      await lieuInput.fill(lieu);
      await lieuInput.blur();

      const anneeInput = row.locator(getSelector(SECTION_DIPLOMES.INPUT_ANNEE, version));
      await anneeInput.clear();
      await anneeInput.fill(annee);
      await anneeInput.blur();

      await DiplomesPrimitives.attendreAutoSave(page);

      const found = await DiplomesPrimitives.diplomeExiste(page, version, nom);
      expect(found).toBeTruthy();
    } else {
      const lastRow = page.locator(rowSelector).last();
      await lastRow.scrollIntoViewIfNeeded();
      await lastRow.locator(inputDiplome).clear();
      await lastRow.locator(inputDiplome).fill(nom);
      await lastRow.locator(inputDiplome).blur();
      await lastRow.locator(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).clear();
      await lastRow.locator(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).fill(lieu);
      await lastRow.locator(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).blur();
      await lastRow.locator(getSelector(SECTION_DIPLOMES.INPUT_ANNEE, version)).selectOption(annee);
      await DiplomesPrimitives.attendreAutoSave(page);
    }
  }

  // Modification

  static async modifierDiplome(page: Page, version: Version, ancienNom: string, nouveauNom: string = FIXTURE_DIPLOME_MODIFIE.nom, nouveauLieu: string = FIXTURE_DIPLOME_MODIFIE.lieu, nouvelleAnnee: string = FIXTURE_DIPLOME_MODIFIE.annee): Promise<void> {
    const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
    const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputDiplome}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === ancienNom) {
          await inputs.nth(i).scrollIntoViewIfNeeded();
          await inputs.nth(i).clear();
          await inputs.nth(i).fill(nouveauNom);
          await inputs.nth(i).blur();

          const row = inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
          await row.locator(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).clear();
          await row.locator(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).fill(nouveauLieu);
          await row.locator(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).blur();
          await row.locator(getSelector(SECTION_DIPLOMES.INPUT_ANNEE, version)).clear();
          await row.locator(getSelector(SECTION_DIPLOMES.INPUT_ANNEE, version)).fill(nouvelleAnnee);
          await row.locator(getSelector(SECTION_DIPLOMES.INPUT_ANNEE, version)).blur();
          break;
        }
      }
      await DiplomesPrimitives.attendreAutoSave(page);
    } else {
      const row = await DiplomesPrimitives.trouverLigneParNom(page, version, ancienNom);
      await row.scrollIntoViewIfNeeded();
      await row.locator(inputDiplome).clear();
      await row.locator(inputDiplome).fill(nouveauNom);
      await row.locator(inputDiplome).blur();
      await row.locator(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).clear();
      await row.locator(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).fill(nouveauLieu);
      await row.locator(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).blur();
      await row.locator(getSelector(SECTION_DIPLOMES.INPUT_ANNEE, version)).selectOption(nouvelleAnnee);
      await DiplomesPrimitives.attendreAutoSave(page);
    }
  }

  // Suppression

  static async supprimerDiplome(page: Page, version: Version, nom: string): Promise<void> {
    if (version === 'v1') {
      const supprimerSiExiste = async (): Promise<void> => {
        const existe = await DiplomesPrimitives.diplomeExiste(page, version, nom);
        if (existe) {
          const row = await DiplomesPrimitives.trouverLigneParNom(page, version, nom);
          await row.scrollIntoViewIfNeeded();
          await row.locator(getSelector(SECTION_DIPLOMES.BTN_MENU_CONTEXTUEL, version)).last().click({ force: true });
          await page.locator('.mat-mdc-menu-panel').waitFor({ state: 'visible' });
          await page.locator('.mat-mdc-menu-panel button').filter({ hasText: 'Supprimer' }).click();
          await page.waitForTimeout(2500);
          await supprimerSiExiste();
        }
      };
      await supprimerSiExiste();
    } else {
      const row = await DiplomesPrimitives.trouverLigneParNom(page, version, nom);
      await row.scrollIntoViewIfNeeded();
      await row.locator(getSelector(SECTION_DIPLOMES.BTN_SUPPRIMER, version)).click();
      await DiplomesPrimitives.attendreAutoSave(page);
    }
  }

  // Visibilité

  static async toggleVisibilite(page: Page, version: Version, nom: string, activer: boolean): Promise<void> {
    const row = await DiplomesPrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_DIPLOMES.COL_AFFICHER, version)).locator('input[type="checkbox"]');
    const isChecked = await checkbox.isChecked();

    if ((activer && !isChecked) || (!activer && isChecked)) {
      await checkbox.click({ force: true });
    }

    await DiplomesPrimitives.attendreAutoSave(page);
  }

  // Vérifications

  static async verifierDiplomeExiste(page: Page, version: Version, nom: string): Promise<void> {
    const found = await DiplomesPrimitives.diplomeExiste(page, version, nom);
    expect(found).toBeTruthy();
  }

  static async verifierDiplomeAbsent(page: Page, version: Version, nom: string): Promise<void> {
    if (version === 'v1') await page.waitForTimeout(3000);
    const found = await DiplomesPrimitives.diplomeExiste(page, version, nom);
    expect(found).toBeFalsy();
  }

  static async verifierVisibilite(page: Page, version: Version, nom: string, attenduVisible: boolean): Promise<void> {
    const row = await DiplomesPrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_DIPLOMES.COL_AFFICHER, version)).locator('input[type="checkbox"]');
    if (attenduVisible) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }
}
