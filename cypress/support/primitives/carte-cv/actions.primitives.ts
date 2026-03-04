import { Version } from '../../config/selectors-carte-cv.config';

export class CarteCVPrimitives {

  /**
   * ✏️ Renommer le CV (v1 et v2 - Page 1 ET Page 2)
   */
  static renommerCV(version: Version, nouveauNom: string, page: 'liste' | 'edition' = 'liste'): void {
    cy.log(`✏️ Renommer en "${nouveauNom}" (${page})`);

    if (version === 'v1') {
      cy.get('button[title="Renommer"]').click({ force: true });
    } else {
      cy.get('button[aria-label="Actions"]').click();
      cy.contains('button', 'Renommer').should('be.visible').click();
    }

    cy.get('.mat-mdc-dialog-container').should('be.visible');
    cy.get('input').filter(':visible').clear().type(nouveauNom);
    cy.contains('button', 'Confirmer').click();
    cy.get('.mat-mdc-dialog-container').should('not.exist');

    cy.log(`✅ CV renommé`);
  }

  /**
   * 🧹 Vider le CV (v1 et v2 - Page 1 ET Page 2)
   */
  static viderCV(version: Version, confirmer: boolean = true): void {
    cy.log(`🧹 Vider le CV`);

    if (version === 'v1') {
      cy.get('button[title="Vider"]').click({ force: true });
    } else {
      cy.get('button[aria-label="Actions"]').click();
      cy.contains('button', 'Vider').should('be.visible').click();
    }

    cy.get('.mat-mdc-dialog-container').should('be.visible');

    if (confirmer) {
      cy.contains('button', 'Confirmer').click();
    } else {
      cy.contains('button', 'Annuler').click();
    }
    cy.get('.mat-mdc-dialog-container').should('not.exist');

    cy.log(`✅ ${confirmer ? 'CV vidé' : 'Vidage annulé'}`);
  }

  /**
   * 📋 Dupliquer le CV (v1 et v2 - Page 1 UNIQUEMENT pour v2)
   */
  static dupliquerCV(version: Version, nomDuplication?: string): void {
    cy.log(`📋 Dupliquer`);

    if (version === 'v1') {
      cy.get('button[title="Dupliquer"]').click({ force: true });
    } else {
      cy.get('tr').last().find('button[aria-label]').eq(1).click();
    }

    if (nomDuplication) {
      cy.get('body').then($body => {
        if ($body.find('.mat-mdc-dialog-container').length > 0) {
          cy.get('.mat-mdc-dialog-container input').clear().type(nomDuplication);
          cy.contains('button', 'Confirmer').click();
          cy.get('.mat-mdc-dialog-container').should('not.exist');
        }
      });
    }

    cy.get('.mat-mdc-table').should('be.visible');
    cy.log(`✅ CV dupliqué`);
  }

  /**
   * 👤 Changer propriétaire (v1 Page 1 / v2 Page 2)
   */
  static changerProprietaire(version: Version, email: string): void {
    cy.log(`👤 Changer propriétaire: ${email}`);

    if (version === 'v1') {
      cy.get('button[title="Changer propriétaire"]').click({ force: true });
    } else {
      cy.get('button[aria-label="Actions"]').click();
      cy.contains('button', 'Changer de propriétaire').should('be.visible').click();
    }

    cy.get('.mat-mdc-dialog-container').should('be.visible');
    cy.get('input').filter(':visible').clear().type(email);
    cy.contains('button', 'Confirmer').click();
    cy.get('.mat-mdc-dialog-container').should('not.exist');

    cy.log(`✅ Propriétaire changé`);
  }

  /**
   * 🗑️ Supprimer le CV (v1 Page 1 / v2 Page 2)
   */
  static supprimerCV(version: Version, confirmer: boolean = true): void {
    cy.log(`🗑️ Supprimer le CV`);

    if (version === 'v1') {
      cy.get('button[title="Supprimer"]').click({ force: true });
    } else {
      cy.get('button[aria-label="Actions"]').click();
      cy.contains('button', 'Supprimer').should('be.visible').click();
    }

    cy.get('.mat-mdc-dialog-container').should('be.visible');

    if (confirmer) {
      cy.contains('button', 'Confirmer').click();
    } else {
      cy.contains('button', 'Annuler').click();
    }
    cy.get('.mat-mdc-dialog-container').should('not.exist');

    cy.log(`✅ ${confirmer ? 'CV supprimé' : 'Suppression annulée'}`);
  }

  /**
   * 💾 Enregistrer/Sauvegarder le CV (v1 Page 1 / v2 Page 2)
   */
  static enregistrerCV(version: Version): void {
    cy.log(`💾 Enregistrer`);

    if (version === 'v1') {
      cy.get('button[title="Enregistrer"]').click({ force: true });
    } else {
      cy.contains('button', 'Sauvegarder').click();
    }

    cy.get('.mat-mdc-table').should('be.visible');
    cy.log(`✅ CV enregistré`);
  }

  /**
   * 📥 Télécharger le CV PDF (v2 Page 2 UNIQUEMENT)
   */
  static telechargerCV(version: Version): void {
    cy.log(`📥 Télécharger CV`);

    if (version === 'v2') {
      cy.contains('button', 'Télécharger le CV').click();
      cy.log(`✅ CV téléchargé`);
    } else {
      cy.log(`⚠️ Télécharger non disponible en v1`);
    }
  }

  /**
   * 📄 Download Json (v2 Page 2 UNIQUEMENT)
   */
  static downloadJson(version: Version): void {
    cy.log(`📄 Download Json`);

    if (version === 'v2') {
      cy.get('button[aria-label="Actions"]').click();
      cy.contains('button', 'Download Json').should('be.visible').click();
      cy.log(`✅ Json téléchargé`);
    } else {
      cy.log(`⚠️ Download Json non disponible en v1`);
    }
  }

  /**
   * 🔄 Changer le statut (v1 et v2 - Page 2 uniquement en v2)
   */
  static changerStatut(version: Version, nouveauStatut: string): void {
    cy.log(`🔄 Changer statut: ${nouveauStatut}`);

    if (version === 'v1') {
      cy.get('.mat-mdc-form-field mat-select').click({ force: true });
      cy.get('.mat-mdc-option').should('be.visible');
      cy.contains('.mat-mdc-option', nouveauStatut).click({ force: true });
      cy.get('.mat-mdc-option').should('not.exist');
    } else {
      cy.get('select').first().select(nouveauStatut);
    }

    cy.log(`✅ Statut: ${nouveauStatut}`);
  }
}
