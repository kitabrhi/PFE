export type Version = 'v1' | 'v2';

export const SECTION_MISSIONS = {
  ITEM: { v1: 'div.mission-item', v2: '[data-testid="mission-item"]' },
  ITEM_ROLE: { v1: 'div.mission-item .line-2', v2: '[data-testid="mission-item-role"]' },
  ITEM_SOCIETE: { v1: 'div.mission-item .line-3 .company', v2: '[data-testid="mission-item-societe"]' },
  BTN_AJOUTER: { v1: 'button.mission-add:first-of-type', v2: '[data-testid="mission-add-button"]' },
  BTN_COPIER: { v1: 'button.mission-add:nth-of-type(2)', v2: '[data-testid="mission-copy-button"]' },
  BTN_ENREGISTRER: { v1: 'button.mission-save', v2: '[data-testid="mission-save-button"]' },
  BTN_MENU_CONTEXTUEL: { v1: 'button.mat-mdc-menu-trigger', v2: '[data-testid="mission-menu-button"]' },
  BTN_SUPPRIMER: { v1: 'button.mat-mdc-menu-trigger', v2: '[data-testid="mission-delete-button"]' },
  INPUT_SOCIETE: { v1: '[data-cy="companyName-input"] input', v2: '[data-testid="mission-societe-input"]' },
  INPUT_ROLE: { v1: '[data-cy="titleMission-input"] input', v2: '[data-testid="mission-role-input"]' },
  INPUT_LIEU: { v1: '[data-cy="locationMission-input"] input', v2: '[data-testid="mission-lieu-input"]' },
  INPUT_DEBUT: { v1: '[data-cy="beginDateMission-input"] input', v2: '[data-testid="mission-debut-input"]' },
  INPUT_FIN: { v1: '[data-cy="endDateMission-input"] input', v2: '[data-testid="mission-fin-input"]' },
  EDITOR_CONTEXTE: { v1: '[data-cy="descriptionMission-input"] .ck-editor__editable', v2: '[data-testid="mission-contexte-editor"]' },
  EDITOR_TACHES: { v1: '[data-cy="tasksMission-input"] .ck-editor__editable', v2: '[data-testid="mission-taches-editor"]' },
  EDITOR_ACTIONS: { v1: '[data-cy="actionsMission-input"] .ck-editor__editable', v2: '[data-testid="mission-actions-editor"]' },
  EDITOR_RESULTATS: { v1: '[data-cy="resultsMission-input"] .ck-editor__editable', v2: '[data-testid="mission-resultats-editor"]' },
  EDITOR_TECHNOLOGIES: { v1: '[data-cy="technologiesMission-input"] .ck-editor__editable', v2: '[data-testid="mission-technologies-editor"]' },
  CHECKBOX_CONFIDENTIEL: { v1: 'mat-checkbox[formcontrolname="confidential"]', v2: '[data-testid="mission-confidentiel-checkbox"]' },
  CHECKBOX_INCLURE_CV: { v1: '[data-cy="includeMission-checkbox"]', v2: '[data-testid="mission-inclure-checkbox"]' },
  SELECT_EXPERIENCE: { v1: 'mat-select[data-cy="experienceMission-select"]', v2: '[data-testid="mission-experience-select"]' },
  TITRE_FORMULAIRE: { v1: 'div.mission-detail h2', v2: '[data-testid="mission-form-title"]' }
};

export function getSelector(selectorMap: Record<Version, string>, version: Version): string {
  return selectorMap[version];
}
