export type Version = 'v1' | 'v2';

// Sélecteurs de la section diplômes, certifications et formations.
// En v1, une ligne contient les champs diplôme, lieu, année, l'option
// d'affichage sur le CV et le tri.

export const SECTION_DIPLOMES = {

  // Ligne d'un diplôme
  ROW: {
    v1: '.custom-form-item',
    v2: '[data-testid="diplome-row"]'
  },

  // Champ du diplôme ou de la certification
  INPUT_DIPLOME: {
    v1: 'input[placeholder="Diplôme ou certification"]',
    v2: '[data-testid="diplome-name-input"]'
  },

  // Champ du lieu
  INPUT_LIEU: {
    v1: 'input[placeholder="Lieu"]',
    v2: '[data-testid="diplome-lieu-input"]'
  },

  // Champ de l'année : datepicker en v1, select en v2
  INPUT_ANNEE: {
    v1: 'input[placeholder="Année"]',
    v2: '[data-testid="diplome-annee-select"]'
  },

  // Option pour afficher l'élément sur le CV
  COL_AFFICHER: {
    v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]',
    v2: '[data-testid="diplome-afficher-checkbox"]'
  },

  // Colonne de tri
  COL_ORDRE: {
    v1: 'mat-select[placeholder="Tri"]',
    v2: '[data-testid="diplome-ordre-select"]'
  },

  // Bouton du menu contextuel en v1
  BTN_MENU_CONTEXTUEL: {
    v1: 'button:has(mat-icon)',
    v2: ''
  },

  // Action de suppression
  BTN_SUPPRIMER: {
    v1: 'button:has(mat-icon)',
    v2: '[data-testid="diplome-delete-button"]'
  }
};

// Utilitaire

export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}
