
export type Version = 'v1' | 'v2';

export const SECTION_DESCRIPTION = {

  // Champ principal de la description
  INPUT_DESCRIPTION: {
    v1: '[data-cy="summaryProfil-input"] .ck-editor__editable[contenteditable="true"]',
    v2: '[data-testid="resume-profil"]'
  },

  // Bloc parent utile pour les labels et les messages
  CONTENEUR: {
    v1: '[data-cy="summaryProfil-input"]',
    v2: '[data-testid="resume-profil-container"]'
  },

  // Compteur de caracteres, par exemple "850/1000"
  COMPTEUR_CARACTERES: {
    v1: '[data-cy="summaryProfil-input"]',
    v2: '[data-testid="char-counter"]'
  },

  // Avertissement affiché quand la limite est depassee
  MESSAGE_ERREUR_LIMITE: {
    v1: '[data-cy="summaryProfil-input"]',
    v2: '[data-testid="warning-icon"]'
  }
};

// Retourne le sélecteur correspondant à la version demandée.

export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}
