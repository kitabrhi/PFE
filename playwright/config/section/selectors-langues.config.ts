export type Version = 'v1' | 'v2';

export const SECTION_LANGUES = {
  ROW: { v1: '.custom-form-item', v2: '[data-testid="langue-row"]' },
  INPUT_LANGUE: { v1: '[data-cy="langueTitre"] input', v2: '[data-testid="langue-name-input"]' },
  SELECT_NIVEAU: { v1: 'mat-form-field.level mat-select', v2: '[data-testid="langue-niveau-select"]' },
  COL_AFFICHER: { v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]', v2: '[data-testid="langue-afficher-checkbox"]' },
  COL_ORDRE: { v1: 'mat-select[placeholder="Tri"]', v2: '[data-testid="langue-ordre-select"]' },
  BTN_MENU_CONTEXTUEL: { v1: 'button.mat-mdc-menu-trigger', v2: '' },
  BTN_SUPPRIMER: { v1: 'button.mat-mdc-menu-trigger', v2: '[data-testid="langue-delete-button"]' }
};

export function getSelector(selectorMap: Record<Version, string>, version: Version): string {
  return selectorMap[version];
}
