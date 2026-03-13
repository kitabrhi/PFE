import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version, getSelector, SECTION_DIPLOMES } from '../../config/section/Selectors-diplomes.config';
import { DiplomesPrimitives } from '../../primitives/sections-cv/Diplomes.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// ─── Ajout ──────────────────────────────────────────────────────────────────

When('j\'ajoute un diplôme {string} à {string} en {string}', (nom: string, lieu: string, annee: string) => {
  DiplomesPrimitives.ajouterDiplome(VERSION, nom, lieu, annee);
});

// ─── Modification ───────────────────────────────────────────────────────────

When(
  'je modifie le diplôme {string} en {string} à {string} en {string}',
  (ancienNom: string, nouveauNom: string, nouveauLieu: string, nouvelleAnnee: string) => {
    DiplomesPrimitives.modifierDiplome(VERSION, ancienNom, nouveauNom, nouveauLieu, nouvelleAnnee);
  }
);

// ─── Suppression ────────────────────────────────────────────────────────────

When('je supprime le diplôme {string}', (nom: string) => {
  DiplomesPrimitives.supprimerDiplome(VERSION, nom);
});

// ─── Visibilité ─────────────────────────────────────────────────────────────

When('je masque le diplôme {string} du CV', (nom: string) => {
  DiplomesPrimitives.toggleVisibilite(VERSION, nom, false);
});

When('je rends visible le diplôme {string} sur le CV', (nom: string) => {
  DiplomesPrimitives.toggleVisibilite(VERSION, nom, true);
});

// ─── Préparation des données ────────────────────────────────────────────────

Given('un diplôme {string} existe dans ma liste', (nom: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer que le diplôme "${nom}" existe`);

  const rowSelector = getSelector(SECTION_DIPLOMES.ROW, VERSION);
  const inputSelector = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) =>
      (el as HTMLInputElement).value === nom
    );

    if (found.length === 0) {
      cy.log(`➕ Diplôme "${nom}" inexistant → création`);
      DiplomesPrimitives.ajouterDiplome(VERSION, nom, 'Université Hassan II', '2024');
    } else {
      cy.log(`✅ Diplôme "${nom}" déjà présent`);
    }
  });
});

Given('un diplôme {string} existe et est visible sur le CV', (nom: string) => {
  cy.log(`🔧 PRÉPARATION: Diplôme "${nom}" existe et visible`);

  const rowSelector = getSelector(SECTION_DIPLOMES.ROW, VERSION);
  const inputSelector = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) =>
      (el as HTMLInputElement).value === nom
    );
    if (found.length === 0) {
      DiplomesPrimitives.ajouterDiplome(VERSION, nom, 'Université Hassan II', '2024');
    }
  });

  DiplomesPrimitives.toggleVisibilite(VERSION, nom, true);
});

Given('un diplôme {string} existe et est masqué sur le CV', (nom: string) => {
  cy.log(`🔧 PRÉPARATION: Diplôme "${nom}" existe et masqué`);

  const rowSelector = getSelector(SECTION_DIPLOMES.ROW, VERSION);
  const inputSelector = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, VERSION);

  cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
    const found = $inputs.filter((_i, el) =>
      (el as HTMLInputElement).value === nom
    );
    if (found.length === 0) {
      DiplomesPrimitives.ajouterDiplome(VERSION, nom, 'Université Hassan II', '2024');
    }
  });

  DiplomesPrimitives.toggleVisibilite(VERSION, nom, false);
});

// ─── Vérifications ──────────────────────────────────────────────────────────

Then('le diplôme {string} apparaît dans ma liste', (nom: string) => {
  DiplomesPrimitives.verifierDiplomeExiste(VERSION, nom);
});

Then('le diplôme {string} n\'apparaît plus dans ma liste', (nom: string) => {
  DiplomesPrimitives.verifierDiplomeAbsent(VERSION, nom);
});

Then('le diplôme {string} est masqué sur le CV', (nom: string) => {
  DiplomesPrimitives.verifierVisibilite(VERSION, nom, false);
});

Then('le diplôme {string} est visible sur le CV', (nom: string) => {
  DiplomesPrimitives.verifierVisibilite(VERSION, nom, true);
});

// Les steps de navigation (quitter/revenir section) sont dans titre-cv.steps.ts.