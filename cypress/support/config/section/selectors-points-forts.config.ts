export type Version = 'v1' | 'v2';

export const SECTION_POINTS_FORTS = {
  ROW: {
    v1: '.custom-form-item',
    v2: '[data-testid="point-fort-row"]'
  },
  INPUT_POINT_FORT: {
    v1: '[data-cy="pointFort"] input',
    v2: '[data-testid="point-fort-input"]'
  },
  COL_AFFICHER: {
    v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]',
    v2: '[data-testid="point-fort-afficher-checkbox"]'
  },
  COL_ORDRE: {
    v1: 'mat-select[placeholder="Tri"]',
    v2: '[data-testid="point-fort-ordre-select"]'
  },
  BTN_MENU_CONTEXTUEL: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: ''
  }
};

export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}
