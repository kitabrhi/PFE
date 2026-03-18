export type Version = 'v1' | 'v2';


export const SECTION_LANGUES = {

  // Ligne d'une langue
  ROW: {
    v1: '.custom-form-item',
    v2: '[data-testid="langue-row"]'
  },

  // Champ de saisie de la langue
  INPUT_LANGUE: {
    v1: '[data-cy="langueTitre"] input',
    v2: '[data-testid="langue-name-input"]'
  },

  // Niveau de langue
  SELECT_NIVEAU: {
    v1: 'mat-form-field.level mat-select',
    v2: '[data-testid="langue-niveau-select"]'
  },

  // Option pour afficher la langue sur le CV
  COL_AFFICHER: {
    v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]',
    v2: '[data-testid="langue-afficher-checkbox"]'
  },

  // Colonne de tri
  COL_ORDRE: {
    v1: 'mat-select[placeholder="Tri"]',
    v2: '[data-testid="langue-ordre-select"]'
  },

  // Bouton du menu contextuel
  BTN_MENU_CONTEXTUEL: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: ''
  },

  // Action de suppression
  BTN_SUPPRIMER: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: '[data-testid="langue-delete-button"]'
  }
};

// Utilitaire

export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}
