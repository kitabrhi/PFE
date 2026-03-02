/// <reference types="cypress" />

/**
 * Primitives de suppression - CVs
 */
export class CVsSuppressionPrimitives {
  
  /**
   * Supprimer un CV
   */
  static supprimerCV(version) {
    console.log(`🗑️ [${version}] Suppression CV`)
    
    if (version === 'v1') {
      cy.contains('Supprimer').first().click({force: true})
      cy.wait(500)
      
      cy.contains('Confirmer').click({force: true})
        .or('contains', 'Oui')
        .click({force: true})
      
      cy.wait(2000)
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="delete-cv-button"]').first().click()
      cy.get('[data-testid="confirm-delete"]').click()
      cy.wait(1500)
    }
  }
}