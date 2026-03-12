/**
 * Primitives utilisées pour manipuler la carte CV.
 * Le même fichier couvre les variantes v1 et v2 à partir des sélecteurs résolus dynamiquement.
 *
 * v1 : une seule page — la liste et le détail cohabitent.
 * v2 : deux pages — liste (Page 1) et détail (Page 2).
 */

import { Version, getSelector, CARTE_CV } from '../../config/carte-cv/selectors-carte-cv.config';

export class CarteCVPrimitives {

  // ═══════════════════════════════════════════════════════════════════════
  //  NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * En v2, s'assure que l'écran détail est prêt.
   * En v1, rien à faire — la liste et le détail partagent la même page.
   */
  static verifierNavigationPageDetail(version: Version): void {
    if (version === 'v2') {
      cy.log('🧭 Attente navigation vers Page 2 (Détail)');
      cy.get(
        `${getSelector(CARTE_CV.PAGE_DETAIL, version)}, ${getSelector(CARTE_CV.BTN_SAUVEGARDER, version)}`,
        { timeout: 10000 }
      ).should('exist');
      cy.log('✅ Page Détail chargée');
    }
  }

  /**
   * Revient à la liste depuis le détail.
   * v1 : on scrolle simplement vers le haut de la table.
   * v2 : on clique sur le bouton retour.
   */
  static retourListeCV(version: Version): void {
    if (version === 'v1') {
      // v1 : une seule page — on remonte vers la table.
      cy.log('🧭 Retour vers la table (scroll haut)');
      cy.get(getSelector(CARTE_CV.TABLE, version), { timeout: 10000 })
        .first()
        .scrollIntoView();
      cy.wait(500);
      cy.log('✅ Table visible');
    } else {
      cy.log('🧭 Retour vers Page 1 (Mes CV)');
      cy.get('body').then($body => {
        const btnRetour = getSelector(CARTE_CV.BTN_RETOUR, version);
        if ($body.find(btnRetour).length > 0) {
          cy.get(btnRetour).first().click();
        } else {
          cy.contains('a', 'Mes CV').click({ force: true });
        }
      });
      cy.get(getSelector(CARTE_CV.TABLE, version), { timeout: 10000 })
        .first()
        .scrollIntoView()
        .should('be.visible');
      cy.wait(500);
      cy.log('✅ Retour sur Page 1');
    }
  }

  /**
   * S'assure que la table est visible et accessible.
   * Utile après des actions qui font descendre la page en v1.
   */
  static assurerTableVisible(version: Version): void {
    cy.get(getSelector(CARTE_CV.TABLE, version), { timeout: 10000 })
      .first()
      .scrollIntoView()
      .should('be.visible');
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  SÉLECTION DE CV
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Sélectionne un CV à partir de son statut puis ouvre son détail si nécessaire.
   */
  static selectionnerCVEtNaviguer(version: Version, statut: string): void {
    cy.log(`🔍 Sélection CV "${statut}" + navigation`);

    // D'abord s'assurer que la table est visible.
    CarteCVPrimitives.assurerTableVisible(version);

    const rowSelector = getSelector(CARTE_CV.TABLE_ROW, version);

    cy.get('body').then(($body) => {
      const found = $body.find(rowSelector).filter(`:contains("${statut}")`);

      if (found.length === 0) {
        cy.log(`⚠️ Aucun CV "${statut}" trouvé — sélection du premier CV`);
        cy.get(rowSelector).first().scrollIntoView().click();
      } else {
        cy.contains(rowSelector, statut).first().scrollIntoView().click();
      }
    });

    cy.wait(1500);
    CarteCVPrimitives.verifierNavigationPageDetail(version);
  }

  /**
   * Trouve une ligne CV sans naviguer, puis stocke l'alias `@ligneCVTrouvee`.
   */
  static trouverLigneCV(version: Version, statut: string): void {
    cy.log(`🔍 Recherche ligne CV "${statut}" (sans navigation)`);

    CarteCVPrimitives.assurerTableVisible(version);

    const rowSelector = getSelector(CARTE_CV.TABLE_ROW, version);

    cy.get('body').then(($body) => {
      const found = $body.find(rowSelector).filter(`:contains("${statut}")`);

      if (found.length === 0) {
        cy.log(`⚠️ Aucun CV "${statut}" trouvé — utilisation première ligne`);
        cy.get(rowSelector).first().scrollIntoView().as('ligneCVTrouvee');
      } else {
        cy.contains(rowSelector, statut).first().scrollIntoView().as('ligneCVTrouvee');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  AIDES INTERNES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Ouvre une action, soit directement en v1, soit via le menu du détail en v2.
   */
  private static ouvrirActionPage2(version: Version, selectorBoutonV1: string, labelV2: string): void {
    if (version === 'v1') {
      cy.get(selectorBoutonV1).first().scrollIntoView().click({ force: true });
    } else {
      cy.get(getSelector(CARTE_CV.MENU_CONTEXTUEL, version)).first().scrollIntoView().click();
      cy.wait(500);
      cy.contains('button', labelV2).click();
    }
    cy.wait(500);
  }

  /**
   * En v2, ouvre une action depuis le menu contextuel d'une ligne.
   */
  private static ouvrirActionLignePage1(version: Version, labelV2: string): void {
    if (version !== 'v2') return;

    cy.log(`📂 Ouverture action ligne Page 1 : "${labelV2}"`);
    cy.get('@ligneCVTrouvee').scrollIntoView().within(() => {
      cy.get(getSelector(CARTE_CV.ROW_MENU_CONTEXTUEL, version)).click();
    });
    cy.wait(500);
    cy.contains('button', labelV2).click();
    cy.wait(500);
  }

  /**
   * Vérifie un message toast en dehors d'une modale.
   */
  static verifierMessageToast(version: Version, message: string): void {
    cy.log(`🔍 Vérification toast: "${message}"`);
    cy.contains(message, { timeout: 5000 }).should('be.visible');
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  RENOMMAGE
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Ouvre la modale de renommage.
   */
  static ouvrirModaleRenommer(version: Version): void {
    cy.log('📂 Ouverture modale renommage');
    CarteCVPrimitives.ouvrirActionPage2(
      version,
      getSelector(CARTE_CV.BTN_RENOMMER, version),
      'Renommer'
    );
    cy.get(getSelector(CARTE_CV.MODAL, version), { timeout: 5000 }).should('be.visible');
  }

  /**
   * Remplit le nouveau nom dans la modale.
   */
  static saisirNouveauNom(version: Version, nouveauNom: string): void {
    cy.log(`⌨️ Saisie: "${nouveauNom}"`);
    cy.get(getSelector(CARTE_CV.MODAL_INPUT, version)).clear().type(nouveauNom);
  }

  /**
   * Confirme le renommage.
   */
  static confirmerRenommage(version: Version): void {
    cy.log('✔️ Confirmation renommage');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains('button', 'Valider').click();
    });
    cy.wait(2000);
  }

  /**
   * Annule le renommage.
   */
  static annulerRenommage(version: Version): void {
    cy.log('❌ Annulation renommage');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains('button', 'Annuler').click();
    });
    cy.wait(500);
  }

  /**
   * Vérifie le message d'erreur affiché dans la modale.
   */
  static verifierMessageErreur(version: Version, message: string): void {
    cy.log(`🔍 Vérification erreur: "${message}"`);
    cy.get(getSelector(CARTE_CV.MODAL, version)).should('be.visible');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains(message).should('be.visible');
    });
  }

  /**
   * Vérifie que la modale a bien disparu.
   */
  static verifierModaleFermee(version: Version): void {
    cy.get(getSelector(CARTE_CV.MODAL, version)).should('not.exist');
  }

  /**
   * Vérifie que le nouveau nom est bien rendu à l'écran.
   */
  static verifierNouveauNom(version: Version, nouveauNom: string): void {
    cy.log(`✅ Vérification nom: "${nouveauNom}"`);
    cy.contains(nouveauNom).scrollIntoView();
    cy.wait(500);
    cy.contains(nouveauNom).should('be.visible');
    cy.log(`✅ Nom "${nouveauNom}" visible`);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  DUPLICATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Duplique un CV.
   * En v1 : depuis le détail du CV sélectionné.
   * En v2 : depuis le menu contextuel de la ligne.
   */
  static dupliquerCV(version: Version, nomDuplication?: string): void {
    cy.log('📋 Dupliquer le CV');

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.BTN_DUPLIQUER, version)).first().scrollIntoView().click({ force: true });
    } else {
      cy.get('@ligneCVTrouvee').scrollIntoView().within(() => {
        cy.get(getSelector(CARTE_CV.ROW_BTN_DUPLIQUER, version)).click();
      });
    }
    cy.wait(1000);

    // Certains parcours ouvrent une modale pour nommer la copie.
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

  // ═══════════════════════════════════════════════════════════════════════
  //  VIDAGE
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Ouvre la confirmation de vidage.
   */
  static ouvrirConfirmationVider(version: Version): void {
    cy.log('🧹 Ouverture confirmation vidage');
    CarteCVPrimitives.ouvrirActionPage2(
      version,
      getSelector(CARTE_CV.BTN_VIDER, version),
      'Vider'
    );
  }

  /**
   * Confirme le vidage.
   */
  static confirmerVidage(version: Version): void {
    cy.log('✔️ Confirmation vidage');
    cy.contains('button', 'Vider').click();
    cy.wait(1000);
  }

  /**
   * Vide le CV, ou annule l'action selon le paramètre reçu.
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

  // ═══════════════════════════════════════════════════════════════════════
  //  CHANGEMENT DE PROPRIÉTAIRE
  // ═══════════════════════════════════════════════════════════════════════

  static ouvrirModaleChangerProprietaire(version: Version): void {
    cy.log('👤 Ouverture modale changer propriétaire');
    CarteCVPrimitives.ouvrirActionPage2(
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

  // ═══════════════════════════════════════════════════════════════════════
  //  SUPPRESSION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Ouvre la confirmation de suppression.
   */
  static ouvrirConfirmationSupprimer(version: Version): void {
    cy.log('🗑️ Ouverture confirmation suppression');
    CarteCVPrimitives.ouvrirActionPage2(
      version,
      getSelector(CARTE_CV.BTN_SUPPRIMER, version),
      'Supprimer'
    );
  }

  /**
   * Supprime le CV, ou annule la confirmation selon le cas.
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

  // ═══════════════════════════════════════════════════════════════════════
  //  SAUVEGARDE
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Lance l'enregistrement des modifications.
   */
  static enregistrerCV(version: Version): void {
    cy.log('💾 Enregistrer');

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.BTN_ENREGISTRER, version))
        .first()
        .scrollIntoView()
        .click({ force: true });
    } else {
      cy.get(getSelector(CARTE_CV.BTN_SAUVEGARDER, version))
        .first()
        .scrollIntoView()
        .click();
    }
    cy.wait(2000);

    cy.log('✅ CV enregistré');
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  CHANGEMENT DE STATUT
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Met à jour le statut du CV actuellement ouvert.
   */
  static changerStatut(version: Version, nouveauStatut: string): void {
    cy.log(`🔄 Changer statut → "${nouveauStatut}"`);

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.SELECT_STATUS, version))
        .first()
        .scrollIntoView()
        .click({ force: true });
      cy.wait(500);
      cy.contains('.mat-mdc-option', nouveauStatut).click({ force: true });
    } else {
      cy.get(getSelector(CARTE_CV.SELECT_STATUS, version))
        .first()
        .scrollIntoView()
        .select(nouveauStatut);
    }
    cy.wait(1000);

    cy.log(`✅ Statut → "${nouveauStatut}"`);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  TÉLÉCHARGEMENT
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Télécharge le CV en PDF.
   */
  static telechargerCV(version: Version): void {
    cy.log('📥 Télécharger CV');

    if (version === 'v2') {
      cy.get(getSelector(CARTE_CV.BTN_TELECHARGER, version))
        .first()
        .scrollIntoView()
        .click();
      cy.wait(1000);
    } else {
      cy.log('⚠️ Téléchargement non disponible en v1 depuis cette page');
    }
  }

  /**
   * Télécharge le JSON depuis le menu du détail en v2.
   */
  static downloadJson(version: Version): void {
    cy.log('📄 Download Json');

    if (version === 'v2') {
      cy.get(getSelector(CARTE_CV.MENU_CONTEXTUEL, version))
        .first()
        .scrollIntoView()
        .click();
      cy.wait(500);
      cy.contains('button', 'Download Json').click();
      cy.wait(1000);
    } else {
      cy.log('⚠️ Download Json non disponible en v1');
    }
  }


}