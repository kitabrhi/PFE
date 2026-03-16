// Steps pour l'authentification — connexion, déconnexion et vérifications.
// Les steps n'importent rien de la config, tout passe par les primitives.

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/auth/selectors-auth.config';
import { AuthPrimitives } from '../../primitives/auth/auth.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Navigation / session

Given('Je suis sur la page de connexion', () => {
  AuthPrimitives.naviguerPageConnexion(VERSION);
});

Given('Je ne suis pas authentifié', () => {
  AuthPrimitives.nettoyerSession();
});

Given('Je suis authentifié dans l\'application', () => {
  AuthPrimitives.authentifierComplet(VERSION);
  AuthPrimitives.verifierAuthentificationReussie(VERSION);
});

// Connexion

When('Je me connecte avec un compte valide', () => {
  AuthPrimitives.seConnecterCompteValide(VERSION);
});

When('Je tente de me connecter avec des identifiants incorrects', () => {
  AuthPrimitives.seConnecterIdentifiantsIncorrects(VERSION);
});

When('Je tente de me connecter avec un email au format invalide', () => {
  AuthPrimitives.seConnecterEmailInexistant(VERSION);
});

// Déconnexion

When('Je me déconnecte', () => {
  AuthPrimitives.seDeconnecter(VERSION);
});

// Accès protégé

When('Je tente d\'accéder à une page protégée', () => {
  AuthPrimitives.tenterAccesPageProtegee(VERSION);
});

// Vérifications — succès

Then('Je suis authentifié avec succès', () => {
  AuthPrimitives.verifierAuthentificationReussie(VERSION);
});

Then('Je vois mon espace personnel', () => {
  AuthPrimitives.verifierEspacePersonnel(VERSION);
});

// Vérifications — erreurs

Then('L\'authentification échoue', () => {
  AuthPrimitives.verifierSurPageConnexion(VERSION);
});

Then('Je vois un message d\'erreur indiquant que les identifiants sont invalides', () => {
  AuthPrimitives.verifierErreurIdentifiants(VERSION);
});

Then('Je vois un message indiquant que le compte n\'existe pas', () => {
  AuthPrimitives.verifierErreurCompteInexistant(VERSION);
});

Then('Je reste sur la page de connexion', () => {
  AuthPrimitives.verifierSurPageConnexion(VERSION);
});

// Vérifications — déconnexion / accès refusé

Then('Je suis redirigé vers la page de connexion', () => {
  AuthPrimitives.verifierSurPageConnexion(VERSION);
});

Then('Ma session est terminée', () => {
  AuthPrimitives.verifierSurPageConnexion(VERSION);
});

Then('L\'accès est refusé', () => {
  AuthPrimitives.verifierSurPageConnexion(VERSION);
});
