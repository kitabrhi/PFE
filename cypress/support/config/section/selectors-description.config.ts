// cypress/support/config/selectors-description.config.ts
// ═══════════════════════════════════════════════════════════════════════════════
// Sélecteurs section Description — v1 (CKEditor5) / v2 (textarea)
// ═══════════════════════════════════════════════════════════════════════════════

export type Version = 'v1' | 'v2';

export const SECTION_DESCRIPTION = {

  // Zone de saisie principale
  INPUT_DESCRIPTION: {
    v1: '[data-cy="summaryProfil-input"] .ck-editor__editable[contenteditable="true"]',
    v2: '[data-testid="resume-profil"]'
  },

  // Conteneur parent (pour messages d'erreur, label, etc.)
  CONTENEUR: {
    v1: '[data-cy="summaryProfil-input"]',
    v2: '[data-testid="resume-profil-container"]'
  },

  // Compteur de caractères (ex: "850/1000")
  COMPTEUR_CARACTERES: {
    v1: '[data-cy="summaryProfil-input"]',
    v2: '[data-testid="char-counter"]'
  },

  // Icône / message d'avertissement quand limite dépassée
  MESSAGE_ERREUR_LIMITE: {
    v1: '[data-cy="summaryProfil-input"]',
    v2: '[data-testid="warning-icon"]'
  }
};

/**
 * Retourne le sélecteur CSS correspondant à la version.
 */
export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}