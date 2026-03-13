import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version, getSelector, SECTION_LANGUES } from '../../config/section/selectors-langues.config';
import { LanguesPrimitives } from '../../primitives/sections-cv/Langues.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// ─── Ajout ──────────────────────────────────────────────────────────────────

When('j\'ajoute la langue {string} avec le niveau {string}', (nom: string, niveau: string) => {
  LanguesPrimitives.ajouterLangue(VERSION, nom, niveau);
});

// ─── Modification ───────────────────────────────────────────────────────────

When(
  'je modifie la langue {string} en {string} avec le niveau {string}',
  (ancienNom: string, nouveauNom: string, nouveauNiveau: string) => {
    LanguesPrimitives.modifierLangue(VERSION, ancienNom, nouveauNom, nouveauNiveau);
  }
);

// ─── Suppression ────────────────────────────────────────────────────────────

When('je supprime la langue {string}', (nom: string) => {
  LanguesPrimitives.supprimerLangue(VERSION, nom);
});

// ─── Visibilité ─────────────────────────────────────────────────────────────

When('je masque la langue {string} du CV', (nom: string) => {
  LanguesPrimitives.toggleVisibilite(VERSION, nom, false);
});

When('je rends visible la langue {string} sur le CV', (nom: string) => {
  LanguesPrimitives.toggleVisibilite(VERSION, nom, true);
});

// ─── Préparation des données ────────────────────────────────────────────────

Given('une langue {string} existe dans ma liste', (nom: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer que la langue "${nom}" existe`);

  const rowSelector = getSelector(SECTION_LANGUES.ROW, VERSION);
  const inputSelector = getSelector(SECTION_LANGUES.INPUT_LANGUE, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) =>
      (el as HTMLInputElement).value === nom
    );

    if (found.length === 0) {
      cy.log(`➕ Langue "${nom}" inexistante → création`);
      LanguesPrimitives.ajouterLangue(VERSION, nom, 'B2');
    } else {
      cy.log(`✅ Langue "${nom}" déjà présente`);
    }
  });
});

Given('une langue {string} existe et est visible sur le CV', (nom: string) => {
  cy.log(`🔧 PRÉPARATION: Langue "${nom}" existe et visible`);

  const rowSelector = getSelector(SECTION_LANGUES.ROW, VERSION);
  const inputSelector = getSelector(SECTION_LANGUES.INPUT_LANGUE, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) =>
      (el as HTMLInputElement).value === nom
    );
    if (found.length === 0) {
      LanguesPrimitives.ajouterLangue(VERSION, nom, 'B2');
    }
  });

  LanguesPrimitives.toggleVisibilite(VERSION, nom, true);
});

Given('une langue {string} existe et est masquée sur le CV', (nom: string) => {
  cy.log(`🔧 PRÉPARATION: Langue "${nom}" existe et masquée`);

  const rowSelector = getSelector(SECTION_LANGUES.ROW, VERSION);
  const inputSelector = getSelector(SECTION_LANGUES.INPUT_LANGUE, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) =>
      (el as HTMLInputElement).value === nom
    );
    if (found.length === 0) {
      LanguesPrimitives.ajouterLangue(VERSION, nom, 'B2');
    }
  });

  LanguesPrimitives.toggleVisibilite(VERSION, nom, false);
});

// ─── Vérifications ──────────────────────────────────────────────────────────

Then('la langue {string} apparaît dans ma liste', (nom: string) => {
  LanguesPrimitives.verifierLangueExiste(VERSION, nom);
});

Then('la langue {string} n\'apparaît plus dans ma liste', (nom: string) => {
  LanguesPrimitives.verifierLangueAbsente(VERSION, nom);
});

Then('la langue {string} est masquée sur le CV', (nom: string) => {
  LanguesPrimitives.verifierVisibilite(VERSION, nom, false);
});

Then('la langue {string} est visible sur le CV', (nom: string) => {
  LanguesPrimitives.verifierVisibilite(VERSION, nom, true);
});

// Les steps de navigation (quitter/revenir section) sont dans titre-cv.steps.ts.