/// <reference types="cypress" />

/**
 * Primitives de vérification - Authentification
 */
export class AuthVerificationPrimitives {
  
  /**
   * Vérifier authentification réussie
   */
  static verifierAuthentificationReussie(version) {
    console.log(`✅ [${version}] Vérification authentification réussie`)
    
    if (version === 'v1') {
      cy.contains('ReDsume', { timeout: 10000 }).should("be.visible")
      cy.url().should('not.include', 'b2clogin.com')
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="dashboard"]', { timeout: 10000 })
        .should("be.visible")
    }
  }
  
  /**
   * Vérifier espace personnel visible
   */
  static verifierEspacePersonnel(version) {
    console.log(`✅ [${version}] Vérification espace personnel`)
    
    if (version === 'v1') {
      cy.contains('Mon Dashboard').should('be.visible')
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="personal-space"]').should('be.visible')
    }
  }
  
  /**
   * Vérifier message erreur identifiants invalides
   */
  static verifierErreurIdentifiants(version) {
    console.log(`❌ [${version}] Vérification erreur identifiants`)
    
    if (version === 'v1') {
      cy.contains("Your password is incorrect", { timeout: 5000 })
        .should('be.visible')
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="error-message"]')
        .should('contain', 'incorrect')
    }
  }
  
  /**
   * Vérifier message compte inexistant
   */
  static verifierErreurCompteInexistant(version) {
    console.log(`❌ [${version}] Vérification erreur compte inexistant`)
    
    if (version === 'v1') {
      cy.contains("We can't seem to find your account", { timeout: 5000 })
        .should('be.visible')
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="error-message"]')
        .should('contain', 'account')
    }
  }
  
  /**
   * Vérifier reste sur page connexion
   */
  static verifierResteSurPageConnexion(version) {
    console.log(`❌ [${version}] Vérification reste sur page connexion`)
    
    if (version === 'v1') {
      cy.url().should('include', 'b2clogin.com')
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="login-page"]').should('be.visible')
    }
  }
  
  /**
   * Vérifier redirection vers page connexion
   */
  static verifierRedirectionPageConnexion(version) {
    console.log(`➡️ [${version}] Vérification redirection page connexion`)
    
    if (version === 'v1') {
      cy.url({ timeout: 10000 }).should('include', 'b2clogin.com')
    } 
    else if (version === 'v2') {
      cy.url().should('include', '/login')
    }
  }
}