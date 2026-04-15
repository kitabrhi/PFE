export type Version = 'v1' | 'v2';

export const SECTION_EXPERIENCES = {
  ROW: { v1: '.custom-form-item', v2: '[data-testid="experience-row"]' },
  INPUT_TITRE: { v1: 'input[placeholder="Titre occupé..."]', v2: '[data-testid="experience-titre-input"]' },
  INPUT_SOCIETE: { v1: 'input[placeholder="Société"]', v2: '[data-testid="experience-societe-input"]' },
  INPUT_LIEU: { v1: 'input[placeholder="Lieu de travail"]', v2: '[data-testid="experience-lieu-input"]' },
  INPUT_DEBUT: { v1: 'input[placeholder="Début"]', v2: '[data-testid="experience-debut-input"]' },
  INPUT_FIN: { v1: 'input.mat-datepicker-input:not([placeholder="Début"])', v2: '[data-testid="experience-fin-input"]' },
  COL_AFFICHER: { v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]', v2: '[data-testid="experience-afficher-checkbox"]' },
  COL_ORDRE: { v1: 'mat-select[placeholder="Tri"]', v2: '[data-testid="experience-ordre-select"]' },
  BTN_MENU_CONTEXTUEL: { v1: 'button.mat-mdc-menu-trigger', v2: '' },
  BTN_SUPPRIMER: { v1: 'button.mat-mdc-menu-trigger', v2: '[data-testid="experience-delete-button"]' }
};

export function getSelector(selectorMap: Record<Version, string>, version: Version): string {
  return selectorMap[version];
}
