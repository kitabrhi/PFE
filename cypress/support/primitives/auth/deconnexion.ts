/// <reference types="cypress" />

/**
 * Primitives de déconnexion
 */
export class AuthDeconnexionPrimitives {
  
  /**
   * Se déconnecter de l'application
   */
  static seDeconnecter(version: string): void {
    console.log(`🚪 [${version}] Déconnexion`)
    
    if (version === 'v1') {
      cy.get('mat-icon').contains('keyboard_arrow_down').should('be.visible').click({force: true})
      cy.contains('Déconnexion').should('be.visible').click({force: true})
      cy.url({ timeout: 10000 }).should('include', 'b2clogin.com')
    }
    else if (version === 'v2') {
      cy.get('[data-testid="user-menu"]').click()
      cy.get('[data-testid="logout-button"]').click()
      cy.url({ timeout: 10000 }).should('include', '/login')
    }
  }
}