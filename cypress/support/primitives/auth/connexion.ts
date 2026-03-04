/// <reference types="cypress" />

import { AuthNavigationPrimitives } from './navigation'

/**
 * Primitives de connexion
 */
export class AuthConnexionPrimitives {

  /**
   * Se connecter avec email et mot de passe
   */
  static seConnecter(email: string, password: string, version: string): void {
    console.log(`🔐 [${version}] Connexion avec ${email}`)
    
    if (version === 'v1') {
      cy.get('input[id=signInName]', { timeout: 10000 })
        .should("be.visible")
        .clear() 
        .type(email)
      
      cy.get('input[id=password]')
        .should('be.visible')
        .clear()
        .type(password)
      
      cy.get('button[id=next]').click()
    }
    else if (version === 'v2') {
      cy.get('[data-testid="email-input"]')
        .clear()
        .type(email)

      cy.get('[data-testid="password-input"]')
        .clear()
        .type(password)

      cy.get('[data-testid="login-button"]').click()
    }
  }

  /**
   * Authentification complète (navigation + connexion)
   */
  static authentifierComplet(email: string, password: string, version: string): void {
    AuthNavigationPrimitives.naviguerPageConnexion(version)
    this.seConnecter(email, password, version)
    cy.url({ timeout: 20000 }).should('not.include', 'b2clogin.com')
  }
}