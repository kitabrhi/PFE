/// <reference types="cypress" />

import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { AuthNavigationPrimitives } from "../primitives/auth/navigation";
import { AuthConnexionPrimitives } from "../primitives/auth/connexion";
import { AuthDeconnexionPrimitives } from "../primitives/auth/deconnexion";
import { AuthVerificationPrimitives } from "../primitives/auth/verification";

const VERSION = 'v1'
const EMAIL: string = Cypress.env('userEmail')
const PASSWORD: string = Cypress.env('userPassword')

/**
 * ════════════════════════════════════════════════════════════
 * STEPS AUTHENTIFICATION - Spécifiques module Auth
 * ════════════════════════════════════════════════════════════
 */

// ═══ WHEN ═══

When('Je me connecte avec un compte valide', () => {
  AuthConnexionPrimitives.seConnecter(EMAIL, PASSWORD, VERSION)
})

When('Je tente de me connecter avec des identifiants incorrects', () => {
  AuthConnexionPrimitives.seConnecter("wrong@email.com", "wrongpass", VERSION)
})

When('Je tente de me connecter avec un email au format invalide', () => {
  AuthConnexionPrimitives.seConnecter("emailsansarobase", PASSWORD, VERSION)
})

When('Je me déconnecte', () => {
  AuthDeconnexionPrimitives.seDeconnecter(VERSION)
})

When('Je tente d\'accéder à une page protégée', () => {
  AuthNavigationPrimitives.tenterAccesPageProtegee(VERSION)
})

// ═══ THEN ═══

Then('Je suis authentifié avec succès', () => {
  AuthVerificationPrimitives.verifierAuthentificationReussie(VERSION)
})

Then('Je vois mon espace personnel', () => {
  AuthVerificationPrimitives.verifierEspacePersonnel(VERSION)
})

Then('Je vois un message d\'erreur indiquant que les identifiants sont invalides', () => {
  AuthVerificationPrimitives.verifierErreurIdentifiants(VERSION)
})

Then('Je vois un message indiquant que le compte n\'existe pas', () => {
  AuthVerificationPrimitives.verifierErreurCompteInexistant(VERSION)
})

Then('Je reste sur la page de connexion', () => {
  AuthVerificationPrimitives.verifierResteSurPageConnexion(VERSION)
})

Then('Je suis redirigé vers la page de connexion', () => {
  AuthVerificationPrimitives.verifierRedirectionPageConnexion(VERSION)
})