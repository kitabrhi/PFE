// cypress/support/config/section/selectors-diplomes.config.ts

export type Version = 'v1' | 'v2';

// ═════════════════════════════════════════════════════════════════════════════
//  SÉLECTEURS — SECTION DIPLÔMES, CERTIFICATIONS ET FORMATIONS
//
//  v1 DOM réel :
//    Diplôme : <input placeholder="Diplôme ou certification">
//    Lieu    : <input placeholder="Lieu">
//    Année   : <input placeholder="Année"> (mat-datepicker, PAS un select)
//    CV      : <mat-checkbox formcontrolname="includIntoResumeDefault">
//    Row     : .custom-form-item
// ═════════════════════════════════════════════════════════════════════════════

export const SECTION_DIPLOMES = {

  // Ligne (row) d'un diplôme.
  ROW: {
    v1: '.custom-form-item',
    v2: '[data-testid="diplome-row"]'
  },

  // Champ « Diplôme ou certification ».
  INPUT_DIPLOME: {
    v1: 'input[placeholder="Diplôme ou certification"]',
    v2: '[data-testid="diplome-name-input"]'
  },

  // Champ « Lieu ».
  INPUT_LIEU: {
    v1: 'input[placeholder="Lieu"]',
    v2: '[data-testid="diplome-lieu-input"]'
  },

  // Champ « Année » — mat-datepicker en v1, select en v2.
  INPUT_ANNEE: {
    v1: 'input[placeholder="Année"]',
    v2: '[data-testid="diplome-annee-select"]'
  },

  // Checkbox « Afficher sur le CV ».
  COL_AFFICHER: {
    v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]',
    v2: '[data-testid="diplome-afficher-checkbox"]'
  },

  // Colonne « Ordre / Tri » — mat-select en v1.
  COL_ORDRE: {
    v1: 'mat-select[placeholder="Tri"]',
    v2: '[data-testid="diplome-ordre-select"]'
  },

  // Bouton menu contextuel (⋮) en v1 pour supprimer.
  BTN_MENU_CONTEXTUEL: {
    v1: 'button:has(mat-icon)',
    v2: ''
  },

  // Bouton supprimer — via menu ⋮ en v1, icône corbeille en v2.
  BTN_SUPPRIMER: {
    v1: 'button:has(mat-icon)',
    v2: '[data-testid="diplome-delete-button"]'
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