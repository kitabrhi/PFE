export type Version = 'v1' | 'v2';

export const SECTION_COMPETENCES = {
  ROW: {
    v1: '.custom-form-item',
    v2: '[data-testid="competence-row"]'
  },
  INPUT_COMPETENCE: {
    v1: 'input[placeholder="Compétence"]',
    v2: '[data-testid="competence-name-input"]'
  },
  SELECT_EXPERIENCE: {
    v1: 'mat-form-field:not(.sort) mat-select:not([placeholder="Tri"])',
    v2: '[data-testid="competence-experience-select"]'
  },
  COL_AFFICHER: {
    v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]',
    v2: '[data-testid="competence-afficher-checkbox"]'
  },
  COL_ORDRE: {
    v1: 'mat-select[placeholder="Tri"]',
    v2: '[data-testid="competence-ordre-select"]'
  },
  BTN_MENU_CONTEXTUEL: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: ''
  },
  BTN_SUPPRIMER: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: '[data-testid="competence-delete-button"]'
  }
};

export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}
