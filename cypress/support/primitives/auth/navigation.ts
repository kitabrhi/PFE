/// <reference types="cypress" />

/**
 * Primitives de navigation - Authentification
 */
export class AuthNavigationPrimitives {
  
  /**
   * Naviguer vers la page de connexion
   */
  static naviguerPageConnexion(version) {
    console.log(`🌐 [${version}] Navigation vers page connexion`)
    
    if (version === 'v1') {
      cy.visit("https://redsumedev.z6.web.core.windows.net")
      cy.contains("Sign in with your email address", { timeout: 10000 })
        .should("be.visible")
    } 
    else if (version === 'v2') {
      cy.visit("https://redsume-v2.example.com")
      cy.get('[data-testid="login-page"]').should("be.visible")
    }
    
    cy.wait(2000)
  }
  
  /**
   * Tenter d'accéder à une page protégée sans authentification
   */
  static tenterAccesPageProtegee(version) {
    console.log(`🚫 [${version}] Tentative accès page protégée`)
    
    if (version === 'v1') {
      cy.visit("https://redsumedev.z6.web.core.windows.net/boards/me", {
        failOnStatusCode: false
      })
    } 
    else if (version === 'v2') {
      cy.visit("https://redsume-v2.example.com/dashboard", {
        failOnStatusCode: false
      })
    }
    
    cy.wait(2000)
  }
}