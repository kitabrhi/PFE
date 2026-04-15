export type Version = 'v1' | 'v2';

export const SECTION_DIPLOMES = {
  ROW: { v1: '.custom-form-item', v2: '[data-testid="diplome-row"]' },
  INPUT_DIPLOME: { v1: 'input[placeholder="Diplôme ou certification"]', v2: '[data-testid="diplome-name-input"]' },
  INPUT_LIEU: { v1: 'input[placeholder="Lieu"]', v2: '[data-testid="diplome-lieu-input"]' },
  INPUT_ANNEE: { v1: 'input[placeholder="Année"]', v2: '[data-testid="diplome-annee-select"]' },
  COL_AFFICHER: { v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]', v2: '[data-testid="diplome-afficher-checkbox"]' },
  COL_ORDRE: { v1: 'mat-select[placeholder="Tri"]', v2: '[data-testid="diplome-ordre-select"]' },
  BTN_MENU_CONTEXTUEL: { v1: 'button:has(mat-icon)', v2: '' },
  BTN_SUPPRIMER: { v1: 'button:has(mat-icon)', v2: '[data-testid="diplome-delete-button"]' }
};

export function getSelector(selectorMap: Record<Version, string>, version: Version): string {
  return selectorMap[version];
}
