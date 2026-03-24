import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-technologies.config';
import { TechnologiesPrimitives } from '../../primitives/sections-cv/technologies.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Ajout avec experience

When(
  'j\'ajoute la technologie {string} avec {string} d\'expérience dans la catégorie {string}',
  (nom: string, experience: string, categorie: string) => {
    TechnologiesPrimitives.ajouterTechnologie(VERSION, categorie, nom, experience);
  }
);

// Ajout sans experience, garde pour les anciens cas

When(
  'j\'ajoute la technologie {string} dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.ajouterTechnologie(VERSION, categorie, nom);
  }
);

// Suppression

When(
  'je supprime la technologie {string} de la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.supprimerTechnologie(VERSION, categorie, nom);
  }
);

// Visibilite

When(
  'je masque la technologie {string} de la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.toggleVisibilite(VERSION, categorie, nom, false);
  }
);

When(
  'je rends visible la technologie {string} dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.toggleVisibilite(VERSION, categorie, nom, true);
  }
);

// Preparation

Given(
  'la technologie {string} existe dans la catégorie {string}',
  (nom: string, categorie: string) => {
    cy.log(`Verifier que "${nom}" existe dans "${categorie}"`);

    // On ouvre la bonne categorie avant de chercher la techno.
    TechnologiesPrimitives.selectionnerCategorie(VERSION, categorie);

    cy.get('[data-cy="technologieTitre"] input').then($inputs => {
      const found = $inputs.filter((_i, el) =>
        (el as HTMLInputElement).value === nom
      );

      if (found.length === 0) {
        cy.log(`"${nom}" n'existe pas encore, on la cree`);
        // La categorie est deja ouverte, on remplit juste la ligne vide.
        cy.get('[data-cy="technologieTitre"] input')
          .filter((_i, el) => (el as HTMLInputElement).value === '')
          .last()
          .scrollIntoView()
          .clear()
          .type(nom)
          .blur();

        cy.wait(2500);
      } else {
        cy.log(`"${nom}" est deja presente`);
      }
    });
  }
);

Given(
  'la technologie {string} existe et est visible dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.selectionnerCategorie(VERSION, categorie);

    cy.get('[data-cy="technologieTitre"] input').then($inputs => {
      const found = $inputs.filter((_i, el) =>
        (el as HTMLInputElement).value === nom
      );
      if (found.length === 0) {
        cy.get('[data-cy="technologieTitre"] input')
          .filter((_i, el) => (el as HTMLInputElement).value === '')
          .last()
          .scrollIntoView()
          .clear()
          .type(nom)
          .blur();
        cy.wait(2500);
      }
    });

    TechnologiesPrimitives.toggleVisibilite(VERSION, categorie, nom, true);
  }
);

Given(
  'la technologie {string} existe et est masquée dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.selectionnerCategorie(VERSION, categorie);

    cy.get('[data-cy="technologieTitre"] input').then($inputs => {
      const found = $inputs.filter((_i, el) =>
        (el as HTMLInputElement).value === nom
      );
      if (found.length === 0) {
        cy.get('[data-cy="technologieTitre"] input')
          .filter((_i, el) => (el as HTMLInputElement).value === '')
          .last()
          .scrollIntoView()
          .clear()
          .type(nom)
          .blur();
        cy.wait(2500);
      }
    });

    TechnologiesPrimitives.toggleVisibilite(VERSION, categorie, nom, false);
  }
);

// Verifications

Then(
  'la technologie {string} apparaît dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.verifierTechnologieExiste(VERSION, categorie, nom);
  }
);

Then(
  'la technologie {string} n\'apparaît plus dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.verifierTechnologieAbsente(VERSION, categorie, nom);
  }
);

Then(
  'la technologie {string} est masquée dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.verifierVisibilite(VERSION, categorie, nom, false);
  }
);

Then(
  'la technologie {string} est visible dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.verifierVisibilite(VERSION, categorie, nom, true);
  }
);
