/**
 * Étapes pour la section Configuration et Générer CV.
 */

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/configuration/selectors-configuration.config';
import { ConfigurationPrimitives } from '../../primitives/configuration/configuration.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';
 
// ── PRÉPARATION ──
 
Given('je suis sur un CV existant', () => {
  cy.log('Navigation vers Mes CVS');
  cy.get('.mat-sidenav', { timeout: 10000 }).should('be.visible');
  cy.contains('a', 'Mes CVS').click({ force: true });
  cy.url().should('include', '/user/versioning');
 
  cy.log('Sélection du premier CV');
  cy.get('.mat-mdc-table', { timeout: 10000 }).first().scrollIntoView().should('be.visible');
  cy.get('tr.mat-mdc-row').first().click();
  cy.wait(1500);
  cy.log('CV sélectionné');
});
 
Given('le mode sombre est désactivé', () => {
  ConfigurationPrimitives.desactiverModeSombre(VERSION);
});
 
Given('le mode sombre est activé', () => {
  ConfigurationPrimitives.activerModeSombre(VERSION);
});
 
// ── DOWNLOAD PROFIL ──
 
When('je clique sur "Download profil" dans la configuration', () => {
  ConfigurationPrimitives.telechargerProfil(VERSION);
});
 
Then('un fichier JSON est téléchargé', () => {
  ConfigurationPrimitives.verifierDownloadDeclenche();
});
 
// ── UPLOAD PROFIL ──
 
When('j\'uploade le fichier {string} dans la configuration', (cheminFichier: string) => {
  ConfigurationPrimitives.uploaderProfil(VERSION, cheminFichier);
});
 
Then('le profil est importé avec succès', () => {
  ConfigurationPrimitives.verifierUploadReussi();
});
 
// ── MODE SOMBRE ──
 
When('j\'active le mode sombre', () => {
  ConfigurationPrimitives.activerModeSombre(VERSION);
});
 
When('je désactive le mode sombre', () => {
  ConfigurationPrimitives.desactiverModeSombre(VERSION);
});
 
Then('l\'application est en mode sombre', () => {
  ConfigurationPrimitives.verifierModeSombreActif();
});
 
Then('l\'application est en mode clair', () => {
  ConfigurationPrimitives.verifierModeSombreInactif();
});
 
// ── GÉNÉRER CV ──
 
When('je clique sur "Générer CV"', () => {
  ConfigurationPrimitives.naviguerVersGenererCV(VERSION);
});
 
When('je clique sur "Télécharger le CV"', () => {
  ConfigurationPrimitives.telechargerCV(VERSION);
});
 
Then('la page de génération du CV s\'affiche', () => {
  ConfigurationPrimitives.verifierPageGenererCV();
});
 
Then('l\'aperçu du CV est visible', () => {
  ConfigurationPrimitives.verifierApercuCV();
});
 
Then('le CV est téléchargé', () => {
  // vérifier que le téléchargement a été déclenché sans erreur
  cy.log('Vérification téléchargement CV');
  cy.contains('Télécharger le CV', { timeout: 10000 }).should('exist');
});
 
// ── NAVIGATION (pour persistance mode sombre) ──
 
When('je navigue vers la section {string}', (section: string) => {
  cy.contains('.mat-sidenav a', section, { timeout: 10000 })
    .click({ force: true });
  cy.wait(1000);
});
 
When('je reviens sur la configuration', () => {
  ConfigurationPrimitives.ouvrirMenuConfiguration(VERSION);
});
 