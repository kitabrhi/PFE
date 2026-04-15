export type Version = 'v1' | 'v2';

export const SECTION_DESCRIPTION = {
  INPUT_DESCRIPTION: {
    v1: '[data-cy="summaryProfil-input"] .ck-editor__editable[contenteditable="true"]',
    v2: '[data-testid="resume-profil"]'
  },
  CONTENEUR: {
    v1: '[data-cy="summaryProfil-input"]',
    v2: '[data-testid="resume-profil-container"]'
  },
  COMPTEUR_CARACTERES: {
    v1: '[data-cy="summaryProfil-input"]',
    v2: '[data-testid="char-counter"]'
  },
  MESSAGE_ERREUR_LIMITE: {
    v1: '[data-cy="summaryProfil-input"]',
    v2: '[data-testid="warning-icon"]'
  }
};

export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}
