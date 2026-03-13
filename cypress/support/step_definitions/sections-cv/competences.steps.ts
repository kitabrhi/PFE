import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version, getSelector, SECTION_COMPETENCES } from '../../config/section/selectors-competences.config';
import { CompetencesPrimitives } from '../../primitives/sections-cv/competences.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// ─── Ajout ──────────────────────────────────────────────────────────────────

When('j\'ajoute la compétence {string} avec {string} d\'expérience', (nom: string, exp: string) => {
  CompetencesPrimitives.ajouterCompetence(VERSION, nom, exp);
});

// ─── Modification ───────────────────────────────────────────────────────────

When(
  'je modifie la compétence {string} en {string} avec {string} d\'expérience',
  (ancienNom: string, nouveauNom: string, nouvelleExp: string) => {
    CompetencesPrimitives.modifierCompetence(VERSION, ancienNom, nouveauNom, nouvelleExp);
  }
);

// ─── Suppression ────────────────────────────────────────────────────────────

When('je supprime la compétence {string}', (nom: string) => {
  CompetencesPrimitives.supprimerCompetence(VERSION, nom);
});

// ─── Visibilité ─────────────────────────────────────────────────────────────

When('je masque la compétence {string} du CV', (nom: string) => {
  CompetencesPrimitives.toggleVisibilite(VERSION, nom, false);
});

When('je rends visible la compétence {string} sur le CV', (nom: string) => {
  CompetencesPrimitives.toggleVisibilite(VERSION, nom, true);
});

// ─── Préparation ────────────────────────────────────────────────────────────

Given('une compétence {string} existe dans ma liste', (nom: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer que la compétence "${nom}" existe`);

  const rowSelector = getSelector(SECTION_COMPETENCES.ROW, VERSION);
  const inputSelector = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
    if (found.length === 0) {
      CompetencesPrimitives.ajouterCompetence(VERSION, nom, '3 ANS');
    } else {
      cy.log(`✅ Compétence "${nom}" déjà présente`);
    }
  });
});

Given('une compétence {string} existe et est visible sur le CV', (nom: string) => {
  const rowSelector = getSelector(SECTION_COMPETENCES.ROW, VERSION);
  const inputSelector = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
    if (found.length === 0) {
      CompetencesPrimitives.ajouterCompetence(VERSION, nom, '3 ANS');
    }
  });
  CompetencesPrimitives.toggleVisibilite(VERSION, nom, true);
});

Given('une compétence {string} existe et est masquée sur le CV', (nom: string) => {
  const rowSelector = getSelector(SECTION_COMPETENCES.ROW, VERSION);
  const inputSelector = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
    if (found.length === 0) {
      CompetencesPrimitives.ajouterCompetence(VERSION, nom, '3 ANS');
    }
  });
  CompetencesPrimitives.toggleVisibilite(VERSION, nom, false);
});

// ─── Vérifications ──────────────────────────────────────────────────────────

Then('la compétence {string} apparaît dans ma liste', (nom: string) => {
  CompetencesPrimitives.verifierExiste(VERSION, nom);
});

Then('la compétence {string} n\'apparaît plus dans ma liste', (nom: string) => {
  CompetencesPrimitives.verifierAbsente(VERSION, nom);
});

Then('la compétence {string} est masquée sur le CV', (nom: string) => {
  CompetencesPrimitives.verifierVisibilite(VERSION, nom, false);
});

Then('la compétence {string} est visible sur le CV', (nom: string) => {
  CompetencesPrimitives.verifierVisibilite(VERSION, nom, true);
});