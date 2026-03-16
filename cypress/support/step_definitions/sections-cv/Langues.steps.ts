// Steps pour la section Langues — tout passe par les primitives.

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-langues.config';
import { LanguesPrimitives } from '../../primitives/sections-cv/Langues.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Préparation

Given('une langue {string} existe dans ma liste', (nom: string) => {
  LanguesPrimitives.garantirLangueExiste(VERSION, nom);
});

Given('une langue {string} existe et est visible sur le CV', (nom: string) => {
  LanguesPrimitives.garantirLangueExiste(VERSION, nom);
  LanguesPrimitives.toggleVisibilite(VERSION, nom, true);
});

Given('une langue {string} existe et est masquée sur le CV', (nom: string) => {
  LanguesPrimitives.garantirLangueExiste(VERSION, nom);
  LanguesPrimitives.toggleVisibilite(VERSION, nom, false);
});

// Ajout

When('j\'ajoute la langue {string} avec le niveau {string}', (nom: string, niveau: string) => {
  LanguesPrimitives.ajouterLangue(VERSION, nom, niveau);
});

// Modification

When(
  'je modifie la langue {string} en {string} avec le niveau {string}',
  (ancienNom: string, nouveauNom: string, nouveauNiveau: string) => {
    LanguesPrimitives.modifierLangue(VERSION, ancienNom, nouveauNom, nouveauNiveau);
  }
);

// Suppression

When('je supprime la langue {string}', (nom: string) => {
  LanguesPrimitives.supprimerLangue(VERSION, nom);
});

// Visibilité

When('je masque la langue {string} du CV', (nom: string) => {
  LanguesPrimitives.toggleVisibilite(VERSION, nom, false);
});

When('je rends visible la langue {string} sur le CV', (nom: string) => {
  LanguesPrimitives.toggleVisibilite(VERSION, nom, true);
});

// Vérifications

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
