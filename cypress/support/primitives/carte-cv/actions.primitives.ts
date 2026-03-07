/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRIMITIVES - CARTE CV ACTIVE
 * ═══════════════════════════════════════════════════════════════════════════
 * Couche d'abstraction : Actions techniques (COMMENT)
 * Instanciable sur v1 ET v2 via getSelector()
 * 
 * Chaque méthode statique = 1 action atomique
 * Les steps combinent ces actions selon le scénario
 */

import { Version, getSelector, CARTE_CV } from '../../config/selectors-carte-cv.config';

export class CarteCVPrimitives {

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER PRIVÉ : Ouvrir action via menu ⋮ (v2) ou bouton direct (v1)
  // ═══════════════════════════════════════════════════════════════════════════

  private static ouvrirAction(version: Version, selectorBouton: string, labelV2: string): void {
    if (version === 'v1') {
      cy.get(selectorBouton).click({ force: true });
    } else {
      // V2 : Menu contextuel ⋮ puis option
      cy.get(getSelector(CARTE_CV.MENU_CONTEXTUEL, version)).click();
      cy.wait(500);
      cy.contains('button', labelV2).click();
    }
    cy.wait(500);
  }


  /**
   * Vérifier un message toast/snackbar (hors modale)
   */
  static verifierMessageToast(version: Version, message: string): void {
    cy.log(`🔍 Vérification toast: "${message}"`);
    cy.contains(message, { timeout: 5000 }).should('be.visible');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ✏️ RENOMMER
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Ouvrir la modale de renommage
   */
  static ouvrirModaleRenommer(version: Version): void {
    cy.log('📂 Ouverture modale renommage');
    CarteCVPrimitives.ouvrirAction(
      version,
      getSelector(CARTE_CV.BTN_RENOMMER, version),
      'Renommer'
    );
    cy.get(getSelector(CARTE_CV.MODAL, version), { timeout: 5000 }).should('be.visible');
  }

  /**
   * Saisir le nouveau nom dans la modale
   */
  static saisirNouveauNom(version: Version, nouveauNom: string): void {
    cy.log(`⌨️ Saisie: "${nouveauNom}"`);
    cy.get(getSelector(CARTE_CV.MODAL_INPUT, version)).clear().type(nouveauNom);
  }

  /**
   * Confirmer le renommage (clic Valider)
   */
  static confirmerRenommage(version: Version): void {
    cy.log('✔️ Confirmation renommage');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains('button', 'Valider').click();
    });
    cy.wait(2000);
  }

  /**
   * Annuler le renommage (clic Annuler)
   */
  static annulerRenommage(version: Version): void {
    cy.log('❌ Annulation renommage');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains('button', 'Annuler').click();
    });
    cy.wait(500);
  }

  /**
   * Vérifier message d'erreur dans la modale
   */
  static verifierMessageErreur(version: Version, message: string): void {
    cy.log(`🔍 Vérification erreur: "${message}"`);
    cy.get(getSelector(CARTE_CV.MODAL, version)).should('be.visible');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains(message).should('be.visible');
    });
  }

  /**
   * Vérifier que la modale est fermée
   */
  static verifierModaleFermee(version: Version): void {
    cy.get(getSelector(CARTE_CV.MODAL, version)).should('not.exist');
  }

  /**
   * Vérifier que le nouveau nom apparaît
   */
  static verifierNouveauNom(version: Version, nouveauNom: string): void {
    cy.contains(nouveauNom).should('be.visible');
    cy.log(`✅ Nom "${nouveauNom}" visible`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 📋 DUPLIQUER
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Dupliquer le CV actif
   */
  static dupliquerCV(version: Version, nomDuplication?: string): void {
    cy.log('📋 Dupliquer le CV');

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.BTN_DUPLIQUER, version)).click({ force: true });
    } else {
      // V2 : Icône copie sur la ligne du tableau (Page 1)
      cy.get('tr').last().find('button[aria-label]').eq(1).click();
    }
    cy.wait(1000);

    // Si modale de nom apparaît
    if (nomDuplication) {
      cy.get('body').then($body => {
        if ($body.find(getSelector(CARTE_CV.MODAL, version)).length > 0) {
          cy.get(getSelector(CARTE_CV.MODAL_INPUT, version)).clear().type(nomDuplication);
          cy.contains('button', 'Confirmer').click();
          cy.wait(1000);
        }
      });
    }

    cy.log('✅ CV dupliqué');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧹 VIDER
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Ouvrir la confirmation de vidage
   */
  static ouvrirConfirmationVider(version: Version): void {
    cy.log('🧹 Ouverture confirmation vidage');
    CarteCVPrimitives.ouvrirAction(
      version,
      getSelector(CARTE_CV.BTN_VIDER, version),
      'Vider'
    );
  }

  /**
   * Confirmer le vidage
   */
  static confirmerVidage(version: Version): void {
    cy.log('✔️ Confirmation vidage');
    cy.contains('button', 'Vider').click();
    cy.wait(1000);
  }

  /**
   * Vider le CV (ouverture + confirmation en une seule action)
   */
  static viderCV(version: Version, confirmer: boolean = true): void {
    cy.log('🧹 Vider le CV');
    CarteCVPrimitives.ouvrirConfirmationVider(version);

    if (confirmer) {
      cy.contains('button', 'Vider').click();
    } else {
      cy.contains('button', 'Annuler').click();
    }
    cy.wait(1000);

    cy.log(`✅ ${confirmer ? 'CV vidé' : 'Vidage annulé'}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 👤 CHANGER PROPRIÉTAIRE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Changer le propriétaire du CV
   */
 // ═══════════════════════════════════════════════════════════════════════════
  // 👤 CHANGER PROPRIÉTAIRE
  // ═══════════════════════════════════════════════════════════════════════════

  static ouvrirModaleChangerProprietaire(version: Version): void {
    cy.log('👤 Ouverture modale changer propriétaire');
    CarteCVPrimitives.ouvrirAction(
      version,
      getSelector(CARTE_CV.BTN_CHANGER_PROPRIETAIRE, version),
      'Changer de propriétaire'
    );
    cy.get(getSelector(CARTE_CV.MODAL, version), { timeout: 5000 }).should('be.visible');
  }

  static saisirEmailProprietaire(version: Version, email: string): void {
    cy.log(`📧 Saisie email: ${email}`);
    cy.get(getSelector(CARTE_CV.MODAL_INPUT, version)).clear().type(email);
  }

  static confirmerChangementProprietaire(version: Version): void {
    cy.log('✔️ Confirmation changement propriétaire');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains('button', 'Valider').click();
    });
    cy.wait(2000);
  }

  static annulerChangementProprietaire(version: Version): void {
    cy.log('❌ Annulation changement propriétaire');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains('button', 'Annuler').click();
    });
    cy.wait(500);
  }
  // ═══════════════════════════════════════════════════════════════════════════
  // 🗑️ SUPPRIMER
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Ouvrir la confirmation de suppression
   */
  static ouvrirConfirmationSupprimer(version: Version): void {
    cy.log('🗑️ Ouverture confirmation suppression');
    CarteCVPrimitives.ouvrirAction(
      version,
      getSelector(CARTE_CV.BTN_SUPPRIMER, version),
      'Supprimer'
    );
  }

  /**
   * Supprimer le CV (ouverture + confirmation)
   */
  static supprimerCV(version: Version, confirmer: boolean = true): void {
    cy.log('🗑️ Supprimer le CV');
    CarteCVPrimitives.ouvrirConfirmationSupprimer(version);

    if (confirmer) {
      cy.contains('button', 'Supprimer').click();
    } else {
      cy.contains('button', 'Annuler').click();
    }
    cy.wait(1000);

    cy.log(`✅ ${confirmer ? 'CV supprimé' : 'Suppression annulée'}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 💾 ENREGISTRER / SAUVEGARDER
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Enregistrer les modifications
   */
  static enregistrerCV(version: Version): void {
    cy.log('💾 Enregistrer');

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.BTN_ENREGISTRER, version)).click({ force: true });
    } else {
      // V2 : Bouton rouge "Sauvegarder"
      cy.contains('button', 'Sauvegarder').click();
    }
    cy.wait(2000);

    cy.log('✅ CV enregistré');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔄 CHANGER STATUT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Changer le statut du CV actif
   */
  static changerStatut(version: Version, nouveauStatut: string): void {
    cy.log(`🔄 Changer statut → "${nouveauStatut}"`);

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.SELECT_STATUS, version)).click({ force: true });
      cy.wait(500);
      cy.contains('.mat-mdc-option', nouveauStatut).click({ force: true });
    } else {
      // V2 : Dropdown sur Page 2
      cy.get(getSelector(CARTE_CV.SELECT_STATUS, version)).select(nouveauStatut);
    }
    cy.wait(1000);

    cy.log(`✅ Statut → "${nouveauStatut}"`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 📥 TÉLÉCHARGER (v2 uniquement)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Télécharger le CV en PDF
   */
  static telechargerCV(version: Version): void {
    cy.log('📥 Télécharger CV');

    if (version === 'v2') {
      cy.contains('button', 'Télécharger le CV').click();
      cy.wait(1000);
    } else {
      cy.log('⚠️ Téléchargement non disponible en v1 depuis cette page');
    }
  }

  /**
   * Télécharger le JSON (v2 uniquement)
   */
  static downloadJson(version: Version): void {
    cy.log('📄 Download Json');

    if (version === 'v2') {
      cy.get(getSelector(CARTE_CV.MENU_CONTEXTUEL, version)).click();
      cy.wait(500);
      cy.contains('button', 'Download Json').click();
      cy.wait(1000);
    } else {
      cy.log('⚠️ Download Json non disponible en v1');
    }
  }
}