import { Page, Locator, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_TECHNOLOGIES,
  DELAIS,
  experienceVersUI
} from '../../config/section/selectors-technologies.config';

const FIXTURE_TECHNO = {
  categorie: 'Développement',
  nom: 'Angular',
  experience: '3 ANS'
};

export class TechnologiesPrimitives {

  // Utilitaires

  private static normaliserTexte(valeur: string): string {
    return (valeur || '').replace(/\s+/g, ' ').trim();
  }

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(DELAIS.AUTO_SAVE);
  }

  private static async choisirOptionVisible(page: Page, valeur: string): Promise<void> {
    const texte = TechnologiesPrimitives.normaliserTexte(valeur);
    const regex = new RegExp(`^\\s*${texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i');

    // NOTE: Le sélecteur PANEL_OPTIONS_VISIBLE du config utilise :visible (jQuery),
    // qui n'est PAS un pseudo-sélecteur CSS valide en Playwright.
    // On utilise directement les sélecteurs Material sans :visible.
    const panel = page.locator('.mat-mdc-select-panel, .mat-select-panel').last();
    await panel.waitFor({ state: 'visible', timeout: 10000 });

    const option = panel.locator('mat-option, mat-mdc-option').filter({ hasText: regex });
    await option.scrollIntoViewIfNeeded();
    await option.click({ force: true });
  }

  private static async selectionnerDansDropdown(page: Page, locator: Locator, valeur: string): Promise<void> {
    const tagName = await locator.evaluate(el => el.tagName.toLowerCase());

    if (tagName === 'select') {
      await locator.selectOption(valeur, { force: true });
    } else {
      const selectInside = locator.locator('select');
      if ((await selectInside.count()) > 0) {
        await selectInside.selectOption(valeur, { force: true });
      } else {
        await locator.scrollIntoViewIfNeeded();
        await locator.click({ force: true });
        await TechnologiesPrimitives.choisirOptionVisible(page, valeur);
      }
    }
  }

  // Catégories

  private static async categorieExisteDejaV1(page: Page, categorie: string): Promise<boolean> {
    const selectCat = getSelector(SECTION_TECHNOLOGIES.SELECT_CATEGORIE, 'v1');
    const selects = page.locator(selectCat);
    const count = await selects.count();

    for (let i = 0; i < count; i++) {
      const texte = TechnologiesPrimitives.normaliserTexte(await selects.nth(i).innerText());
      if (texte.includes(TechnologiesPrimitives.normaliserTexte(categorie))) {
        return true;
      }
    }
    return false;
  }

  private static async ajouterNouvelleCategorieV1(page: Page, categorie: string): Promise<void> {
    const selectCat = getSelector(SECTION_TECHNOLOGIES.SELECT_CATEGORIE, 'v1');
    const inputTechno = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, 'v1');

    const lastSelect = page.locator(selectCat).last();
    await lastSelect.scrollIntoViewIfNeeded();
    await lastSelect.click({ force: true });

    await TechnologiesPrimitives.choisirOptionVisible(page, categorie);
    await page.waitForTimeout(DELAIS.RENDU_UI);
    await page.locator(inputTechno).first().waitFor({ state: 'attached', timeout: 10000 });
  }

  private static async assurerCategorie(page: Page, version: Version, categorie: string): Promise<void> {
    if (version === 'v1') {
      const existe = await TechnologiesPrimitives.categorieExisteDejaV1(page, categorie);
      if (!existe) {
        await TechnologiesPrimitives.ajouterNouvelleCategorieV1(page, categorie);
      }
      return;
    }

    const selectCategorie = getSelector(SECTION_TECHNOLOGIES.SELECT_CATEGORIE, version);
    const el = page.locator(selectCategorie);
    await TechnologiesPrimitives.selectionnerDansDropdown(page, el, categorie);
    await page.waitForTimeout(DELAIS.RENDU_UI);
  }

  private static async trouverInputsDansBloc(
    page: Page, categorie: string
  ): Promise<{ inputs: Locator[]; catIndex: number }> {
    const selectCat = getSelector(SECTION_TECHNOLOGIES.SELECT_CATEGORIE, 'v1');
    const inputTechno = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, 'v1');

    const selects = page.locator(selectCat);
    const selectCount = await selects.count();

    let targetIdx = -1;
    for (let i = 0; i < selectCount; i++) {
      const texte = TechnologiesPrimitives.normaliserTexte(await selects.nth(i).innerText());
      if (texte.includes(TechnologiesPrimitives.normaliserTexte(categorie))) {
        targetIdx = i;
        break;
      }
    }

    if (targetIdx === -1) {
      return { inputs: [], catIndex: -1 };
    }

    // Get bounding boxes of category selects to scope inputs
    const catBox = await selects.nth(targetIdx).boundingBox();
    const nextCatBox = targetIdx + 1 < selectCount
      ? await selects.nth(targetIdx + 1).boundingBox()
      : null;

    const allInputs = page.locator(inputTechno);
    const allCount = await allInputs.count();
    const scopedInputs: Locator[] = [];

    for (let i = 0; i < allCount; i++) {
      const box = await allInputs.nth(i).boundingBox();
      if (!box || !catBox) continue;
      const isAfter = box.y > catBox.y;
      const isBefore = nextCatBox ? box.y < nextCatBox.y : true;
      if (isAfter && isBefore) {
        scopedInputs.push(allInputs.nth(i));
      }
    }

    return { inputs: scopedInputs, catIndex: targetIdx };
  }

  private static async trouverDerniereLigneVideV1(page: Page, categorie: string): Promise<Locator> {
    const inputTechno = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, 'v1');
    const rowSelector = getSelector(SECTION_TECHNOLOGIES.ROW, 'v1');
    const selectExp = getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, 'v1');

    const { inputs, catIndex } = await TechnologiesPrimitives.trouverInputsDansBloc(page, categorie);

    if (catIndex === -1) {
      await TechnologiesPrimitives.ajouterNouvelleCategorieV1(page, categorie);
      // After adding category, find the last empty input
      const allInputs = page.locator(inputTechno);
      const count = await allInputs.count();
      for (let i = count - 1; i >= 0; i--) {
        const val = await allInputs.nth(i).inputValue();
        if (!val.trim()) {
          return allInputs.nth(i).locator(`xpath=ancestor::*[contains(@class,"custom-form-item")]`).first();
        }
      }
      throw new Error(`Aucune ligne vide trouvée après ajout de la catégorie "${categorie}"`);
    }

    // Find empty input in scoped inputs
    for (const input of inputs) {
      const val = await input.inputValue();
      if (!val.trim()) {
        return input.locator(`xpath=ancestor::*[contains(@class,"custom-form-item")]`).first();
      }
    }

    // No empty line - fill experience on last row to unblock
    if (inputs.length > 0) {
      const lastInput = inputs[inputs.length - 1];
      const lastRow = lastInput.locator(`xpath=ancestor::*[contains(@class,"custom-form-item")]`).first();
      await lastRow.scrollIntoViewIfNeeded();

      const expSelect = lastRow.locator(selectExp);
      await expSelect.scrollIntoViewIfNeeded();
      await expSelect.click({ force: true });

      const panelSelector = getSelector(SECTION_TECHNOLOGIES.PANEL_OPTIONS_VISIBLE, 'v1');
      const panel = page.locator(panelSelector).last();
      await panel.waitFor({ state: 'visible', timeout: 10000 });
      await panel.locator('mat-option, mat-mdc-option').first().click({ force: true });

      await page.waitForTimeout(DELAIS.RENDU_UI_LONG);

      // Retry finding empty input
      const { inputs: refreshed } = await TechnologiesPrimitives.trouverInputsDansBloc(page, categorie);
      for (const input of refreshed) {
        const val = await input.inputValue();
        if (!val.trim()) {
          return input.locator(`xpath=ancestor::*[contains(@class,"custom-form-item")]`).first();
        }
      }
    }

    throw new Error(`Aucune ligne vide dans "${categorie}" même après remplissage de l'expérience`);
  }

  private static async choisirExperienceDansLigneV1(page: Page, row: Locator, experience: string): Promise<void> {
    const selectExp = getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, 'v1');
    const expEl = row.locator(selectExp);
    await expEl.waitFor({ state: 'visible', timeout: 10000 });
    await expEl.scrollIntoViewIfNeeded();
    await expEl.click({ force: true });

    await TechnologiesPrimitives.choisirOptionVisible(page, experience);
  }

  private static async setCheckboxDansLigne(page: Page, version: Version, row: Locator, attenduCoche: boolean): Promise<void> {
    const checkboxSelector = getSelector(SECTION_TECHNOLOGIES.COL_AFFICHER, version);
    const root = row.locator(checkboxSelector);
    const input = root.locator('input[type="checkbox"]').first();

    if ((await input.count()) > 0) {
      const isChecked = await input.isChecked();
      if (isChecked !== attenduCoche) {
        await input.click({ force: true });
      }
    } else {
      await root.click({ force: true });
    }
  }

  // Suppression récursive (v1)

  private static async supprimerToutesOccurrencesV1(page: Page, nom: string): Promise<void> {
    const inputTechno = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, 'v1');
    const rowSelector = getSelector(SECTION_TECHNOLOGIES.ROW, 'v1');
    const btnSupprimer = getSelector(SECTION_TECHNOLOGIES.BTN_SUPPRIMER, 'v1');

    const allInputs = page.locator(inputTechno);
    const count = await allInputs.count();

    let foundIdx = -1;
    for (let i = count - 1; i >= 0; i--) {
      const val = TechnologiesPrimitives.normaliserTexte(await allInputs.nth(i).inputValue());
      if (val === TechnologiesPrimitives.normaliserTexte(nom)) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx === -1) return;

    const row = allInputs.nth(foundIdx).locator(`xpath=ancestor::*[contains(@class,"custom-form-item")]`).first();
    await row.scrollIntoViewIfNeeded();
    await row.locator(btnSupprimer).first().click({ force: true });

    await page.waitForTimeout(DELAIS.RENDU_UI);
    await TechnologiesPrimitives.supprimerToutesOccurrencesV1(page, nom);
  }

  // Actions principales (API publique)

  static async selectionnerCategorie(page: Page, version: Version, categorie: string): Promise<void> {
    await TechnologiesPrimitives.assurerCategorie(page, version, categorie);
  }

  static async trouverLigneParNom(page: Page, version: Version, nom: string): Promise<Locator> {
    const inputTechno = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, 'v1');
    const rowSelector = getSelector(SECTION_TECHNOLOGIES.ROW, version);

    if (version === 'v1') {
      const allInputs = page.locator(inputTechno).filter({ has: page.locator(':visible') });
      const visibleInputs = page.locator(`${inputTechno}:visible`);

      // Fallback: iterate all inputs
      const inputs = page.locator(inputTechno);
      const count = await inputs.count();
      for (let i = count - 1; i >= 0; i--) {
        const val = TechnologiesPrimitives.normaliserTexte(await inputs.nth(i).inputValue());
        if (val === TechnologiesPrimitives.normaliserTexte(nom)) {
          const row = inputs.nth(i).locator(`xpath=ancestor::*[contains(@class,"custom-form-item")]`).first();
          await row.scrollIntoViewIfNeeded();
          return row;
        }
      }
      throw new Error(`Technologie "${nom}" non trouvée`);
    }

    return page.locator(rowSelector).filter({ hasText: nom });
  }

  static async ajouterTechnologie(
    page: Page,
    version: Version,
    categorie: string = FIXTURE_TECHNO.categorie,
    nom: string = FIXTURE_TECHNO.nom,
    experience?: string
  ): Promise<void> {
    await TechnologiesPrimitives.assurerCategorie(page, version, categorie);

    if (version === 'v1') {
      const inputTechno = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, 'v1');

      const row = await TechnologiesPrimitives.trouverDerniereLigneVideV1(page, categorie);
      const input = row.locator(inputTechno);
      await input.waitFor({ state: 'visible', timeout: 10000 });
      await input.clear();
      await input.fill(nom);
      await input.blur();

      await page.waitForTimeout(DELAIS.RENDU_UI_COURT);

      if (experience) {
        await TechnologiesPrimitives.choisirExperienceDansLigneV1(page, row, experience);
      }

      await TechnologiesPrimitives.attendreAutoSave(page);
      return;
    }

    // Version générique (v2+)
    const rowSelector = getSelector(SECTION_TECHNOLOGIES.ROW, version);
    const inputTechno = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, version);
    const selectExperience = getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, version);

    const lastRow = page.locator(rowSelector).last();
    await lastRow.scrollIntoViewIfNeeded();
    await lastRow.locator(inputTechno).clear();
    await lastRow.locator(inputTechno).fill(nom);
    await lastRow.locator(inputTechno).blur();

    if (experience) {
      const expEl = lastRow.locator(selectExperience);
      await TechnologiesPrimitives.selectionnerDansDropdown(page, expEl, experience);
    }

    await TechnologiesPrimitives.attendreAutoSave(page);
  }

  static async modifierExperience(
    page: Page,
    version: Version,
    categorie: string,
    nom: string,
    nouvelleExperience: string
  ): Promise<void> {
    await TechnologiesPrimitives.assurerCategorie(page, version, categorie);
    const row = await TechnologiesPrimitives.trouverLigneParNom(page, version, nom);

    if (version === 'v1') {
      await TechnologiesPrimitives.choisirExperienceDansLigneV1(page, row, nouvelleExperience);
      await TechnologiesPrimitives.attendreAutoSave(page);
      return;
    }

    const selectExperience = getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, version);
    const expEl = row.locator(selectExperience);
    await TechnologiesPrimitives.selectionnerDansDropdown(page, expEl, nouvelleExperience);
    await TechnologiesPrimitives.attendreAutoSave(page);
  }

  static async supprimerTechnologie(page: Page, version: Version, categorie: string, nom: string): Promise<void> {
    await TechnologiesPrimitives.assurerCategorie(page, version, categorie);

    if (version === 'v1') {
      await TechnologiesPrimitives.supprimerToutesOccurrencesV1(page, nom);
      await TechnologiesPrimitives.attendreAutoSave(page);
      return;
    }

    const row = await TechnologiesPrimitives.trouverLigneParNom(page, version, nom);
    await row.locator(getSelector(SECTION_TECHNOLOGIES.BTN_SUPPRIMER, version)).click({ force: true });
    await TechnologiesPrimitives.attendreAutoSave(page);
  }

  static async toggleVisibilite(
    page: Page,
    version: Version,
    categorie: string,
    nom: string,
    activer: boolean
  ): Promise<void> {
    await TechnologiesPrimitives.assurerCategorie(page, version, categorie);
    const row = await TechnologiesPrimitives.trouverLigneParNom(page, version, nom);
    await TechnologiesPrimitives.setCheckboxDansLigne(page, version, row, activer);
    await TechnologiesPrimitives.attendreAutoSave(page);
  }

  // Vérifications

  static async verifierTechnologieExiste(
    page: Page,
    version: Version,
    categorie: string,
    nom: string
  ): Promise<void> {
    if (version === 'v1') {
      const inputTechno = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, 'v1');
      const inputs = page.locator(inputTechno);
      const count = await inputs.count();
      let found = false;
      for (let i = 0; i < count; i++) {
        const val = TechnologiesPrimitives.normaliserTexte(await inputs.nth(i).inputValue());
        if (val === TechnologiesPrimitives.normaliserTexte(nom)) { found = true; break; }
      }
      expect(found).toBeTruthy();
      return;
    }

    await TechnologiesPrimitives.assurerCategorie(page, version, categorie);
    const rowSelector = getSelector(SECTION_TECHNOLOGIES.ROW, version);
    const count = await page.locator(rowSelector).filter({ hasText: nom }).count();
    expect(count).toBeGreaterThan(0);
  }

  static async verifierTechnologieAbsente(
    page: Page,
    version: Version,
    categorie: string,
    nom: string
  ): Promise<void> {
    if (version === 'v1') {
      await page.waitForTimeout(DELAIS.VERIFICATION);

      const inputTechno = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, 'v1');
      const inputs = page.locator(inputTechno);
      const count = await inputs.count();
      let found = false;
      for (let i = 0; i < count; i++) {
        const val = TechnologiesPrimitives.normaliserTexte(await inputs.nth(i).inputValue());
        if (val === TechnologiesPrimitives.normaliserTexte(nom)) { found = true; break; }
      }
      expect(found).toBeFalsy();
      return;
    }

    await TechnologiesPrimitives.assurerCategorie(page, version, categorie);
    await page.waitForTimeout(DELAIS.VERIFICATION);

    const rowSelector = getSelector(SECTION_TECHNOLOGIES.ROW, version);
    const count = await page.locator(rowSelector).filter({ hasText: nom }).count();
    expect(count).toBe(0);
  }

  static async verifierVisibilite(
    page: Page,
    version: Version,
    categorie: string,
    nom: string,
    attenduVisible: boolean
  ): Promise<void> {
    await TechnologiesPrimitives.assurerCategorie(page, version, categorie);
    const row = await TechnologiesPrimitives.trouverLigneParNom(page, version, nom);

    const checkboxSelector = getSelector(SECTION_TECHNOLOGIES.COL_AFFICHER, version);
    const input = row.locator(checkboxSelector).locator('input[type="checkbox"]').first();

    if ((await input.count()) > 0) {
      const isChecked = await input.isChecked();
      expect(isChecked).toBe(attenduVisible);
    }
  }

  static async verifierExperience(
    page: Page,
    version: Version,
    categorie: string,
    nom: string,
    experienceAttendue: string
  ): Promise<void> {
    const experienceUI = experienceVersUI(experienceAttendue, version);

    await TechnologiesPrimitives.assurerCategorie(page, version, categorie);
    const row = await TechnologiesPrimitives.trouverLigneParNom(page, version, nom);

    const selector = version === 'v1'
      ? getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, 'v1')
      : getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, version);

    const text = await row.locator(selector).innerText();
    expect(
      TechnologiesPrimitives.normaliserTexte(text).toLowerCase()
    ).toContain(
      TechnologiesPrimitives.normaliserTexte(experienceUI).toLowerCase()
    );
  }
}
