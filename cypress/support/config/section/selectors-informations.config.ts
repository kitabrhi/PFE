/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION SÉLECTEURS - SECTION INFORMATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 * Champs présents :
 *   - Photo de profil (upload, max 1,4 MB)
 *   - Email (affiché, NON éditable)
 *   - Prénom, Nom
 *   - Date de naissance (JJ/MM/AAAA)
 *   - Début activité professionnelle (JJ/MM/AAAA)
 *
 * v1 : sidebar gauche, autosave, inputs matInput
 * v2 : onglets horizontaux, bouton Sauvegarder, inputs Angular
 */

import { Version, getSelector } from '../carte-cv/selectors-carte-cv.config';

interface SelectorMap {
  v1: string;
  v2: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION INFORMATIONS — Champs
// ═══════════════════════════════════════════════════════════════════════════
export const SECTION_INFORMATIONS = {

    PHOTO_UPLOAD_ZONE: {
        v1: 'input#imageUploadInput.file-input',
        v2: '[data-testid="photo-upload"] input[type="file"]'
      } as SelectorMap,
    
      PHOTO_PREVIEW: {
        v1: '.image-preview',
        v2: '[data-testid="photo-preview"]'
      } as SelectorMap,
  
    EMAIL_DISPLAY: {
      v1: '.item > span',
      v2: '[data-testid="email-display"]'
    } as SelectorMap,
  
    INPUT_PRENOM: {
      v1: '[data-cy="firstname"] > .mat-mdc-form-field > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix',
      v2: '[data-testid="input-prenom"]'
    } as SelectorMap,
  
    INPUT_NOM: {
      v1: '[data-cy="lastname"] > .mat-mdc-form-field > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix',
      v2: '[data-testid="input-nom"]'
    } as SelectorMap,
  
    INPUT_DATE_NAISSANCE: {
        v1: 'input[placeholder="Date de naissance"][matinput]',
        v2: '[data-testid="input-date-naissance"]'
      } as SelectorMap,
    
      INPUT_DEBUT_ACTIVITE: {
        v1: 'input[placeholder="Début activité professionnelle"][matinput]',
        v2: '[data-testid="input-debut-activite"]'
      } as SelectorMap,
  };

export { getSelector };
export type { Version, SelectorMap };