import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import {
  Version,
  FIXTURES_TECHNOLOGIES
} from '../../config/section/selectors-technologies.config';
import { TechnologiesPrimitives } from '../../primitives/sections-cv/technologies.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Utilitaire pour les Given

function assurerTechnologieExiste(nom: string, categorie: string): void {
  TechnologiesPrimitives.selectionnerCategorie(VERSION, categorie);
  TechnologiesPrimitives.ajouterTechnologie(VERSION, categorie, nom);
}

When(
  'j\'ajoute la technologie {string} avec une expérience dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.ajouterTechnologie(
      VERSION, categorie, nom, FIXTURES_TECHNOLOGIES.EXPERIENCE_PAR_DEFAUT
    );
  }
);

When(
  'j\'ajoute la technologie {string} dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.ajouterTechnologie(VERSION, categorie, nom);
  }
);

When(
  'je supprime la technologie {string} de la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.supprimerTechnologie(VERSION, categorie, nom);
  }
);

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

When(
  'je modifie l\'expérience de {string} dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.modifierExperience(
      VERSION, categorie, nom, FIXTURES_TECHNOLOGIES.NOUVELLE_EXPERIENCE
    );
  }
);

Given(
  'la technologie {string} existe dans la catégorie {string}',
  (nom: string, categorie: string) => {
    assurerTechnologieExiste(nom, categorie);
  }
);

Given(
  'la technologie {string} existe et est visible dans la catégorie {string}',
  (nom: string, categorie: string) => {
    assurerTechnologieExiste(nom, categorie);
    TechnologiesPrimitives.toggleVisibilite(VERSION, categorie, nom, true);
  }
);

Given(
  'la technologie {string} existe et est masquée dans la catégorie {string}',
  (nom: string, categorie: string) => {
    assurerTechnologieExiste(nom, categorie);
    TechnologiesPrimitives.toggleVisibilite(VERSION, categorie, nom, false);
  }
);

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

Then(
  'l\'expérience de {string} est mise à jour dans la catégorie {string}',
  (nom: string, categorie: string) => {
    TechnologiesPrimitives.verifierExperience(
      VERSION, categorie, nom, FIXTURES_TECHNOLOGIES.NOUVELLE_EXPERIENCE
    );
  }
);
