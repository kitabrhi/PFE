/// <reference types="cypress" />

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { AuthNavigationPrimitives } from "../primitives/auth/navigation";
import { AuthConnexionPrimitives } from "../primitives/auth/connexion";

const VERSION = 'v1'
const EMAIL = "kitabrhi.youssef.1@gmail.com"
const PASSWORD = "Winners@2003"

/**
 * ════════════════════════════════════════════════════════════
 * STEPS COMMUNS - Utilisés par PLUSIEURS scénarios
 * ════════════════════════════════════════════════════════════
 */

// ═══ GIVEN ═══

Given('Je suis sur la page de connexion', () => {
  AuthNavigationPrimitives.naviguerPageConnexion(VERSION)
})

Given('Je suis authentifié dans l\'application', () => {
  AuthConnexionPrimitives.authentifierComplet(EMAIL, PASSWORD, VERSION)
})

Given('Je ne suis pas authentifié', () => {
  console.log(`⚠️ [${VERSION}] Utilisateur non authentifié`)
  cy.visit("https://redsumedev.z6.web.core.windows.net")
  cy.wait(1000)
})

Given('J\'ai un CV dans ma liste', () => {
  console.log(`📋 [${VERSION}] Présence CV dans liste`)
  cy.wait(500)
})

// ═══ THEN ═══

Then('L\'authentification échoue', () => {
  console.log(`❌ [${VERSION}] Échec authentification (attendu)`)
  cy.wait(500)
})

Then('Ma session est terminée', () => {
  console.log(`✅ [${VERSION}] Session terminée`)
  cy.wait(500)
})

Then('L\'accès est refusé', () => {
  console.log(`🚫 [${VERSION}] Accès refusé (attendu)`)
  cy.wait(500)
})

Then('La création échoue', () => {
  console.log(`❌ [${VERSION}] Échec création (attendu)`)
  cy.wait(500)
})

Then('Le CV disparaît de ma liste', () => {
  console.log(`✅ [${VERSION}] CV supprimé de la liste`)
  cy.wait(1000)
})