/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STEP DEFINITIONS - AUTHENTIFICATION
 * ═══════════════════════════════════════════════════════════════════════════
 * Décodage technique : Lien Gherkin ↔ Primitives
 * 
 * Ces steps sont RÉUTILISÉS par tous les modules (carte-cv, profil, etc.)
 * dans leurs Background
 */

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version, AUTH_CREDENTIALS } from '../../config/selectors-auth.config';
import { AuthPrimitives } from '../../primitives/auth/auth.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// ═══════════════════════════════════════════════════════════════════════════════
// 🌐 NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

Given('Je suis sur la page de connexion', () => {
  AuthPrimitives.naviguerPageConnexion(VERSION);
});

Given('Je ne suis pas authentifié', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.log('🔒 Session nettoyée');
});

Given('Je suis authentifié dans l\'application', () => {
  AuthPrimitives.authentifierComplet(VERSION);
  AuthPrimitives.verifierAuthentificationReussie(VERSION);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🔐 CONNEXION
// ═══════════════════════════════════════════════════════════════════════════════

When('Je me connecte avec un compte valide', () => {
  AuthPrimitives.seConnecter(
    VERSION,
    AUTH_CREDENTIALS.VALID.email,
    AUTH_CREDENTIALS.VALID.password
  );
});

When('Je tente de me connecter avec des identifiants incorrects', () => {
  AuthPrimitives.seConnecter(
    VERSION,
    AUTH_CREDENTIALS.INVALID.email,
    AUTH_CREDENTIALS.INVALID.password
  );
});

When('Je tente de me connecter avec un email au format invalide', () => {
  AuthPrimitives.seConnecter(
    VERSION,
    AUTH_CREDENTIALS.EMAIL_INVALIDE.email,
    AUTH_CREDENTIALS.EMAIL_INVALIDE.password
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🚪 DÉCONNEXION
// ═══════════════════════════════════════════════════════════════════════════════

When('Je me déconnecte', () => {
  AuthPrimitives.seDeconnecter(VERSION);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🚫 ACCÈS PROTÉGÉ
// ═══════════════════════════════════════════════════════════════════════════════

When('Je tente d\'accéder à une page protégée', () => {
  AuthPrimitives.tenterAccesPageProtegee(VERSION);
});

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ VÉRIFICATIONS - SUCCÈS
// ═══════════════════════════════════════════════════════════════════════════════

Then('Je suis authentifié avec succès', () => {
  AuthPrimitives.verifierAuthentificationReussie(VERSION);
});

Then('Je vois mon espace personnel', () => {
  AuthPrimitives.verifierEspacePersonnel(VERSION);
});

// ═══════════════════════════════════════════════════════════════════════════════
// ❌ VÉRIFICATIONS - ERREURS
// ═══════════════════════════════════════════════════════════════════════════════

Then('L\'authentification échoue', () => {
  AuthPrimitives.verifierResteSurPageConnexion(VERSION);
});

Then('Je vois un message d\'erreur indiquant que les identifiants sont invalides', () => {
  AuthPrimitives.verifierErreurIdentifiants(VERSION);
});

Then('Je vois un message indiquant que le compte n\'existe pas', () => {
  AuthPrimitives.verifierErreurCompteInexistant(VERSION);
});

Then('Je reste sur la page de connexion', () => {
  AuthPrimitives.verifierResteSurPageConnexion(VERSION);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🚪 VÉRIFICATIONS - DÉCONNEXION
// ═══════════════════════════════════════════════════════════════════════════════

Then('Je suis redirigé vers la page de connexion', () => {
  AuthPrimitives.verifierRedirectionPageConnexion(VERSION);
});

Then('Ma session est terminée', () => {
  AuthPrimitives.verifierSessionTerminee(VERSION);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🚫 VÉRIFICATIONS - ACCÈS PROTÉGÉ
// ═══════════════════════════════════════════════════════════════════════════════

Then('L\'accès est refusé', () => {
  AuthPrimitives.verifierRedirectionPageConnexion(VERSION);
});