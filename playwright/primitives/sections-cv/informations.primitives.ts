import { Page, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_INFORMATIONS
} from '../../config/section/selectors-informations.config';

const FIXTURE_PRENOM         = 'Jean';
const FIXTURE_NOM            = 'Dupont';
const FIXTURE_DATE_NAISSANCE = '15/06/1995';
const FIXTURE_DEBUT_ACTIVITE = '01/09/2018';
const FIXTURE_PHOTO          = 'cypress/fixtures/photo-test.jpg';

export class InformationsPrimitives {

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(2500);
  }

  // Extrait le data-cy du sélecteur v1 pour un ciblage plus résilient
  private static extraireDataCy(selector: string): string {
    const match = selector.match(/\[data-cy="([^"]+)"\]/);
    return match ? match[1] : '';
  }

  // En v1 les sélecteurs pointent sur le wrapper mat-form-field-infix.
  // Le chaînage > profond est fragile si Angular modifie le DOM.
  // On utilise [data-cy] input[matinput] comme fallback résilient.
  private static async trouverInputV1(page: Page, selector: string): Promise<import('@playwright/test').Locator> {
    const dataCy = InformationsPrimitives.extraireDataCy(selector);
    if (dataCy) {
      // Sélecteur résilient : data-cy + input matinput
      return page.locator(`[data-cy="${dataCy}"] input[matinput]`).first();
    }
    return page.locator(selector).locator('input').first();
  }

  private static async saisirChampTexte(
    page: Page,
    version: Version,
    selectorMap: { v1: string; v2: string },
    valeur: string
  ): Promise<void> {
    const selector = getSelector(selectorMap, version);

    if (version === 'v1') {
      const input = await InformationsPrimitives.trouverInputV1(page, selector);
      await input.waitFor({ state: 'visible', timeout: 10_000 });
      await input.clear();
      await input.fill(valeur);
      await input.blur();
    } else {
      const el = page.locator(selector);
      await el.waitFor({ state: 'visible', timeout: 10_000 });
      await el.clear();
      await el.fill(valeur);
      await el.blur();
    }

    await InformationsPrimitives.attendreAutoSave(page);
  }

  private static async verifierChampTexte(
    page: Page,
    version: Version,
    selectorMap: { v1: string; v2: string },
    valeur: string
  ): Promise<void> {
    const selector = getSelector(selectorMap, version);

    if (version === 'v1') {
      const input = await InformationsPrimitives.trouverInputV1(page, selector);
      await expect(input).toHaveValue(valeur, { timeout: 10_000 });
    } else {
      await expect(page.locator(selector)).toHaveValue(valeur, { timeout: 10_000 });
    }
  }

  private static async saisirChampDate(
    page: Page,
    version: Version,
    selectorMap: { v1: string; v2: string },
    valeur: string
  ): Promise<void> {
    const loc = page.locator(getSelector(selectorMap, version));
    await loc.waitFor({ state: 'visible', timeout: 10_000 });
    await loc.click({ force: true });
    await loc.clear();
    await loc.fill(valeur);
    await loc.blur();
    await InformationsPrimitives.attendreAutoSave(page);
  }

  private static async verifierChampDate(
    page: Page,
    version: Version,
    selectorMap: { v1: string; v2: string },
    valeur: string
  ): Promise<void> {
    await expect(
      page.locator(getSelector(selectorMap, version))
    ).toHaveValue(valeur, { timeout: 10_000 });
  }

  // Photo de profil

  static async uploaderPhoto(page: Page, version: Version, cheminFichier: string = FIXTURE_PHOTO): Promise<void> {
    const loc = page.locator(getSelector(SECTION_INFORMATIONS.PHOTO_UPLOAD_ZONE, version));
    await loc.waitFor({ state: 'attached', timeout: 10_000 });
    await loc.setInputFiles(cheminFichier);
    await InformationsPrimitives.attendreAutoSave(page);
  }

  static async verifierPhotoPresente(page: Page, version: Version): Promise<void> {
    const previewSelector = getSelector(SECTION_INFORMATIONS.PHOTO_PREVIEW, version);

    if (version === 'v1') {
      await expect(page.locator(previewSelector).locator('img')).toBeVisible({ timeout: 10_000 });
    } else {
      await expect(page.locator(previewSelector)).toBeVisible({ timeout: 10_000 });
    }
  }

  // Email (lecture seule)

  static async verifierEmailAffiche(page: Page, version: Version): Promise<void> {
    await expect(
      page.locator(getSelector(SECTION_INFORMATIONS.EMAIL_DISPLAY, version)).first()
    ).toBeVisible({ timeout: 10_000 });
  }

  static async verifierEmailNonEditable(page: Page, version: Version): Promise<void> {
    const loc = page.locator(getSelector(SECTION_INFORMATIONS.EMAIL_DISPLAY, version)).first();
    await expect(loc).toBeVisible({ timeout: 10_000 });

    const tagName = await loc.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).not.toBe('input');

    const contentEditable = await loc.getAttribute('contenteditable');
    expect(contentEditable).not.toBe('true');
  }

  // Prénom

  static async modifierPrenom(page: Page, version: Version, valeur: string = FIXTURE_PRENOM): Promise<void> {
    await InformationsPrimitives.saisirChampTexte(page, version, SECTION_INFORMATIONS.INPUT_PRENOM, valeur);
  }

  static async verifierPrenom(page: Page, version: Version, valeur: string = FIXTURE_PRENOM): Promise<void> {
    await InformationsPrimitives.verifierChampTexte(page, version, SECTION_INFORMATIONS.INPUT_PRENOM, valeur);
  }

  // Nom

  static async modifierNom(page: Page, version: Version, valeur: string = FIXTURE_NOM): Promise<void> {
    await InformationsPrimitives.saisirChampTexte(page, version, SECTION_INFORMATIONS.INPUT_NOM, valeur);
  }

  static async verifierNom(page: Page, version: Version, valeur: string = FIXTURE_NOM): Promise<void> {
    await InformationsPrimitives.verifierChampTexte(page, version, SECTION_INFORMATIONS.INPUT_NOM, valeur);
  }

  // Date de naissance

  static async modifierDateNaissance(page: Page, version: Version, valeur: string = FIXTURE_DATE_NAISSANCE): Promise<void> {
    await InformationsPrimitives.saisirChampDate(page, version, SECTION_INFORMATIONS.INPUT_DATE_NAISSANCE, valeur);
  }

  static async verifierDateNaissance(page: Page, version: Version, valeur: string = FIXTURE_DATE_NAISSANCE): Promise<void> {
    await InformationsPrimitives.verifierChampDate(page, version, SECTION_INFORMATIONS.INPUT_DATE_NAISSANCE, valeur);
  }

  // Début d'activité

  static async modifierDebutActivite(page: Page, version: Version, valeur: string = FIXTURE_DEBUT_ACTIVITE): Promise<void> {
    await InformationsPrimitives.saisirChampDate(page, version, SECTION_INFORMATIONS.INPUT_DEBUT_ACTIVITE, valeur);
  }

  static async verifierDebutActivite(page: Page, version: Version, valeur: string = FIXTURE_DEBUT_ACTIVITE): Promise<void> {
    await InformationsPrimitives.verifierChampDate(page, version, SECTION_INFORMATIONS.INPUT_DEBUT_ACTIVITE, valeur);
  }
}
