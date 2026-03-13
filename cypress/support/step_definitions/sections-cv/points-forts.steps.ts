import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version, getSelector, SECTION_POINTS_FORTS } from '../../config/section/selectors-points-forts.config';
import { PointsFortsPrimitives } from '../../primitives/sections-cv/points-forts.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// ─── Ajout ──────────────────────────────────────────────────────────────────

When('j\'ajoute le point fort {string}', (texte: string) => {
  PointsFortsPrimitives.ajouterPointFort(VERSION, texte);
});

// ─── Modification ───────────────────────────────────────────────────────────

When('je modifie le point fort {string} en {string}', (ancien: string, nouveau: string) => {
  PointsFortsPrimitives.modifierPointFort(VERSION, ancien, nouveau);
});

// ─── Suppression ────────────────────────────────────────────────────────────

When('je supprime le point fort {string}', (texte: string) => {
  PointsFortsPrimitives.supprimerPointFort(VERSION, texte);
});

// ─── Visibilité ─────────────────────────────────────────────────────────────

When('je masque le point fort {string} du CV', (texte: string) => {
  PointsFortsPrimitives.toggleVisibilite(VERSION, texte, false);
});

When('je rends visible le point fort {string} sur le CV', (texte: string) => {
  PointsFortsPrimitives.toggleVisibilite(VERSION, texte, true);
});

// ─── Préparation ────────────────────────────────────────────────────────────

Given('un point fort {string} existe dans ma liste', (texte: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer que le point fort "${texte}" existe`);

  const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, VERSION);
  const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === texte);
    if (found.length === 0) {
      PointsFortsPrimitives.ajouterPointFort(VERSION, texte);
    } else {
      cy.log(`✅ Point fort "${texte}" déjà présent`);
    }
  });
});

Given('un point fort {string} existe et est visible sur le CV', (texte: string) => {
  const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, VERSION);
  const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === texte);
    if (found.length === 0) {
      PointsFortsPrimitives.ajouterPointFort(VERSION, texte);
    }
  });
  PointsFortsPrimitives.toggleVisibilite(VERSION, texte, true);
});

Given('un point fort {string} existe et est masqué sur le CV', (texte: string) => {
  const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, VERSION);
  const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === texte);
    if (found.length === 0) {
      PointsFortsPrimitives.ajouterPointFort(VERSION, texte);
    }
  });
  PointsFortsPrimitives.toggleVisibilite(VERSION, texte, false);
});

// ─── Vérifications ──────────────────────────────────────────────────────────

Then('le point fort {string} apparaît dans ma liste', (texte: string) => {
  PointsFortsPrimitives.verifierExiste(VERSION, texte);
});

Then('le point fort {string} n\'apparaît plus dans ma liste', (texte: string) => {
  PointsFortsPrimitives.verifierAbsent(VERSION, texte);
});

Then('le point fort {string} est masqué sur le CV', (texte: string) => {
  PointsFortsPrimitives.verifierVisibilite(VERSION, texte, false);
});

Then('le point fort {string} est visible sur le CV', (texte: string) => {
  PointsFortsPrimitives.verifierVisibilite(VERSION, texte, true);
});