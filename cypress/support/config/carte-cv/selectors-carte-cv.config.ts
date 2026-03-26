

export type Version = 'v1' | 'v2';

interface SelectorMap {
  v1: string;
  v2: string;
}
export const CARTE_CV = {

  // Carte active
  CARD: {
    v1: '.mat-mdc-card.cv-detail-card',
    v2: 'div[data-testid="cv-active-card"]'
  } as SelectorMap,

  // Tableau des CV
  TABLE: {
    v1: '.mat-mdc-table',
    v2: 'table[data-testid="cv-table"]'
  } as SelectorMap,

  TABLE_ROW: {
    v1: 'tr.mat-mdc-row',
    v2: 'tr[data-testid="cv-row"]'
  } as SelectorMap,

  // Gestion du statut
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

  // Boutons d'action
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

  // Eléments des modales
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

  // Message d'erreur affiché dans la modale
  ERROR_MESSAGE: {
    v1: '.mat-mdc-dialog-container .mat-error, .mat-mdc-dialog-container mat-error',
    v2: 'div[role="dialog"] .error-message'
  } as SelectorMap,

  // Eléments spécifiques a la v2

  // Menu d'actions sur la page détail
  MENU_CONTEXTUEL: {
    v1: '',  // En v1, les actions sont deja visibles
    v2: 'button[data-testid="menu-actions-detail"]'
  } as SelectorMap,

  // Menu d'actions dans une ligne du tableau
  // Ce sélecteur est utilise dans un `cy.within()` sur la ligne ciblee
  ROW_MENU_CONTEXTUEL: {
    v1: '',  // Pas utilise en v1
    v2: 'button[data-testid="row-menu-actions"]'
  } as SelectorMap,

  // Boutons d'action disponibles directement dans une ligne
  // Ces sélecteurs sont utilises dans un `cy.within()` sur la ligne ciblee
  ROW_BTN_DUPLIQUER: {
    v1: '',  // Pas utilise en v1
    v2: 'button[data-testid="row-btn-dupliquer"]'
  } as SelectorMap,

  ROW_BTN_TELECHARGER: {
    v1: '',  // Pas utilise en v1
    v2: 'button[data-testid="row-btn-telecharger"]'
  } as SelectorMap,

  // Navigation v2
  // Bouton retour sur la page detail
  BTN_RETOUR: {
    v1: '',  // Pas utilise en v1
    v2: 'button[data-testid="btn-retour"], a[data-testid="btn-retour"]'
  } as SelectorMap,

  // Indicateur de presence sur la page detail
  PAGE_DETAIL: {
    v1: '',  // Pas utilise en v1
    v2: '[data-testid="cv-detail-page"]'
  } as SelectorMap,

  // Titre du CV sur la page detail
  DETAIL_TITRE: {
    v1: '',
    v2: '[data-testid="cv-detail-titre"]'
  } as SelectorMap,

  BTN_SAUVEGARDER: {
    v1: 'button[title="Enregistrer"]',
    v2: 'button[data-testid="btn-sauvegarder"]'
  } as SelectorMap,

  BTN_TELECHARGER: {
    v1: '',  // Pas utilise en v1
    v2: 'button[data-testid="btn-telecharger"]'
  } as SelectorMap,
};
export function getSelector(selectorMap: SelectorMap, version: Version): string {
  const selector = selectorMap[version];
  if (!selector) {
    throw new Error(
      `Sélecteur non disponible en ${version}. ` +
      `Vérifiez que cette fonctionnalité existe pour cette version.`
    );
  }
  return selector;
}
