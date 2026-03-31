export type Version = 'v1' | 'v2';

export const SECTION_ADMIN = {
  // ─── Invitation Candidat ──────────────────────────────────────
  INPUT_EMAIL_INVITATION: {
    v1: 'input.input-invit[placeholder="Email du Candidat"]',
    v2: '[data-testid="invitation-email-input"]'
  },
  BTN_ENVOYER_INVITATION: {
    v1: 'red-user-invitation button[type="submit"]',
    v2: '[data-testid="invitation-submit-button"]'
  },
  FORM_INVITATION: {
    v1: 'red-user-invitation form',
    v2: '[data-testid="invitation-form"]'
  },

  // ─── Recherche CV ─────────────────────────────────────────────
  INPUT_RECHERCHE: {
    v1: 'input[name="searchTerm"]',
    v2: '[data-testid="search-input"]'
  },
  BTN_RECHERCHE: {
    v1: 'button.full-width[type="submit"]',
    v2: '[data-testid="search-submit-button"]'
  },

  // ─── Résultats de recherche (cartes CV) ───────────────────────
  CARTE_CV: {
    v1: 'mat-card, .cv-card, .card',
    v2: '[data-testid="cv-card"]'
  },
  CARTE_NOM: {
    v1: 'mat-card-title, .card-title, h3',
    v2: '[data-testid="cv-card-name"]'
  },
  CARTE_VERSION: {
    v1: 'mat-card-content, .card-content',
    v2: '[data-testid="cv-card-version"]'
  },
  CARTE_STATUT: {
    v1: '.badge, .status-badge, mat-chip',
    v2: '[data-testid="cv-card-status"]'
  },
  BTN_CARTE_VOIR: {
    v1: 'button:nth-of-type(1), a:nth-of-type(1)',
    v2: '[data-testid="cv-card-view"]'
  },
  BTN_CARTE_MODIFIER: {
    v1: 'button:nth-of-type(2), a:nth-of-type(2)',
    v2: '[data-testid="cv-card-edit"]'
  },
  BTN_CARTE_SUPPRIMER: {
    v1: 'button:nth-of-type(3), a:nth-of-type(3)',
    v2: '[data-testid="cv-card-delete"]'
  }
};

export function getSelector(
  selectorMap: Record<Version, string>,
  version: Version
): string {
  return selectorMap[version];
}