/**
 * Étapes pour la section Compétences.
 * Pattern : le Given mémorise l'élément, le When utilise "cette compétence".
 */

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-competences.config';
import { CompetencesPrimitives } from '../../primitives/sections-cv/competences.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

let derniereCompetence = '';

// ═══════════════════════════════════════════════════════════════════════════════
//  PRÉPARATION
// ═══════════════════════════════════════════════════════════════════════════════

Given('une compétence {string} existe dans ma liste', (nom: string) => {
  derniereCompetence = nom;
  CompetencesPrimitives.garantirCompetenceExiste(VERSION, nom);
});

Given('une compétence {string} existe et est visible sur le CV', (nom: string) => {
  derniereCompetence = nom;
  CompetencesPrimitives.garantirCompetenceExiste(VERSION, nom);
  CompetencesPrimitives.toggleVisibilite(VERSION, nom, true);
});

Given('une compétence {string} existe et est masquée sur le CV', (nom: string) => {
  derniereCompetence = nom;
  CompetencesPrimitives.garantirCompetenceExiste(VERSION, nom);
  CompetencesPrimitives.toggleVisibilite(VERSION, nom, false);
});

// ═══════════════════════════════════════════════════════════════════════════════
//  AJOUT
// ═══════════════════════════════════════════════════════════════════════════════

When('j\'ajoute la compétence {string} avec {string} d\'expérience', (nom: string, exp: string) => {
  CompetencesPrimitives.ajouterCompetence(VERSION, nom, exp);
});

// ═══════════════════════════════════════════════════════════════════════════════
//  MODIFICATION / SUPPRESSION / VISIBILITÉ — "cette compétence"
// ═══════════════════════════════════════════════════════════════════════════════

When('je modifie cette compétence en {string} avec {string} d\'expérience', (nouveauNom: string, nouvelleExp: string) => {
  CompetencesPrimitives.modifierCompetence(VERSION, derniereCompetence, nouveauNom, nouvelleExp);
});

When('je supprime cette compétence', () => {
  CompetencesPrimitives.supprimerCompetence(VERSION, derniereCompetence);
});

When('je masque cette compétence du CV', () => {
  CompetencesPrimitives.toggleVisibilite(VERSION, derniereCompetence, false);
});

When('je rends visible cette compétence sur le CV', () => {
  CompetencesPrimitives.toggleVisibilite(VERSION, derniereCompetence, true);
});

// ═══════════════════════════════════════════════════════════════════════════════
//  VÉRIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

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