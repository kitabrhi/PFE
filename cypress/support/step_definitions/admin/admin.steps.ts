/**
 * Étapes pour les fonctions d'administration :
 * - Invitation Candidat
 * - Recherche CV
 */

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/admin/selectors-admin.config';
import { AdminPrimitives } from '../../primitives/admin/admin.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';
 
// ── INVITATION CANDIDAT ──
 
When('j\'envoie une invitation à {string}', (email: string) => {
  AdminPrimitives.envoyerInvitation(VERSION, email);
});

When('je clique sur modifier mon CV', () => {
  AdminPrimitives.cliquerModifierMonCV(VERSION);
});
 
Then('un CV de {string} est présent dans les résultats', (nom: string) => {
  AdminPrimitives.verifierCVExistePourNom(nom);
});

When('je saisis l\'email invalide {string}', (email: string) => {
  cy.get('input.input-invit', { timeout: 10000 })
    .scrollIntoView()
    .clear()
    .type(email, { delay: 50 })
    .blur();
});
 
When('je clique sur "Envoyer" sans saisir d\'email', () => {
  cy.get('red-user-invitation button[type="submit"]', { timeout: 10000 })
    .scrollIntoView()
    .click({ force: true });
});
 
Then('l\'invitation est envoyée avec succès', () => {
  AdminPrimitives.verifierInvitationEnvoyee();
});
 
Then('le formulaire d\'invitation est invalide', () => {
  AdminPrimitives.verifierErreurEmailInvalide();
});
 
// ── RECHERCHE CV ──
 
When('je recherche {string}', (terme: string) => {
  AdminPrimitives.rechercherCV(VERSION, terme);
});
 
Then('des résultats de recherche s\'affichent', () => {
  AdminPrimitives.verifierResultatsAffiches();
});
 
Then('les résultats contiennent {string}', (nom: string) => {
  AdminPrimitives.verifierResultatContient(nom);
});
 
Then('aucun résultat n\'est affiché', () => {
  AdminPrimitives.verifierAucunResultat();
});
 
Then('un CV de {string} a le statut {string}', (nom: string, statut: string) => {
  AdminPrimitives.verifierStatutCV(nom, statut);
});
 
// ── ACTIONS SUR LES CARTES CV ──
 
When('je clique sur modifier le CV de {string}', (nom: string) => {
  AdminPrimitives.cliquerModifierCV(VERSION, nom);
});
 
When('je clique sur voir le CV de {string}', (nom: string) => {
  AdminPrimitives.cliquerVoirCV(VERSION, nom);
});
 
When('je clique sur supprimer le CV de {string}', (nom: string) => {
  AdminPrimitives.cliquerSupprimerCV(VERSION, nom);
});
 
Then('je suis redirigé vers l\'édition du CV', () => {
  cy.url({ timeout: 10000 }).should('include', '/user/');
  cy.log('Redirigé vers l\'édition du CV');
});
 