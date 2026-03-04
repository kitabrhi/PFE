/// <reference types="cypress" />

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { AuthNavigationPrimitives } from "../primitives/auth/navigation";
import { AuthConnexionPrimitives } from "../primitives/auth/connexion";

const VERSION = 'v1'
const EMAIL: string = Cypress.env('userEmail')
const PASSWORD: string = Cypress.env('userPassword')

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
  cy.url().should('not.include', '/home')
})

Given('J\'ai un CV dans ma liste', () => {
  console.log(`📋 [${VERSION}] Présence CV dans liste`)
  cy.get('.mat-mdc-table, .cv-list', { timeout: 10000 }).should('be.visible')
  cy.get('.mat-mdc-row, .cv-item').should('have.length.greaterThan', 0)
})

// ═══ THEN ═══

Then('L\'authentification échoue', () => {
  cy.url().should('include', 'b2clogin.com')
})

Then('Ma session est terminée', () => {
  cy.url({ timeout: 10000 }).should('include', 'b2clogin.com')
})

Then('L\'accès est refusé', () => {
  cy.url({ timeout: 10000 }).should('include', 'b2clogin.com')
})

Then('La création échoue', () => {
  cy.get('[class*="error"], [class*="alert"], mat-error', { timeout: 5000 }).should('be.visible')
})

Then('Le CV disparaît de ma liste', () => {
  cy.get('.mat-mdc-table').should('be.visible')
})
