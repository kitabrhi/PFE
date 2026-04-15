import { Page, Locator, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_COMPETENCES
} from '../../config/section/selectors-competences.config';

const FIXTURE_COMPETENCE = { nom: 'Angular', experience: '3 ANS' };
const FIXTURE_COMPETENCE_MODIFIE = { nom: 'React', experience: '> 5 ANS' };

export class CompetencesPrimitives {

  // Utilitaires

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(2500);
  }

  // En v1 le select est un mat-select overlay : cliquer puis choisir dans le panneau
  private static async selectionnerExperienceV1(page: Page, nom: string, experience: string): Promise<void> {
    const row = await CompetencesPrimitives.trouverLigneParNom(page, 'v1', nom);
    const selectExp = getSelector(SECTION_COMPETENCES.SELECT_EXPERIENCE, 'v1');

    await row.scrollIntoViewIfNeeded();
    await row.locator(selectExp).click({ force: true });

    await page.locator('.cdk-overlay-container mat-option')
      .filter({ hasText: experience })
      .click({ force: true });
  }

  // Recherche

  static async trouverLigneParNom(page: Page, version: Version, nom: string): Promise<Locator> {
    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
    const inputSelector = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputSelector}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        const value = await inputs.nth(i).inputValue();
        if (value === nom) {
          const row = inputs.nth(i).locator('xpath=ancestor::*[contains(@class,"custom-form-item")]').first();
          await row.scrollIntoViewIfNeeded();
          return row;
        }
      }
      throw new Error(`Compétence "${nom}" non trouvée`);
    } else {
      const row = page.locator(rowSelector).filter({ hasText: nom });
      await row.scrollIntoViewIfNeeded();
      return row;
    }
  }

  // Vérifie sans lever d'assertion si la compétence existe
  private static async competenceExiste(page: Page, version: Version, nom: string): Promise<boolean> {
    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
    const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);

    if (version === 'v1') {
      const inputs = page.locator(`${rowSelector} ${inputComp}`);
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        const value = await inputs.nth(i).inputValue();
        if (value === nom) return true;
      }
      return false;
    } else {
      return (await page.locator(rowSelector).filter({ hasText: nom }).count()) > 0;
    }
  }

  // Préparation

  static async garantirCompetenceExiste(
    page: Page,
    version: Version,
    nom: string,
    experience: string = '3 ANS'
  ): Promise<void> {
    const existe = await CompetencesPrimitives.competenceExiste(page, version, nom);
    if (!existe) {
      await CompetencesPrimitives.ajouterCompetence(page, version, nom, experience);
    }
  }

  // Ajout

  static async ajouterCompetence(
    page: Page,
    version: Version,
    nom: string = FIXTURE_COMPETENCE.nom,
    experience: string = FIXTURE_COMPETENCE.experience
  ): Promise<void> {
    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
    const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
    const selectExp = getSelector(SECTION_COMPETENCES.SELECT_EXPERIENCE, version);

    if (version === 'v1') {
      // Trouver la première ligne vide
      const inputs = page.locator(`${rowSelector} ${inputComp}`);
      const count = await inputs.count();
      let emptyInput: Locator | null = null;

      for (let i = 0; i < count; i++) {
        const value = await inputs.nth(i).inputValue();
        if (value === '') {
          emptyInput = inputs.nth(i);
          break;
        }
      }

      if (!emptyInput) throw new Error('Aucune ligne vide disponible');

      await emptyInput.scrollIntoViewIfNeeded();
      await emptyInput.clear();
      await emptyInput.fill(nom);
      await emptyInput.blur();

      await CompetencesPrimitives.selectionnerExperienceV1(page, nom, experience);
      await CompetencesPrimitives.attendreAutoSave(page);

      // Vérifier que la ligne est bien là après sauvegarde
      const found = await CompetencesPrimitives.competenceExiste(page, version, nom);
      expect(found).toBeTruthy();

    } else {
      const lastRow = page.locator(rowSelector).last();
      await lastRow.scrollIntoViewIfNeeded();
      await lastRow.locator(inputComp).clear();
      await lastRow.locator(inputComp).fill(nom);
      await lastRow.locator(inputComp).blur();
      await lastRow.locator(selectExp).selectOption(experience);

      await CompetencesPrimitives.attendreAutoSave(page);
    }
  }

  // Modification

  static async modifierCompetence(
    page: Page,
    version: Version,
    ancienNom: string,
    nouveauNom: string = FIXTURE_COMPETENCE_MODIFIE.nom,
    nouvelleExp: string = FIXTURE_COMPETENCE_MODIFIE.experience
  ): Promise<void> {
    const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
    const selectExp = getSelector(SECTION_COMPETENCES.SELECT_EXPERIENCE, version);

    if (version === 'v1') {
      const row = await CompetencesPrimitives.trouverLigneParNom(page, version, ancienNom);
      const input = row.locator(inputComp);
      await input.scrollIntoViewIfNeeded();
      await input.clear();
      await input.fill(nouveauNom);
      await input.blur();

      await CompetencesPrimitives.selectionnerExperienceV1(page, nouveauNom, nouvelleExp);
      await CompetencesPrimitives.attendreAutoSave(page);

    } else {
      const row = await CompetencesPrimitives.trouverLigneParNom(page, version, ancienNom);
      await row.scrollIntoViewIfNeeded();
      await row.locator(inputComp).clear();
      await row.locator(inputComp).fill(nouveauNom);
      await row.locator(inputComp).blur();
      await row.locator(selectExp).selectOption(nouvelleExp);

      await CompetencesPrimitives.attendreAutoSave(page);
    }
  }

  // Suppression

  static async supprimerCompetence(page: Page, version: Version, nom: string): Promise<void> {
    if (version === 'v1') {
      const supprimerSiExiste = async () => {
        const existe = await CompetencesPrimitives.competenceExiste(page, version, nom);
        if (existe) {
          const row = await CompetencesPrimitives.trouverLigneParNom(page, version, nom);
          await row.scrollIntoViewIfNeeded();
          const btnMenu = getSelector(SECTION_COMPETENCES.BTN_MENU_CONTEXTUEL, version);
          await row.locator(btnMenu).click({ force: true });

          await page.locator('.mat-mdc-menu-panel').waitFor({ state: 'visible' });
          await page.locator('.mat-mdc-menu-panel button').filter({ hasText: 'Supprimer' }).click();

          await page.waitForTimeout(2500);
          await supprimerSiExiste();
        }
      };
      await supprimerSiExiste();

    } else {
      const row = await CompetencesPrimitives.trouverLigneParNom(page, version, nom);
      await row.scrollIntoViewIfNeeded();
      await row.locator(getSelector(SECTION_COMPETENCES.BTN_SUPPRIMER, version)).click();

      await CompetencesPrimitives.attendreAutoSave(page);
    }
  }

  // Visibilité

  static async toggleVisibilite(page: Page, version: Version, nom: string, activer: boolean): Promise<void> {
    const row = await CompetencesPrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    const sel = getSelector(SECTION_COMPETENCES.COL_AFFICHER, version);
    const checkbox = row.locator(sel).locator('input[type="checkbox"]');
    const isChecked = await checkbox.isChecked();

    if ((activer && !isChecked) || (!activer && isChecked)) {
      await checkbox.click({ force: true });
    }

    await CompetencesPrimitives.attendreAutoSave(page);
  }

  // Tri / Ordre

  static async changerTri(page: Page, version: Version, nom: string, position: string): Promise<void> {
    const ordreSelector = getSelector(SECTION_COMPETENCES.COL_ORDRE, version);
    const row = await CompetencesPrimitives.trouverLigneParNom(page, version, nom);

    if (version === 'v1') {
      await row.scrollIntoViewIfNeeded();
      const triActuel = await row.locator(ordreSelector)
        .locator('.mat-mdc-select-value-text, .mat-select-value-text')
        .innerText();

      if (triActuel.trim() !== position) {
        await row.locator(ordreSelector).click({ force: true });

        await page.locator('.cdk-overlay-container mat-option')
          .filter({ hasText: new RegExp(`^\\s*${position}\\s*$`) })
          .click({ force: true });

        await CompetencesPrimitives.attendreAutoSave(page);
      }

    } else {
      await row.scrollIntoViewIfNeeded();
      await row.locator(ordreSelector).selectOption(position);
      await CompetencesPrimitives.attendreAutoSave(page);
    }
  }

  static async verifierPosition(page: Page, version: Version, nom: string, positionAttendue: string): Promise<void> {
    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
    const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
    const posIndex = parseInt(positionAttendue, 10) - 1;

    if (version === 'v1') {
      const row = page.locator(rowSelector).nth(posIndex);
      const value = await row.locator(inputComp).inputValue();
      expect(value).toBe(nom);
    } else {
      await expect(page.locator(rowSelector).nth(posIndex)).toContainText(nom);
    }
  }

  // Vérifications

  static async verifierExiste(page: Page, version: Version, nom: string): Promise<void> {
    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
    const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);

    if (version === 'v1') {
      const existe = await CompetencesPrimitives.competenceExiste(page, version, nom);
      expect(existe).toBeTruthy();
    } else {
      await expect(
        page.locator(rowSelector).filter({ hasText: nom })
      ).toBeVisible();
    }
  }

  static async verifierAbsente(page: Page, version: Version, nom: string): Promise<void> {
    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);

    if (version === 'v1') {
      await page.waitForTimeout(3000);
      const existe = await CompetencesPrimitives.competenceExiste(page, version, nom);
      expect(existe).toBeFalsy();
    } else {
      await expect(
        page.locator(rowSelector).filter({ hasText: nom })
      ).toHaveCount(0);
    }
  }

  static async verifierVisibilite(page: Page, version: Version, nom: string, attenduVisible: boolean): Promise<void> {
    const row = await CompetencesPrimitives.trouverLigneParNom(page, version, nom);
    await row.scrollIntoViewIfNeeded();

    const checkbox = row
      .locator(getSelector(SECTION_COMPETENCES.COL_AFFICHER, version))
      .locator('input[type="checkbox"]');

    if (attenduVisible) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }
}
