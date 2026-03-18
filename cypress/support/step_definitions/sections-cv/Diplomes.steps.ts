/**
 * Étapes pour la section Diplômes.
 * Pattern : le Given mémorise l'élément, le When utilise "ce diplôme".
 */

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-diplomes.config';
import { DiplomesPrimitives } from '../../primitives/sections-cv/diplomes.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

let dernierDiplome = '';

//  PRÉPARATION

Given('un diplôme {string} existe dans ma liste', (nom: string) => {
  dernierDiplome = nom;
  DiplomesPrimitives.garantirDiplomeExiste(VERSION, nom);
});

Given('un diplôme {string} existe et est visible sur le CV', (nom: string) => {
  dernierDiplome = nom;
  DiplomesPrimitives.garantirDiplomeExiste(VERSION, nom);
  DiplomesPrimitives.toggleVisibilite(VERSION, nom, true);
});

Given('un diplôme {string} existe et est masqué sur le CV', (nom: string) => {
  dernierDiplome = nom;
  DiplomesPrimitives.garantirDiplomeExiste(VERSION, nom);
  DiplomesPrimitives.toggleVisibilite(VERSION, nom, false);
});

//  AJOUT

When('j\'ajoute un diplôme {string} à {string} en {string}', (nom: string, lieu: string, annee: string) => {
  DiplomesPrimitives.ajouterDiplome(VERSION, nom, lieu, annee);
});

//  MODIFICATION / SUPPRESSION / VISIBILITÉ — "ce diplôme"

When('je modifie ce diplôme en {string} à {string} en {string}', (nouveauNom: string, nouveauLieu: string, nouvelleAnnee: string) => {
  DiplomesPrimitives.modifierDiplome(VERSION, dernierDiplome, nouveauNom, nouveauLieu, nouvelleAnnee);
});

When('je supprime ce diplôme', () => {
  DiplomesPrimitives.supprimerDiplome(VERSION, dernierDiplome);
});

When('je masque ce diplôme du CV', () => {
  DiplomesPrimitives.toggleVisibilite(VERSION, dernierDiplome, false);
});

When('je rends visible ce diplôme sur le CV', () => {
  DiplomesPrimitives.toggleVisibilite(VERSION, dernierDiplome, true);
});

//  VÉRIFICATIONS

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