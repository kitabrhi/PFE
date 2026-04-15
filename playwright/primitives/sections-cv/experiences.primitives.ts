import { Page, Locator, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_EXPERIENCES
} from '../../config/section/selectors-experiences.config';

interface ExperienceData {
  titre: string;
  societe: string;
  lieu: string;
  debut: string;
  fin?: string;
}

const FIXTURE_EXPERIENCE: ExperienceData = {
  titre: 'Développeur Angular',
  societe: 'REDSEN',
  lieu: 'Genève',
  debut: '01/2024',
  fin: '06/2024'
};

const FIXTURE_EXPERIENCE_MODIFIEE: ExperienceData = {
  titre: 'Lead Developer',
  societe: 'Anthropic',
  lieu: 'Paris',
  debut: '07/2024',
  fin: '12/2024'
};

export class ExperiencesPrimitives {

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(2500);
  }

  private static async remplirChamp(page: Page, locator: Locator, valeur: string): Promise<void> {
    await locator.clear();
    await locator.fill(valeur);
    await locator.blur();
  }

  // Recherche

  static async trouverLigneParTitre(page: Page, version: Version, titre: string): Promise<Locator> {
    const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
    const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputTitre}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        const value = await inputs.nth(i).inputValue();
        if (value === titre) {
          const row = inputs.nth(i).locator(`xpath=ancestor::*[self::${rowSelector.replace('.', '*[contains(@class,"')}")]`).first();
          // Fallback: use closest pattern
          return inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
        }
      }
      throw new Error(`Expérience "${titre}" non trouvée`);
    } else {
      return page.locator(rowSelector).filter({ hasText: titre });
    }
  }

  private static async experienceExiste(page: Page, version: Version, titre: string): Promise<boolean> {
    const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
    const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputTitre}`);
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

  // Préparation

  static async garantirExperienceExiste(
    page: Page, version: Version, titre: string,
    societe: string = FIXTURE_EXPERIENCE.societe,
    lieu: string = FIXTURE_EXPERIENCE.lieu,
    debut: string = FIXTURE_EXPERIENCE.debut,
    fin?: string
  ): Promise<void> {
    const existe = await ExperiencesPrimitives.experienceExiste(page, version, titre);
    if (!existe) {
      await ExperiencesPrimitives.ajouterExperience(page, version, { titre, societe, lieu, debut, fin });
    }
  }

  // Ajout

  static async ajouterExperience(page: Page, version: Version, data: ExperienceData = FIXTURE_EXPERIENCE): Promise<void> {
    const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
    const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
    const inputSociete = getSelector(SECTION_EXPERIENCES.INPUT_SOCIETE, version);
    const inputLieu = getSelector(SECTION_EXPERIENCES.INPUT_LIEU, version);
    const inputDebut = getSelector(SECTION_EXPERIENCES.INPUT_DEBUT, version);
    const inputFin = getSelector(SECTION_EXPERIENCES.INPUT_FIN, version);

    if (version === 'v1') {
      // Trouver la dernière ligne vide
      const inputs = page.locator(`${rowSelector} ${inputTitre}`);
      const count = await inputs.count();
      let emptyIdx = -1;
      for (let i = 0; i < count; i++) {
        if ((await inputs.nth(i).inputValue()) === '') { emptyIdx = i; break; }
      }
      if (emptyIdx === -1) throw new Error('Aucune ligne vide disponible');

      const row = inputs.nth(emptyIdx).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
      await row.scrollIntoViewIfNeeded();

      await ExperiencesPrimitives.remplirChamp(page, row.locator(inputTitre), data.titre);
      await ExperiencesPrimitives.remplirChamp(page, row.locator(inputSociete), data.societe);
      await ExperiencesPrimitives.remplirChamp(page, row.locator(inputLieu), data.lieu);
      await ExperiencesPrimitives.remplirChamp(page, row.locator(inputDebut), data.debut);
      if (data.fin) {
        await ExperiencesPrimitives.remplirChamp(page, row.locator(inputFin), data.fin);
      }

      await ExperiencesPrimitives.attendreAutoSave(page);

      const found = await ExperiencesPrimitives.experienceExiste(page, version, data.titre);
      expect(found).toBeTruthy();
    } else {
      const lastRow = page.locator(rowSelector).last();
      await lastRow.scrollIntoViewIfNeeded();

      await ExperiencesPrimitives.remplirChamp(page, lastRow.locator(inputTitre), data.titre);
      await ExperiencesPrimitives.remplirChamp(page, lastRow.locator(inputSociete), data.societe);
      await ExperiencesPrimitives.remplirChamp(page, lastRow.locator(inputLieu), data.lieu);
      await ExperiencesPrimitives.remplirChamp(page, lastRow.locator(inputDebut), data.debut);
      if (data.fin) {
        await ExperiencesPrimitives.remplirChamp(page, lastRow.locator(inputFin), data.fin);
      }

      await ExperiencesPrimitives.attendreAutoSave(page);
    }
  }

  // Modification

  static async modifierExperience(
    page: Page, version: Version, ancienTitre: string,
    nouvelleData: Partial<ExperienceData> = FIXTURE_EXPERIENCE_MODIFIEE
  ): Promise<void> {
    const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
    const inputSociete = getSelector(SECTION_EXPERIENCES.INPUT_SOCIETE, version);
    const inputLieu = getSelector(SECTION_EXPERIENCES.INPUT_LIEU, version);

    const row = await ExperiencesPrimitives.trouverLigneParTitre(page, version, ancienTitre);
    await row.scrollIntoViewIfNeeded();

    if (nouvelleData.titre) await ExperiencesPrimitives.remplirChamp(page, row.locator(inputTitre), nouvelleData.titre);
    if (nouvelleData.societe) await ExperiencesPrimitives.remplirChamp(page, row.locator(inputSociete), nouvelleData.societe);
    if (nouvelleData.lieu) await ExperiencesPrimitives.remplirChamp(page, row.locator(inputLieu), nouvelleData.lieu);

    await ExperiencesPrimitives.attendreAutoSave(page);
  }

  // Suppression

  static async supprimerExperience(page: Page, version: Version, titre: string): Promise<void> {
    const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
    const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);

    if (version === 'v1') {
      const supprimerSiExiste = async (): Promise<void> => {
        const existe = await ExperiencesPrimitives.experienceExiste(page, version, titre);
        if (existe) {
          const row = await ExperiencesPrimitives.trouverLigneParTitre(page, version, titre);
          await row.scrollIntoViewIfNeeded();
          await row.locator(getSelector(SECTION_EXPERIENCES.BTN_MENU_CONTEXTUEL, version)).click({ force: true });

          await page.locator('.mat-mdc-menu-panel').waitFor({ state: 'visible' });
          await page.locator('.mat-mdc-menu-panel button').filter({ hasText: 'Supprimer' }).click();
          await page.waitForTimeout(2500);
          await supprimerSiExiste();
        }
      };
      await supprimerSiExiste();
    } else {
      const row = await ExperiencesPrimitives.trouverLigneParTitre(page, version, titre);
      await row.scrollIntoViewIfNeeded();
      await row.locator(getSelector(SECTION_EXPERIENCES.BTN_SUPPRIMER, version)).click();
      await ExperiencesPrimitives.attendreAutoSave(page);
    }
  }

  // Visibilité

  static async toggleVisibilite(page: Page, version: Version, titre: string, activer: boolean): Promise<void> {
    const row = await ExperiencesPrimitives.trouverLigneParTitre(page, version, titre);
    await row.scrollIntoViewIfNeeded();

    const sel = getSelector(SECTION_EXPERIENCES.COL_AFFICHER, version);
    const checkbox = row.locator(sel).locator('input[type="checkbox"]');
    const isChecked = await checkbox.isChecked();

    if ((activer && !isChecked) || (!activer && isChecked)) {
      await checkbox.click({ force: true });
    }

    await ExperiencesPrimitives.attendreAutoSave(page);
  }

  // Tri / Ordre

  static async changerTri(page: Page, version: Version, titre: string, position: string): Promise<void> {
    const ordreSelector = getSelector(SECTION_EXPERIENCES.COL_ORDRE, version);
    const row = await ExperiencesPrimitives.trouverLigneParTitre(page, version, titre);
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
          await ExperiencesPrimitives.attendreAutoSave(page);
        }
      }
    } else {
      await row.locator(ordreSelector).selectOption(position);
      await ExperiencesPrimitives.attendreAutoSave(page);
    }
  }

  static async verifierPosition(page: Page, version: Version, titre: string, positionAttendue: string): Promise<void> {
    const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
    const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
    const posIndex = parseInt(positionAttendue, 10) - 1;

    if (version === 'v1') {
      const value = await page.locator(rowSelector).nth(posIndex).locator(inputTitre).inputValue();
      expect(value).toBe(titre);
    } else {
      await expect(page.locator(rowSelector).nth(posIndex)).toContainText(titre);
    }
  }

  // Vérifications

  static async verifierExiste(page: Page, version: Version, titre: string): Promise<void> {
    const found = await ExperiencesPrimitives.experienceExiste(page, version, titre);
    expect(found).toBeTruthy();
  }

  static async verifierAbsente(page: Page, version: Version, titre: string): Promise<void> {
    if (version === 'v1') await page.waitForTimeout(3000);
    const found = await ExperiencesPrimitives.experienceExiste(page, version, titre);
    expect(found).toBeFalsy();
  }

  static async verifierVisibilite(page: Page, version: Version, titre: string, attenduVisible: boolean): Promise<void> {
    const row = await ExperiencesPrimitives.trouverLigneParTitre(page, version, titre);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row.locator(getSelector(SECTION_EXPERIENCES.COL_AFFICHER, version)).locator('input[type="checkbox"]');

    if (attenduVisible) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }

  static async verifierChamps(page: Page, version: Version, titre: string, societe: string, lieu: string): Promise<void> {
    const row = await ExperiencesPrimitives.trouverLigneParTitre(page, version, titre);
    await row.scrollIntoViewIfNeeded();

    const inputSociete = getSelector(SECTION_EXPERIENCES.INPUT_SOCIETE, version);
    const inputLieu = getSelector(SECTION_EXPERIENCES.INPUT_LIEU, version);

    await expect(row.locator(inputSociete)).toHaveValue(societe);
    await expect(row.locator(inputLieu)).toHaveValue(lieu);
  }
}
