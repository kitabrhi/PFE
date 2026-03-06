/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION SÉLECTEURS - CARTE CV ACTIVE
 * ═══════════════════════════════════════════════════════════════════════════
 * Centralisation des sélecteurs v1/v2 avec résolution dynamique
 * via getSelector() — CŒUR de la couche d'abstraction
 */

export type Version = 'v1' | 'v2';

interface SelectorMap {
  v1: string;
  v2: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARTE CV ACTIVE - SÉLECTEURS
// ═══════════════════════════════════════════════════════════════════════════════

export const CARTE_CV = {

  // ─── Carte active ──────────────────────────────────────────────────────────
  CARD: {
    v1: '.mat-mdc-card.cv-detail-card',
    v2: 'div[data-testid="cv-active-card"]'
  } as SelectorMap,

  // ─── Tableau des CV ────────────────────────────────────────────────────────
  TABLE: {
    v1: '.mat-mdc-table',
    v2: 'table[data-testid="cv-table"]'
  } as SelectorMap,

  TABLE_ROW: {
    v1: 'tr.mat-mdc-row',
    v2: 'tr[data-testid="cv-row"]'
  } as SelectorMap,

  // ─── Statut ────────────────────────────────────────────────────────────────
  SELECT_STATUS: {
    v1: '.mat-mdc-form-field mat-select',
    v2: 'select[data-testid="cv-status"]'
  } as SelectorMap,

  OPTION_STATUS: (statut: string): SelectorMap => ({
    v1: `.mat-mdc-option:contains("${statut}")`,
    v2: `option[value="${statut}"]`
  }),

  LABEL_STATUS: {
    v1: '.mat-column-status, .status-badge',
    v2: 'span[data-testid="status-label"]'
  } as SelectorMap,

  // ─── 6 Boutons d'action (carte rouge v1 / barre actions v2) ───────────────
  BTN_RENOMMER: {
    v1: 'button[title="Renommer"]',
    v2: 'button[data-testid="btn-renommer"]'
  } as SelectorMap,

  BTN_DUPLIQUER: {
    v1: 'button[title="Dupliquer"]',
    v2: 'button[data-testid="btn-dupliquer"]'
  } as SelectorMap,

  BTN_VIDER: {
    v1: 'button[title="Vider"]',
    v2: 'button[data-testid="btn-vider"]'
  } as SelectorMap,

  BTN_CHANGER_PROPRIETAIRE: {
    v1: 'button[title="Changer propriétaire"]',
    v2: 'button[data-testid="btn-changer-proprietaire"]'
  } as SelectorMap,

  BTN_SUPPRIMER: {
    v1: 'button[title="Supprimer"]',
    v2: 'button[data-testid="btn-supprimer"]'
  } as SelectorMap,

  BTN_ENREGISTRER: {
    v1: 'button[title="Enregistrer"]',
    v2: 'button[data-testid="btn-enregistrer"]'
  } as SelectorMap,

  // ─── Modales de confirmation ───────────────────────────────────────────────
  MODAL: {
    v1: '.mat-mdc-dialog-container',
    v2: 'div[role="dialog"]'
  } as SelectorMap,

  MODAL_INPUT: {
    v1: '.mat-mdc-dialog-container input',
    v2: 'div[role="dialog"] input'
  } as SelectorMap,

  MODAL_BTN_VALIDER: {
    v1: '.mat-mdc-dialog-container button.mat-warn',
    v2: 'div[role="dialog"] button[data-testid="modal-confirm"]'
  } as SelectorMap,

  MODAL_BTN_ANNULER: {
    v1: '.mat-mdc-dialog-container button:not(.mat-warn)',
    v2: 'div[role="dialog"] button[data-testid="modal-cancel"]'
  } as SelectorMap,

  // ─── Messages d'erreur ─────────────────────────────────────────────────────
  ERROR_MESSAGE: {
    v1: '.mat-mdc-dialog-container .mat-error, .mat-mdc-dialog-container mat-error',
    v2: 'div[role="dialog"] .error-message'
  } as SelectorMap,

  // ─── V2 spécifique : Menu contextuel ⋮ ────────────────────────────────────
  MENU_CONTEXTUEL: {
    v1: '',  // N/A en v1, boutons directs
    v2: 'button[aria-label="Actions"]'
  } as SelectorMap,

  BTN_SAUVEGARDER: {
    v1: 'button[title="Enregistrer"]',
    v2: 'button[data-testid="btn-sauvegarder"]'
  } as SelectorMap,

  BTN_TELECHARGER: {
    v1: '',  // N/A en v1
    v2: 'button[data-testid="btn-telecharger"]'
  } as SelectorMap,
};

// ═══════════════════════════════════════════════════════════════════════════════
// FONCTION UTILITAIRE - Résolution dynamique v1/v2
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Récupère le sélecteur correspondant à la version courante.
 * CŒUR de l'abstraction : un seul point de résolution v1/v2.
 */
export function getSelector(selectorMap: SelectorMap, version: Version): string {
  return selectorMap[version];
}