/// <reference types="cypress" />

/**
 * Primitives de navigation - CVs
 */
export class CVsNavigationPrimitives {
  
  /**
   * Naviguer vers la liste des CVs
   */
  static naviguerListeCVs(version) {
    console.log(`📋 [${version}] Navigation vers liste CVs`)
    
    if (version === 'v1') {
      cy.contains('Mes CVS', { timeout: 5000 }).click({force: true})
      cy.wait(2000)
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="my-cvs-menu"]').click()
      cy.wait(1500)
    }
  }
}