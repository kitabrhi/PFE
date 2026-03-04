export type Version = 'v1' | 'v2';

interface SelectorMap {
  v1: string;
  v2: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARTE CV ACTIVE - 6 BOUTONS ROUGES
// ═══════════════════════════════════════════════════════════════════════════════
export const CARTE_CV = {
  // La carte elle-même
  CARD: {
    v1: '.mat-mdc-card.cv-detail-card',
    v2: 'div[data-testid="cv-active-card"]'
  },



   SELECT_STATUS: {
    v1: '.mat-mdc-form-field mat-select',
    v2: 'select[data-testid="cv-status"]'
  },
  
  // Options de statut (si besoin)
  OPTION_STATUS: (statut: string): SelectorMap => ({
    v1: `.mat-mdc-option:contains("${statut}")`,
    v2: `option[value="${statut}"]`
  }),
  
  // Badge/Label du statut affiché
  LABEL_STATUS: {
    v1: '.mat-column-status, .status-badge',
    v2: 'span[data-testid="status-label"]'
  },
  
  // Les 6 boutons (identifiés par leur titre exact)
  BTN_RENOMMER: {
    v1: 'button[title="Renommer"]',
    v2: 'button[data-testid="btn-renommer"]'
  },
  
  BTN_DUPLIQUER: {
    v1: 'button[title="Dupliquer"]',
    v2: 'button[data-testid="btn-dupliquer"]'
  },
  
  BTN_VIDER: {
    v1: 'button[title="Vider"]',
    v2: 'button[data-testid="btn-vider"]'
  },
  
  BTN_CHANGER_PROPRIETAIRE: {
    v1: 'button[title="Changer propriétaire"]',
    v2: 'button[data-testid="btn-changer-proprietaire"]'
  },
  
  BTN_SUPPRIMER: {
    v1: 'button[title="Supprimer"]',
    v2: 'button[data-testid="btn-supprimer"]'
  },
  
  BTN_ENREGISTRER: {
    v1: 'button[title="Enregistrer"]',
    v2: 'button[data-testid="btn-enregistrer"]'
  },
  
  // Modales de confirmation
  MODAL: {
    v1: '.mat-mdc-dialog-container',
    v2: 'div[role="dialog"]'
  },
  MODAL_INPUT: {
    v1: 'input[formcontrolname="name"], input.mat-mdc-input-element',
    v2: 'input[name="nouveauNom"]'
  },
  MODAL_BTN_CONFIRMER: {
    v1: 'button:contains("Confirmer"), button:contains("OK"), button.mat-primary , button:contains("Valider")',
    v2: 'button[data-testid="modal-confirm"]'
  },
  MODAL_BTN_ANNULER: {
    v1: 'button:contains("Annuler")',
    v2: 'button[data-testid="modal-cancel"]'
  }
};

/**
 * Fonction utilitaire pour récupérer le sélecteur selon la version
 */
export function getSelector(selectorMap: SelectorMap, version: Version): string {
  return selectorMap[version];
}