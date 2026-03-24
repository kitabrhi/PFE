
export type Version = 'v1' | 'v2';



export const SECTION_TECHNOLOGIES = {

  SELECT_CATEGORIE: {
    v1: 'mat-select[placeholder="Catégorie"]',
    v2: '[data-testid="technologies-categorie-select"]'
  },

  INPUT_TECHNOLOGIE: {
    v1: '[data-cy="technologieTitre"] input',
    v2: 'input[placeholder="Entrez une technologie"]'
  },

  SELECT_EXPERIENCE: {
    v1: 'mat-select[placeholder="Expérience"]',
    v2: '[data-testid="technologie-experience-select"]'
  },

  COL_AFFICHER: {
    v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]',
    v2: '[data-testid="technologie-afficher-checkbox"]'
  },

  BTN_SUPPRIMER: {
    v1: '.actions button',
    v2: '[data-testid="technologie-delete-button"]'
  },

  ROW: {
    v1: '.tech-list .custom-form-item',
    v2: '[data-testid="technologie-row"]'
  }
};

export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}