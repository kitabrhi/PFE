/**
 * Primitives utilisées pour manipuler la carte CV.
 * Le même fichier couvre les variantes v1 et v2 à partir des sélecteurs résolus dynamiquement.
 */

import { Version, getSelector, CARTE_CV } from '../../config/carte-cv/selectors-carte-cv.config';

export class CarteCVPrimitives {

  // Navigation entre la liste et le détail.

  /**
   * En v2, s'assure que l'écran détail est prêt.
   * En v1, la liste et le détail partagent la même page.
   */
  static verifierNavigationPageDetail(version: Version): void {
    if (version === 'v2') {
      cy.log('🧭 Attente navigation vers Page 2 (Détail)');
      // On vérifie un élément propre à l'écran détail.
      cy.get(
        `${getSelector(CARTE_CV.PAGE_DETAIL, version)}, ${getSelector(CARTE_CV.BTN_SAUVEGARDER, version)}`,
        { timeout: 10000 }
      ).should('exist');
      cy.log('✅ Page Détail chargée');
    }
  }

  /**
   * Revient à la liste depuis le détail quand l'application est en v2.
   */
  static retourListeCV(version: Version): void {
    if (version === 'v2') {
      cy.log('🧭 Retour vers Page 1 (Mes CV)');
      // On essaie d'abord le bouton retour, puis le lien de navigation.
      cy.get('body').then($body => {
        const btnRetour = getSelector(CARTE_CV.BTN_RETOUR, version);
        if ($body.find(btnRetour).length > 0) {
          cy.get(btnRetour).first().click();
        } else {
          // Repli simple si le bouton retour n'est pas affiché.
          cy.contains('a', 'Mes CV').click({ force: true });
        }
      });
      // On attend le tableau pour confirmer le retour.
      cy.get(getSelector(CARTE_CV.TABLE, version), { timeout: 10000 }).should('be.visible');
      cy.wait(500);
      cy.log('✅ Retour sur Page 1');
    }
  }

  // Sélection de CV.

  /**
   * Sélectionne un CV à partir de son statut puis ouvre son détail si nécessaire.
   */
  static selectionnerCVEtNaviguer(version: Version, statut: string): void {
    cy.log(`🔍 Sélection CV "${statut}" + navigation`);
    const rowSelector = getSelector(CARTE_CV.TABLE_ROW, version);

    cy.get('body').then(($body) => {
      const found = $body.find(rowSelector).filter(`:contains("${statut}")`);

      if (found.length === 0) {
        cy.log(`⚠️ Aucun CV "${statut}" trouvé — sélection du premier CV`);
        cy.get(rowSelector).first().click();
      } else {
        cy.contains(rowSelector, statut).first().click();
      }
    });

    cy.wait(1500);

    // En v2, on confirme bien l'arrivée sur le détail.
    CarteCVPrimitives.verifierNavigationPageDetail(version);
  }

  /**
   * Trouve une ligne CV sans naviguer, puis stocke l'alias `@ligneCVTrouvee`.
   */
  static trouverLigneCV(version: Version, statut: string): void {
    cy.log(`🔍 Recherche ligne CV "${statut}" (sans navigation)`);
    const rowSelector = getSelector(CARTE_CV.TABLE_ROW, version);

    cy.get('body').then(($body) => {
      const found = $body.find(rowSelector).filter(`:contains("${statut}")`);

      if (found.length === 0) {
        cy.log(`⚠️ Aucun CV "${statut}" trouvé — utilisation première ligne`);
        cy.get(rowSelector).first().as('ligneCVTrouvee');
      } else {
        cy.contains(rowSelector, statut).first().as('ligneCVTrouvee');
      }
    });
  }

  // Aides internes.

  /**
   * Ouvre une action, soit directement en v1, soit via le menu du détail en v2.
   */
  private static ouvrirActionPage2(version: Version, selectorBoutonV1: string, labelV2: string): void {
    if (version === 'v1') {
      cy.get(selectorBoutonV1).click({ force: true });
    } else {
      // En v2, toutes ces actions passent par le menu du détail.
      cy.get(getSelector(CARTE_CV.MENU_CONTEXTUEL, version)).click();
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
    cy.get('@ligneCVTrouvee').within(() => {
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

  // Renommage.
  // Le flux passe toujours par le détail pour rester uniforme.

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

  // Duplication.

  /**
   * Duplique un CV.
   * En v2, l'action part de la liste et non de l'écran détail.
   */
  static dupliquerCV(version: Version, nomDuplication?: string): void {
    cy.log('📋 Dupliquer le CV');

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.BTN_DUPLIQUER, version)).click({ force: true });
    } else {
      // En v2, on utilise l'action de la ligne ciblée.
      cy.get('@ligneCVTrouvee').within(() => {
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

  // Vidage.

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

  // Changement de propriétaire.

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

  // Suppression.

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

  // Sauvegarde.

  /**
   * Lance l'enregistrement des modifications.
   */
  static enregistrerCV(version: Version): void {
    cy.log('💾 Enregistrer');

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.BTN_ENREGISTRER, version)).click({ force: true });
    } else {
      // En v2, la sauvegarde se fait depuis l'écran détail.
      cy.get(getSelector(CARTE_CV.BTN_SAUVEGARDER, version)).click();
    }
    cy.wait(2000);

    cy.log('✅ CV enregistré');
  }

  // Changement de statut.

  /**
   * Met à jour le statut du CV actuellement ouvert.
   */
  static changerStatut(version: Version, nouveauStatut: string): void {
    cy.log(`🔄 Changer statut → "${nouveauStatut}"`);

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.SELECT_STATUS, version)).click({ force: true });
      cy.wait(500);
      cy.contains('.mat-mdc-option', nouveauStatut).click({ force: true });
    } else {
      // En v2, le sélecteur vit sur l'écran détail.
      cy.get(getSelector(CARTE_CV.SELECT_STATUS, version)).select(nouveauStatut);
    }
    cy.wait(1000);

    cy.log(`✅ Statut → "${nouveauStatut}"`);
  }

  // Téléchargement.

  /**
   * Télécharge le CV en PDF.
   */
  static telechargerCV(version: Version): void {
    cy.log('📥 Télécharger CV');

    if (version === 'v2') {
      cy.get(getSelector(CARTE_CV.BTN_TELECHARGER, version)).click();
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
      cy.get(getSelector(CARTE_CV.MENU_CONTEXTUEL, version)).click();
      cy.wait(500);
      cy.contains('button', 'Download Json').click();
      cy.wait(1000);
    } else {
      cy.log('⚠️ Download Json non disponible en v1');
    }
  }
}
