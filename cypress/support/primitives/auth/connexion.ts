/// <reference types="cypress" />

/**
 * Primitives de connexion
 */
export class AuthConnexionPrimitives {
  
  /**
   * Se connecter avec email et mot de passe
   */
  static seConnecter(email, password, version) {
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
      cy.wait(5000)
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="email-input"]')
        .clear()
        .type(email)
      
      cy.get('[data-testid="password-input"]')
        .clear()
        .type(password)
      
      cy.get('[data-testid="login-button"]').click()
      cy.wait(3000)
    }
  }
  
  /**
   * Authentification complète (navigation + connexion)
   */
  static authentifierComplet(email, password, version) {
    const AuthNavigationPrimitives = require('./navigation').AuthNavigationPrimitives
    
    AuthNavigationPrimitives.naviguerPageConnexion(version)
    this.seConnecter(email, password, version)
    cy.wait(2000)
  }
}