export type Version = 'v1' | 'v2';

export const SECTION_HASHTAGS = {
  ROW: { v1: '.custom-form-item', v2: '[data-testid="hashtag-row"]' },
  INPUT_HASHTAG: { v1: 'input[placeholder="Nouvelle"]', v2: '[data-testid="hashtag-name-input"]' },
  COL_AFFICHER: { v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]', v2: '[data-testid="hashtag-afficher-checkbox"]' },
  COL_ORDRE: { v1: 'mat-select[placeholder="Tri"]', v2: '[data-testid="hashtag-ordre-select"]' },
  BTN_MENU_CONTEXTUEL: { v1: 'button.mat-mdc-menu-trigger', v2: '' },
  BTN_SUPPRIMER: { v1: 'button.mat-mdc-menu-trigger', v2: '[data-testid="hashtag-delete-button"]' }
};

export function getSelector(selectorMap: Record<Version, string>, version: Version): string {
  return selectorMap[version];
}
