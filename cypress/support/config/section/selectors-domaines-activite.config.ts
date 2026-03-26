export type Version = 'v1' | 'v2';

export const SECTION_DOMAINES_ACTIVITE = {
  ROW: {
    v1: '.custom-form-item',
    v2: '[data-testid="domaine-activite-row"]'
  },
  INPUT_DOMAINE: {
    v1: 'input[placeholder="Domaine d\'activité"]',
    v2: '[data-testid="domaine-activite-name-input"]'
  },
  SELECT_EXPERIENCE: {
    v1: 'mat-form-field.level mat-select[formcontrolname="level"]',
    v2: '[data-testid="domaine-activite-experience-select"]'
  },
  COL_AFFICHER: {
    v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]',
    v2: '[data-testid="domaine-activite-afficher-checkbox"]'
  },
  COL_ORDRE: {
    v1: 'mat-select[placeholder="Tri"]',
    v2: '[data-testid="domaine-activite-ordre-select"]'
  },
  BTN_MENU_CONTEXTUEL: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: ''
  },
  BTN_SUPPRIMER: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: '[data-testid="domaine-activite-delete-button"]'
  }
};

export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}