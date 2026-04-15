
import { Version, getSelector } from '../carte-cv/selectors-carte-cv.config';

interface SelectorMap {
  v1: string;
  v2: string;
}

export function getLabelSection(nomSection: string, version: Version): string {
  const labels: Record<string, { v1: string; v2: string }> = {
    'Informations':         { v1: 'Informations',            v2: 'Informations' },
    'Titres':               { v1: 'Titres',                   v2: 'Titres' },
    'Description':          { v1: 'Description',              v2: 'Description' },
    'Diplômes':             { v1: 'Dip. et certifications',   v2: 'Diplômes & Certifications' },
    'Langues':              { v1: 'Langues',                  v2: 'Langues' },
    'Points forts':         { v1: 'Points forts',             v2: 'Points forts' },
    'Compétences':          { v1: 'Compétences',              v2: 'Compétences' },
    'Technologies':         { v1: 'Technologies',             v2: 'Technologies' },
    'Domaines d\'activité': { v1: 'Domaines d\'activité',     v2: 'Domaines d\'activité' },
    'Hashtags':             { v1: 'Hashtags',                 v2: 'Hashtags' },
    'Expériences':          { v1: 'Expériences',              v2: 'Expériences' },
    'Missions':             { v1: 'Missions',                 v2: 'Missions' },
  };

  const section = labels[nomSection];
  if (!section) {
    throw new Error(
      `Section inconnue : "${nomSection}". ` +
      `Sections disponibles : ${Object.keys(labels).join(', ')}`
    );
  }
  return section[version];
}

// Navigation entre les sections

export const SECTION_NAV = {

  NAV_CONTAINER: {
    v1: '.mat-sidenav',
    v2: '[data-testid="cv-section-tabs"]'
  } as SelectorMap,

  NAV_LINK: {
    v1: '.mat-sidenav a',
    v2: '[data-testid="cv-section-tabs"] [role="tab"]'
  } as SelectorMap,
};

// Structure commune aux sections composées de lignes

export const SECTION_ROW = {

  LIST_CONTAINER: {
    v1: '.custom-form-item',
    v2: '[data-testid="section-list"]'
  } as SelectorMap,

  ROW: {
    v1: '.custom-form-item',
    v2: '[data-testid="section-row"]'
  } as SelectorMap,

  COL_ORDRE: {
    v1: '.sort mat-select',
    v2: '[data-testid="col-ordre"] select'
  } as SelectorMap,

  COL_AFFICHER: {
    v1: 'input.mdc-checkbox__native-control',
    v2: '[data-testid="col-afficher"] input[type="checkbox"]'
  } as SelectorMap,

  BTN_SUPPRIMER_LIGNE: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: '[data-testid="btn-supprimer-ligne"]'
  } as SelectorMap,
};

export const SECTION_TITRES = {
  INPUT_TITRE: {
    v1: '[data-cy="titreName"] input[matinput]',
    v2: '[data-testid="input-titre"]'
  } as SelectorMap,
};

export { getSelector };
export type { Version, SelectorMap };
