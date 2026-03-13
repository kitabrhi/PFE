// cypress/support/config/section/selectors-langues.config.ts

export type Version = 'v1' | 'v2';

// ═════════════════════════════════════════════════════════════════════════════
//  SÉLECTEURS — SECTION LANGUES
//
//  v1 DOM réel :
//    Langue  : red-input[data-cy="langueTitre"] → input à l'intérieur
//    Niveau  : mat-form-field.level mat-select (options A1..C2, Langue maternelle)
//    CV      : mat-checkbox[formcontrolname="includIntoResumeDefault"]
//    Tri     : red-user-list-sort mat-select
//    Row     : .custom-form-item
//    Menu    : button.mat-mdc-menu-trigger
// ═════════════════════════════════════════════════════════════════════════════

export const SECTION_LANGUES = {

  // Ligne (row) d'une langue.
  ROW: {
    v1: '.custom-form-item',
    v2: '[data-testid="langue-row"]'
  },

  // Champ « Langue » (input texte).
  INPUT_LANGUE: {
    v1: '[data-cy="langueTitre"] input',
    v2: '[data-testid="langue-name-input"]'
  },

  // Champ « Niveau » (mat-select en v1, select en v2).
  SELECT_NIVEAU: {
    v1: 'mat-form-field.level mat-select',
    v2: '[data-testid="langue-niveau-select"]'
  },

  // Checkbox « Afficher sur le CV ».
  COL_AFFICHER: {
    v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]',
    v2: '[data-testid="langue-afficher-checkbox"]'
  },

  // Colonne « Ordre / Tri ».
  COL_ORDRE: {
    v1: 'mat-select[placeholder="Tri"]',
    v2: '[data-testid="langue-ordre-select"]'
  },

  // Bouton menu contextuel (⋮).
  BTN_MENU_CONTEXTUEL: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: ''
  },

  // Bouton supprimer.
  BTN_SUPPRIMER: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: '[data-testid="langue-delete-button"]'
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//  UTILITAIRE
// ═════════════════════════════════════════════════════════════════════════════

export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}