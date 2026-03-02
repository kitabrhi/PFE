/// <reference types="cypress" />

/**
 * Primitives de vérification - CVs
 */
export class CVsVerificationPrimitives {
  
  /**
   * Vérifier liste CVs affichée
   */
  static verifierListeCVsAffichee(version) {
    console.log(`✅ [${version}] Vérification liste CVs affichée`)
    
    if (version === 'v1') {
      cy.contains('Mes CVs', { timeout: 5000 }).should('be.visible')
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="cvs-list"]').should('be.visible')
    }
  }
  
  /**
   * Vérifier infos CVs (nom + date)
   */
  static verifierInfosCVs(version) {
    console.log(`✅ [${version}] Vérification infos CVs`)
    
    if (version === 'v1') {
      cy.get('body').should('contain', 'Nom du CV')
        .or('contain', 'Date')
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="cv-card"]').first().within(() => {
        cy.get('[data-testid="cv-name"]').should('be.visible')
        cy.get('[data-testid="cv-date"]').should('be.visible')
      })
    }
  }
  
  /**
   * Vérifier qu'un CV est dans la liste
   */
  static verifierCVDansListe(nomCV, version) {
    console.log(`✅ [${version}] Vérification CV "${nomCV}" dans liste`)
    
    if (version === 'v1') {
      cy.contains(nomCV, { timeout: 5000 }).should('be.visible')
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="cv-card"]')
        .should('contain', nomCV)
    }
  }
  
  /**
   * Vérifier redirection vers éditeur
   */
  static verifierRedirectionEditeur(version) {
    console.log(`✅ [${version}] Vérification redirection éditeur`)
    
    if (version === 'v1') {
      cy.url().should('include', '/edit')
        .or('contain', 'Profil')
      cy.contains('Profil').should('be.visible')
    } 
    else if (version === 'v2') {
      cy.url().should('include', '/editor')
      cy.get('[data-testid="cv-editor"]').should('be.visible')
    }
  }
  
  /**
   * Vérifier message erreur nom obligatoire
   */
  static verifierErreurNomObligatoire(version) {
    console.log(`❌ [${version}] Vérification erreur nom obligatoire`)
    
    if (version === 'v1') {
      cy.contains('nom est obligatoire', { timeout: 3000 })
        .or('contains', 'Nom requis')
        .should('be.visible')
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="error-message"]')
        .should('contain', 'obligatoire')
    }
  }
  
  /**
   * Vérifier message confirmation suppression
   */
  static verifierConfirmationSuppression(version) {
    console.log(`✅ [${version}] Vérification confirmation suppression`)
    
    if (version === 'v1') {
      cy.contains('supprimé', { timeout: 3000 })
        .or('contains', 'Suppression réussie')
        .should('be.visible')
    } 
    else if (version === 'v2') {
      cy.get('[data-testid="success-message"]')
        .should('contain', 'supprimé')
    }
  }
}