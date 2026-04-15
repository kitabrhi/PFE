export type Version = 'v1' | 'v2';

export const SECTION_CONFIGURATION = {
  PANEL_CONFIGURATION: { v1: 'mat-expansion-panel', v2: '[data-testid="config-panel"]' },
  PANEL_HEADER: { v1: 'mat-expansion-panel-header', v2: '[data-testid="config-panel-header"]' },
  PANEL_BODY: { v1: '.mat-expansion-panel-body', v2: '[data-testid="config-panel-body"]' },
  BTN_DOWNLOAD_PROFIL: { v1: '.mat-expansion-panel-body a, .mat-expansion-panel-body button', v2: '[data-testid="config-download-button"]' },
  BTN_UPLOAD_PROFIL: { v1: '.mat-expansion-panel-body a, .mat-expansion-panel-body button', v2: '[data-testid="config-upload-button"]' },
  INPUT_UPLOAD_FILE: { v1: 'input[type="file"]', v2: '[data-testid="config-upload-input"]' },
  TOGGLE_MODE_SOMBRE: { v1: 'mat-slide-toggle', v2: '[data-testid="config-dark-mode-toggle"]' },
  BTN_GENERER_CV: { v1: '.mat-sidenav a, .mat-sidenav span', v2: '[data-testid="generate-cv-button"]' },
  PANEL_CV: { v1: 'div.panel-right', v2: '[data-testid="cv-panel-right"]' },
  SELECT_TEMPLATE_CV: { v1: 'div.panel-right mat-form-field mat-select', v2: '[data-testid="cv-template-select"]' },
  BTN_TELECHARGER_CV: { v1: 'div.panel-right button', v2: '[data-testid="download-cv-button"]' }
};

export function getSelector(selectorMap: Record<Version, string>, version: Version): string {
  return selectorMap[version];
}
