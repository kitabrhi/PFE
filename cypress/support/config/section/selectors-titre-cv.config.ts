/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION SÉLECTEURS - SECTIONS DU CV
 * ═══════════════════════════════════════════════════════════════════════════
 * Gère les différences v1/v2 :
 *   - Navigation : sidebar gauche (v1) vs tabs horizontaux (v2)
 *   - Colonnes : Tri/CV/⋮ (v1) vs Ordre/Afficher/🗑 (v2)
 *   - Noms de sections différents entre v1 et v2
 *   - Sauvegarde automatique (pas de bouton sauvegarder pour les sections)
 *   - Nouvelle ligne vide auto-créée quand on remplit la précédente
 *
 * Ce fichier contient :
 *   1. SECTION_NAV    → Navigation (sidebar v1 / tabs v2)
 *   2. SECTION_ROW    → Structure commune à TOUTES les sections à liste
 *   3. SECTION_TITRES → Champs spécifiques à la section Titres
 *
 * Pour ajouter une nouvelle section (ex: Langues), il suffit d'ajouter :
 *   export const SECTION_LANGUES = { INPUT_LANGUE: {...}, SELECT_NIVEAU: {...} }
 */

import { Version, getSelector } from '../carte-cv/selectors-carte-cv.config';

interface SelectorMap {
  v1: string;
  v2: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAPPING DES NOMS DE SECTIONS (sidebar v1 → tab v2)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Retourne le label exact utilisé dans la sidebar (v1) ou le tab (v2).
 * Le nom métier (Gherkin) est traduit en label technique UI.
 */
export function getLabelSection(nomSection: string, version: Version): string {
  const labels: Record<string, { v1: string; v2: string }> = {
    'Informations':         { v1: 'Informations',            v2: 'Informations' },
    'Titres':               { v1: 'Titres',                   v2: 'Titres' },
    'Description':          { v1: 'Description',              v2: 'Description' },
    'Diplômes':             { v1: 'Dip. et certifications',   v2: 'Diplômes & Certifications' },
    'Langues':              { v1: 'Langues',                  v2: 'Langues' },
    'Points forts':         { v1: 'Points forts',             v2: 'Points forts' },
    'Compétences':          { v1: 'Compétences',              v2: 'Compétences' },
    'Technologies':         { v1: 'Technologies',             v2: 'Technologies' },
    'Domaines d\'activité': { v1: 'Domaines d\'activité',     v2: 'Domaines d\'activité' },
    'Hashtags':             { v1: 'Hashtags',                 v2: 'Hashtags' },
    'Expériences':          { v1: 'Expériences',              v2: 'Expériences' },
    'Missions':             { v1: 'Missions',                 v2: 'Missions' },
  };

  const section = labels[nomSection];
  if (!section) {
    throw new Error(
      `❌ Section inconnue : "${nomSection}". ` +
      `Sections disponibles : ${Object.keys(labels).join(', ')}`
    );
  }
  return section[version];
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION — Sidebar (v1) / Tabs (v2)
// ═══════════════════════════════════════════════════════════════════════════════

export const SECTION_NAV = {

  // Conteneur de navigation
  NAV_CONTAINER: {
    v1: '.mat-sidenav',
    v2: '[data-testid="cv-section-tabs"]'
  } as SelectorMap,

  // Lien/tab individuel (utilisé avec cy.contains())
  NAV_LINK: {
    v1: '.mat-sidenav a',
    v2: '[data-testid="cv-section-tabs"] [role="tab"]'
  } as SelectorMap,
};

// ═══════════════════════════════════════════════════════════════════════════════
// STRUCTURE COMMUNE — Lignes de tableau (toutes sections à liste)
// ═══════════════════════════════════════════════════════════════════════════════
// Utilisé par : Titres, Diplômes, Langues, Points forts, Compétences,
//               Domaines d'activité, Hashtags, Expériences

export const SECTION_ROW = {

  LIST_CONTAINER: {
    v1: '.custom-form-item',
    v2: '[data-testid="section-list"]'
  } as SelectorMap,

  ROW: {
    v1: '.custom-form-item',  // ✅ vraie ligne
    v2: '[data-testid="section-row"]'
  } as SelectorMap,

  COL_ORDRE: {
    v1: '.sort mat-select',  // ✅ .sort pas div.sort
    v2: '[data-testid="col-ordre"] select'
  } as SelectorMap,
  
  COL_AFFICHER: {
    v1: 'input.mdc-checkbox__native-control',  // ✅ sans div.selected
    v2: '[data-testid="col-afficher"] input[type="checkbox"]'
  } as SelectorMap,

  BTN_SUPPRIMER_LIGNE: {
    v1: 'button.mat-mdc-menu-trigger',
    v2: '[data-testid="btn-supprimer-ligne"]'
  } as SelectorMap,
};

export const SECTION_TITRES = {
  INPUT_TITRE: {
    v1: '[data-cy="titreName"] input[matinput]',  // ✅ plus besoin de red-input
    v2: '[data-testid="input-titre"]'
  } as SelectorMap,
};
// ═══════════════════════════════════════════════════════════════════════════════
// RE-EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export { getSelector };
export type { Version, SelectorMap };
