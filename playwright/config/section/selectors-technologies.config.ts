export type Version = 'v1' | 'v2';

export const DELAIS = {
  AUTO_SAVE: 2500,
  RENDU_UI: 800,
  RENDU_UI_COURT: 500,
  RENDU_UI_LONG: 1500,
  VERIFICATION: 1000
};

export const FIXTURES_TECHNOLOGIES = {
  EXPERIENCE_PAR_DEFAUT: '3 ans',
  NOUVELLE_EXPERIENCE: '> 5 ans'
};

export const EXPERIENCE_MAP: Record<string, Record<Version, string>> = {
  '1 an':     { v1: '1 AN',     v2: '1 an' },
  '2 ans':    { v1: '2 ANS',    v2: '2 ans' },
  '3 ans':    { v1: '3 ANS',    v2: '3 ans' },
  '4 ans':    { v1: '4 ANS',    v2: '4 ans' },
  '5 ans':    { v1: '5 ANS',    v2: '5 ans' },
  '> 5 ans':  { v1: '> 5 ANS',  v2: '> 5 ans' }
};

export function experienceVersUI(valeurMetier: string, version: Version): string {
  const cle = valeurMetier.toLowerCase().trim();
  return EXPERIENCE_MAP[cle]?.[version] ?? valeurMetier;
}

export const SECTION_TECHNOLOGIES = {
  SELECT_CATEGORIE: { v1: 'mat-select[placeholder="Catégorie"]', v2: '[data-testid="technologies-categorie-select"]' },
  INPUT_TECHNOLOGIE: { v1: '[data-cy="technologieTitre"] input', v2: 'input[placeholder="Entrez une technologie"]' },
  SELECT_EXPERIENCE: { v1: 'mat-select[placeholder="Expérience"]', v2: '[data-testid="technologie-experience-select"]' },
  COL_AFFICHER: { v1: 'mat-checkbox[formcontrolname="includIntoResumeDefault"]', v2: '[data-testid="technologie-afficher-checkbox"]' },
  BTN_SUPPRIMER: { v1: '.actions button', v2: '[data-testid="technologie-delete-button"]' },
  ROW: { v1: '.tech-list .custom-form-item', v2: '[data-testid="technologie-row"]' },
  PANEL_OPTIONS_VISIBLE: {
    v1: [
      '.cdk-overlay-pane:visible .mat-mdc-select-panel',
      '.mat-mdc-select-panel:visible',
      '.cdk-overlay-pane:visible .mat-select-panel',
      '.mat-select-panel:visible'
    ].join(','),
    v2: '[data-testid="technologies-options-panel"]'
  }
};

export function getSelector(selectorMap: Record<Version, string>, version: Version): string {
  return selectorMap[version];
}
