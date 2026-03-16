// Steps pour la section Diplômes — tout passe par les primitives.

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-diplomes.config';
import { DiplomesPrimitives } from '../../primitives/sections-cv/Diplomes.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Préparation

Given('un diplôme {string} existe dans ma liste', (nom: string) => {
  DiplomesPrimitives.garantirDiplomeExiste(VERSION, nom);
});

Given('un diplôme {string} existe et est visible sur le CV', (nom: string) => {
  DiplomesPrimitives.garantirDiplomeExiste(VERSION, nom);
  DiplomesPrimitives.toggleVisibilite(VERSION, nom, true);
});

Given('un diplôme {string} existe et est masqué sur le CV', (nom: string) => {
  DiplomesPrimitives.garantirDiplomeExiste(VERSION, nom);
  DiplomesPrimitives.toggleVisibilite(VERSION, nom, false);
});

// Ajout

When('j\'ajoute un diplôme {string} à {string} en {string}', (nom: string, lieu: string, annee: string) => {
  DiplomesPrimitives.ajouterDiplome(VERSION, nom, lieu, annee);
});

// Modification

When(
  'je modifie le diplôme {string} en {string} à {string} en {string}',
  (ancienNom: string, nouveauNom: string, nouveauLieu: string, nouvelleAnnee: string) => {
    DiplomesPrimitives.modifierDiplome(VERSION, ancienNom, nouveauNom, nouveauLieu, nouvelleAnnee);
  }
);

// Suppression

When('je supprime le diplôme {string}', (nom: string) => {
  DiplomesPrimitives.supprimerDiplome(VERSION, nom);
});

// Visibilité

When('je masque le diplôme {string} du CV', (nom: string) => {
  DiplomesPrimitives.toggleVisibilite(VERSION, nom, false);
});

When('je rends visible le diplôme {string} sur le CV', (nom: string) => {
  DiplomesPrimitives.toggleVisibilite(VERSION, nom, true);
});

// Vérifications

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
