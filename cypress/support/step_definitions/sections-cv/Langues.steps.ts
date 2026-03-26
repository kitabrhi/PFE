import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-langues.config';
import { LanguesPrimitives } from '../../primitives/sections-cv/Langues.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

let derniereLangue = '';

//  PRÉPARATION \

Given('une langue {string} existe dans ma liste', (nom: string) => {
  derniereLangue = nom;
  LanguesPrimitives.garantirLangueExiste(VERSION, nom);
});

Given('une langue {string} existe et est visible sur le CV', (nom: string) => {
  derniereLangue = nom;
  LanguesPrimitives.garantirLangueExiste(VERSION, nom);
  LanguesPrimitives.toggleVisibilite(VERSION, nom, true);
});

Given('une langue {string} existe et est masquée sur le CV', (nom: string) => {
  derniereLangue = nom;
  LanguesPrimitives.garantirLangueExiste(VERSION, nom);
  LanguesPrimitives.toggleVisibilite(VERSION, nom, false);
});
// Ajout
When('j\'ajoute la langue {string} avec le niveau {string}', (nom: string, niveau: string) => {
  LanguesPrimitives.ajouterLangue(VERSION, nom, niveau);
});
// Modification, suppression et visibilite

When('je modifie cette langue en {string} avec le niveau {string}', (nouveauNom: string, nouveauNiveau: string) => {
  LanguesPrimitives.modifierLangue(VERSION, derniereLangue, nouveauNom, nouveauNiveau);
});

When('je supprime cette langue', () => {
  LanguesPrimitives.supprimerLangue(VERSION, derniereLangue);
});

When('je masque cette langue du CV', () => {
  LanguesPrimitives.toggleVisibilite(VERSION, derniereLangue, false);
});

When('je rends visible cette langue sur le CV', () => {
  LanguesPrimitives.toggleVisibilite(VERSION, derniereLangue, true);
});

//  VÉRIFICATIONS

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