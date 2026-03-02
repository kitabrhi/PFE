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
      cy.wait(2000)
      cy.get('mat-icon').contains('keyboard_arrow_down').click({force: true})
      cy.wait(1000)
      cy.contains('Déconnexion').click({force: true})
      cy.wait(3000)
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="user-menu"]').click()
      cy.get('[data-testid="logout-button"]').click()
      cy.wait(2000)
    }
  }
}