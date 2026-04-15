import { Page, Locator, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_MISSIONS
} from '../../config/section/selectors-missions.config';
import { fermerOverlays } from '../shared/overlay.utils';

interface MissionData {
  role: string;
  societe: string;
  lieu?: string;
  debut?: string;
  fin?: string;
  contexte?: string;
  taches?: string;
  actions?: string;
  resultats?: string;
  technologies?: string;
}

const FIXTURE_MISSION: MissionData = {
  role: 'Consultant Senior',
  societe: 'Redsen Consulting',
  lieu: 'Lausanne, Suisse',
  debut: '01/2024',
  fin: '06/2024'
};

const FIXTURE_MISSION_MODIFIEE: MissionData = {
  role: 'Lead Consultant',
  societe: 'Anthropic',
  lieu: 'Paris, France',
  debut: '07/2024',
  fin: '12/2024'
};

export class MissionsPrimitives {

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(2500);
  }

  private static async remplirChamp(page: Page, selector: string, valeur: string): Promise<void> {
    const loc = page.locator(selector);
    await loc.waitFor({ state: 'visible', timeout: 10_000 });
    await loc.scrollIntoViewIfNeeded();
    await loc.click();
    await loc.clear();
    await loc.fill(valeur);
    await loc.blur();
  }

  // CKEditor : simuler un collage (paste) via clipboard
  private static async remplirEditeurCKEditor(page: Page, selector: string, valeur: string): Promise<void> {
    const editor = page.locator(selector);
    await editor.waitFor({ state: 'visible', timeout: 10_000 });
    await editor.scrollIntoViewIfNeeded();
    await editor.click({ force: true });

    // Attendre que CKEditor soit focalisé
    await page.waitForTimeout(500);

    // Simuler un paste via l'API clipboard du navigateur
    await page.evaluate(({ sel, txt }: { sel: string; txt: string }) => {
      const el = document.querySelector(sel);
      if (!el) return;

      const win = el.ownerDocument.defaultView!;
      const dataTransfer = new win.DataTransfer();
      dataTransfer.setData('text/plain', txt);
      dataTransfer.setData('text/html', `<p>${txt}</p>`);

      const pasteEvent = new win.ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer
      });

      el.dispatchEvent(pasteEvent);
    }, { sel: selector, txt: valeur });

    await page.waitForTimeout(500);
    await expect(editor).toContainText(valeur.substring(0, 20));

    // Défocaliser
    await page.mouse.click(0, 0);
    await page.waitForTimeout(500);
  }

  private static async cliquerBoutonTexte(page: Page, texte: string): Promise<void> {
    const btn = page.locator('button').filter({ hasText: texte });
    await btn.waitFor({ state: 'visible', timeout: 10_000 });
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
  }

  // Navigation vers une section dans le menu
  private static async naviguerVersSection(page: Page, sectionNom: string): Promise<void> {
    await page.locator('mat-sidenav a, nav a, .sidebar a').filter({ hasText: sectionNom }).click({ force: true });
    await page.waitForTimeout(1000);
  }

  // Garantir qu'une expérience existe (dépendance)
  static async garantirExperienceExistePourMission(
    page: Page, version: Version, titreExperience: string
  ): Promise<void> {
    // Importer dynamiquement pour éviter les dépendances circulaires
    const { ExperiencesPrimitives } = await import('./experiences.primitives');

    await MissionsPrimitives.naviguerVersSection(page, 'Expériences');
    await page.waitForTimeout(1000);
    await ExperiencesPrimitives.garantirExperienceExiste(page, version, titreExperience);

    await MissionsPrimitives.naviguerVersSection(page, 'Missions');
    await page.waitForTimeout(1000);
  }

  // Recherche

  static async trouverMissionParRole(page: Page, version: Version, role: string): Promise<void> {
    const itemSelector = getSelector(SECTION_MISSIONS.ITEM, version);

    // Fermer tout overlay CDK qui pourrait bloquer le clic
    await fermerOverlays(page);

    if (version === 'v1') {
      const items = page.locator(itemSelector);
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        const line2 = items.nth(i).locator('.line-2');
        const text = await line2.innerText();
        if (text.trim() === role) {
          await items.nth(i).scrollIntoViewIfNeeded();
          await items.nth(i).click();
          break;
        }
      }
    } else {
      await page.locator(itemSelector).filter({ hasText: role }).scrollIntoViewIfNeeded();
      await page.locator(itemSelector).filter({ hasText: role }).click();
    }

    await page.waitForTimeout(1000);
  }

  private static async missionExiste(page: Page, version: Version, role: string): Promise<boolean> {
    const itemSelector = getSelector(SECTION_MISSIONS.ITEM, version);

    if (version === 'v1') {
      const items = page.locator(itemSelector);
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        const line2Text = await items.nth(i).locator('.line-2').innerText();
        if (line2Text.trim() === role) return true;
      }
      return false;
    } else {
      return (await page.locator(itemSelector).filter({ hasText: role }).count()) > 0;
    }
  }

  // Préparation

  static async garantirMissionExiste(page: Page, version: Version, role: string): Promise<void> {
    const existe = await MissionsPrimitives.missionExiste(page, version, role);
    if (!existe) {
      await MissionsPrimitives.ajouterMission(page, version, { role, societe: FIXTURE_MISSION.societe, lieu: FIXTURE_MISSION.lieu, debut: FIXTURE_MISSION.debut });
    }
  }

  // Ajout

  static async ajouterMission(page: Page, version: Version, data: MissionData = FIXTURE_MISSION): Promise<void> {
    await MissionsPrimitives.cliquerBoutonTexte(page, 'Ajouter une mission');
    await page.waitForTimeout(1000);

    if (data.societe) await MissionsPrimitives.remplirChamp(page, getSelector(SECTION_MISSIONS.INPUT_SOCIETE, version), data.societe);
    if (data.role) await MissionsPrimitives.remplirChamp(page, getSelector(SECTION_MISSIONS.INPUT_ROLE, version), data.role);
    if (data.lieu) await MissionsPrimitives.remplirChamp(page, getSelector(SECTION_MISSIONS.INPUT_LIEU, version), data.lieu);
    if (data.debut) await MissionsPrimitives.remplirChamp(page, getSelector(SECTION_MISSIONS.INPUT_DEBUT, version), data.debut);
    if (data.fin) await MissionsPrimitives.remplirChamp(page, getSelector(SECTION_MISSIONS.INPUT_FIN, version), data.fin);

    if (data.contexte) await MissionsPrimitives.remplirEditeurCKEditor(page, getSelector(SECTION_MISSIONS.EDITOR_CONTEXTE, version), data.contexte);
    if (data.taches) await MissionsPrimitives.remplirEditeurCKEditor(page, getSelector(SECTION_MISSIONS.EDITOR_TACHES, version), data.taches);
    if (data.actions) await MissionsPrimitives.remplirEditeurCKEditor(page, getSelector(SECTION_MISSIONS.EDITOR_ACTIONS, version), data.actions);
    if (data.resultats) await MissionsPrimitives.remplirEditeurCKEditor(page, getSelector(SECTION_MISSIONS.EDITOR_RESULTATS, version), data.resultats);
    if (data.technologies) await MissionsPrimitives.remplirEditeurCKEditor(page, getSelector(SECTION_MISSIONS.EDITOR_TECHNOLOGIES, version), data.technologies);

    await MissionsPrimitives.cliquerBoutonTexte(page, 'Enregistrer');
    await MissionsPrimitives.attendreAutoSave(page);
  }

  // Modification

  static async modifierMission(page: Page, version: Version, ancienRole: string, nouvelleData: Partial<MissionData> = FIXTURE_MISSION_MODIFIEE): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, ancienRole);

    if (nouvelleData.role) await MissionsPrimitives.remplirChamp(page, getSelector(SECTION_MISSIONS.INPUT_ROLE, version), nouvelleData.role);
    if (nouvelleData.societe) await MissionsPrimitives.remplirChamp(page, getSelector(SECTION_MISSIONS.INPUT_SOCIETE, version), nouvelleData.societe);
    if (nouvelleData.lieu) await MissionsPrimitives.remplirChamp(page, getSelector(SECTION_MISSIONS.INPUT_LIEU, version), nouvelleData.lieu);

    await MissionsPrimitives.cliquerBoutonTexte(page, 'Enregistrer');
    await MissionsPrimitives.attendreAutoSave(page);
  }

  // Copie

  static async copierMission(page: Page, version: Version, role: string): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, role);
    await MissionsPrimitives.cliquerBoutonTexte(page, 'Copier la mission');
    await MissionsPrimitives.attendreAutoSave(page);
  }

  // Suppression

  static async supprimerMission(page: Page, version: Version, role: string): Promise<void> {
    const supprimerSiExiste = async (): Promise<void> => {
      const existe = await MissionsPrimitives.missionExiste(page, version, role);
      if (existe) {
        await MissionsPrimitives.trouverMissionParRole(page, version, role);

        if (version === 'v1') {
          await page.locator(getSelector(SECTION_MISSIONS.BTN_MENU_CONTEXTUEL, version)).last().click({ force: true });
          await page.locator('.mat-mdc-menu-panel').waitFor({ state: 'visible' });
          await page.locator('.mat-mdc-menu-panel button').filter({ hasText: 'Supprimer la mission' }).click();
        } else {
          await page.locator(getSelector(SECTION_MISSIONS.BTN_SUPPRIMER, version)).click();
        }
        await page.waitForTimeout(2500);
        await supprimerSiExiste();
      }
    };
    await supprimerSiExiste();
  }

  // Confidentialité

  static async toggleConfidentiel(page: Page, version: Version, role: string, activer: boolean): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, role);

    const sel = getSelector(SECTION_MISSIONS.CHECKBOX_CONFIDENTIEL, version);
    const checkbox = page.locator(sel).locator('input[type="checkbox"]');
    await page.locator(sel).scrollIntoViewIfNeeded();

    const isChecked = await checkbox.isChecked();
    if ((activer && !isChecked) || (!activer && isChecked)) {
      await checkbox.click({ force: true });
    }

    await MissionsPrimitives.cliquerBoutonTexte(page, 'Enregistrer');
    await MissionsPrimitives.attendreAutoSave(page);
  }

  // Inclusion/exclusion du CV

  static async toggleInclusionCV(page: Page, version: Version, role: string, inclure: boolean): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, role);

    const sel = getSelector(SECTION_MISSIONS.CHECKBOX_INCLURE_CV, version);
    const checkbox = page.locator(sel).locator('input[type="checkbox"]');
    await page.locator(sel).scrollIntoViewIfNeeded();

    const isChecked = await checkbox.isChecked();
    if ((inclure && !isChecked) || (!inclure && isChecked)) {
      await checkbox.click({ force: true });
    }

    await MissionsPrimitives.cliquerBoutonTexte(page, 'Enregistrer');
    await MissionsPrimitives.attendreAutoSave(page);
  }

  // Association à une expérience

  static async associerExperience(page: Page, version: Version, role: string, titreExperience: string): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, role);

    const sel = getSelector(SECTION_MISSIONS.SELECT_EXPERIENCE, version);

    if (version === 'v1') {
      await page.locator(sel).click({ force: true });
      await page.locator('.cdk-overlay-container mat-option').filter({ hasText: titreExperience }).click({ force: true });
    } else {
      await page.locator(sel).selectOption(titreExperience);
    }

    await MissionsPrimitives.cliquerBoutonTexte(page, 'Enregistrer');
    await MissionsPrimitives.attendreAutoSave(page);
  }

  // Renseigner les éditeurs CKEditor

  static async renseignerContenu(
    page: Page, version: Version, role: string,
    champ: 'contexte' | 'taches' | 'actions' | 'resultats' | 'technologies',
    contenu: string
  ): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, role);

    const selectorMap: Record<string, { v1: string; v2: string }> = {
      contexte: SECTION_MISSIONS.EDITOR_CONTEXTE,
      taches: SECTION_MISSIONS.EDITOR_TACHES,
      actions: SECTION_MISSIONS.EDITOR_ACTIONS,
      resultats: SECTION_MISSIONS.EDITOR_RESULTATS,
      technologies: SECTION_MISSIONS.EDITOR_TECHNOLOGIES
    };

    await MissionsPrimitives.remplirEditeurCKEditor(page, getSelector(selectorMap[champ], version), contenu);

    await MissionsPrimitives.cliquerBoutonTexte(page, 'Enregistrer');
    await MissionsPrimitives.attendreAutoSave(page);
  }

  // Vérifications

  static async verifierExiste(page: Page, version: Version, role: string): Promise<void> {
    const found = await MissionsPrimitives.missionExiste(page, version, role);
    expect(found).toBeTruthy();
  }

  static async verifierAbsente(page: Page, version: Version, role: string): Promise<void> {
    await page.waitForTimeout(3000);
    const found = await MissionsPrimitives.missionExiste(page, version, role);
    expect(found).toBeFalsy();
  }

  static async verifierChamps(page: Page, version: Version, role: string, societe: string, lieu: string): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, role);

    await expect(page.locator(getSelector(SECTION_MISSIONS.INPUT_SOCIETE, version))).toHaveValue(societe, { timeout: 10_000 });
    await expect(page.locator(getSelector(SECTION_MISSIONS.INPUT_LIEU, version))).toHaveValue(lieu);
  }

  static async verifierConfidentiel(page: Page, version: Version, role: string, attenduConfidentiel: boolean): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, role);

    const checkbox = page.locator(getSelector(SECTION_MISSIONS.CHECKBOX_CONFIDENTIEL, version)).locator('input[type="checkbox"]');
    if (attenduConfidentiel) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }

  static async verifierInclusionCV(page: Page, version: Version, role: string, attenduInclus: boolean): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, role);

    const checkbox = page.locator(getSelector(SECTION_MISSIONS.CHECKBOX_INCLURE_CV, version)).locator('input[type="checkbox"]');
    if (attenduInclus) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }

  static async verifierCopie(page: Page, version: Version, roleOriginal: string): Promise<void> {
    const itemSelector = getSelector(SECTION_MISSIONS.ITEM, version);
    const items = page.locator(itemSelector).filter({ hasText: roleOriginal });
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(2);
  }

  static async verifierExperienceAssociee(page: Page, version: Version, role: string, titreExperience: string): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, role);
    await expect(page.locator(getSelector(SECTION_MISSIONS.SELECT_EXPERIENCE, version))).toContainText(titreExperience, { timeout: 10_000 });
  }

  static async verifierContenuNonVide(
    page: Page, version: Version, role: string,
    champ: 'contexte' | 'taches' | 'actions' | 'resultats' | 'technologies'
  ): Promise<void> {
    await MissionsPrimitives.trouverMissionParRole(page, version, role);

    const selectorMap: Record<string, { v1: string; v2: string }> = {
      contexte: SECTION_MISSIONS.EDITOR_CONTEXTE,
      taches: SECTION_MISSIONS.EDITOR_TACHES,
      actions: SECTION_MISSIONS.EDITOR_ACTIONS,
      resultats: SECTION_MISSIONS.EDITOR_RESULTATS,
      technologies: SECTION_MISSIONS.EDITOR_TECHNOLOGIES
    };

    const text = await page.locator(getSelector(selectorMap[champ], version)).innerText({ timeout: 10_000 });
    expect(text.trim().length).toBeGreaterThan(0);
  }
}
