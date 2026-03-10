/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRIMITIVES - CARTE CV ACTIVE
 * ═══════════════════════════════════════════════════════════════════════════
 * Couche d'abstraction : Actions techniques (COMMENT)
 * Instanciable sur v1 ET v2 via getSelector()
 *
 * v2 gère 2 pages :
 *   - Page 1 (Mes CV)  : Tableau + actions en ligne (Dupliquer, ⋮→Renommer/Vider)
 *   - Page 2 (Détail)   : Fiche CV + actions (⋮→tout, Sauvegarder, Statut)
 *
 * Chaque méthode statique = 1 action atomique
 * Les steps combinent ces actions selon le scénario
 */

import { Version, getSelector, CARTE_CV } from '../../config/selectors-carte-cv.config';

export class CarteCVPrimitives {

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧭 NAVIGATION v2 : Page 1 ↔ Page 2
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * [v2] Vérifier qu'on est bien arrivé sur la page Détail (Page 2)
   * après avoir cliqué sur une ligne du tableau.
   * En v1, cette méthode ne fait rien (tout est sur la même page).
   */
  static verifierNavigationPageDetail(version: Version): void {
    if (version === 'v2') {
      cy.log('🧭 Attente navigation vers Page 2 (Détail)');
      // Attendre un élément spécifique à la page Détail
      // Fallback : le bouton Sauvegarder ou le menu ⋮ du détail
      cy.get(
        `${getSelector(CARTE_CV.PAGE_DETAIL, version)}, ${getSelector(CARTE_CV.BTN_SAUVEGARDER, version)}`,
        { timeout: 10000 }
      ).should('exist');
      cy.log('✅ Page Détail chargée');
    }
  }

  /**
   * [v2] Retourner à la page Liste (Page 1) depuis la page Détail.
   * En v1, cette méthode ne fait rien.
   */
  static retourListeCV(version: Version): void {
    if (version === 'v2') {
      cy.log('🧭 Retour vers Page 1 (Mes CV)');
      // Essayer le bouton retour, sinon le lien "Mes CV" dans la nav
      cy.get('body').then($body => {
        const btnRetour = getSelector(CARTE_CV.BTN_RETOUR, version);
        if ($body.find(btnRetour).length > 0) {
          cy.get(btnRetour).first().click();
        } else {
          // Fallback : clic sur le lien de navigation "Mes CV"
          cy.contains('a', 'Mes CV').click({ force: true });
        }
      });
      // Attendre que le tableau soit visible
      cy.get(getSelector(CARTE_CV.TABLE, version), { timeout: 10000 }).should('be.visible');
      cy.wait(500);
      cy.log('✅ Retour sur Page 1');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔍 SÉLECTION DE CV
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sélectionner un CV par statut et naviguer vers son détail.
   * - v1 : Clic sur la ligne (tout sur la même page)
   * - v2 : Clic sur la ligne → redirection Page 2 (Détail)
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

    // v2 : vérifier qu'on est bien sur la page Détail
    CarteCVPrimitives.verifierNavigationPageDetail(version);
  }

  /**
   * [v2 UNIQUEMENT] Trouver la ligne d'un CV par statut SANS cliquer dessus.
   * Retourne un alias Cypress sur la ligne trouvée pour enchaîner des actions
   * sur les boutons en ligne (Dupliquer, ⋮ de la ligne, etc.)
   *
   * Usage : CarteCVPrimitives.trouverLigneCV(version, statut)
   *         cy.get('@ligneCVTrouvee').within(() => { ... })
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

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS PRIVÉS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Ouvrir une action via bouton direct (v1) ou menu ⋮ Page 2 (v2)
   * Pour les actions disponibles sur la Page 2 du détail en v2 :
   * Renommer, Vider, Changer de propriétaire, Download Json, Supprimer
   */
  private static ouvrirActionPage2(version: Version, selectorBoutonV1: string, labelV2: string): void {
    if (version === 'v1') {
      cy.get(selectorBoutonV1).click({ force: true });
    } else {
      // V2 Page 2 : Menu contextuel ⋮ (du détail) puis option
      cy.get(getSelector(CARTE_CV.MENU_CONTEXTUEL, version)).click();
      cy.wait(500);
      cy.contains('button', labelV2).click();
    }
    cy.wait(500);
  }

  /**
   * [v2 UNIQUEMENT] Ouvrir une action via le menu ⋮ d'une LIGNE du tableau (Page 1)
   * Pour les actions disponibles sur la Page 1 : Renommer, Vider
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
   * Vérifier un message toast/snackbar (hors modale)
   */
  static verifierMessageToast(version: Version, message: string): void {
    cy.log(`🔍 Vérification toast: "${message}"`);
    cy.contains(message, { timeout: 5000 }).should('be.visible');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ✏️ RENOMMER
  // ═══════════════════════════════════════════════════════════════════════════
  // v1 : Bouton direct sur la carte active
  // v2 : Via menu ⋮ Page 2 (après navigation vers détail)
  //       OU via menu ⋮ de la ligne Page 1 (si on reste sur le tableau)
  // → On utilise Page 2 pour cohérence (le flow sélectionne le CV d'abord)

  /**
   * Ouvrir la modale de renommage
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
    cy.log(`✅ Vérification nom: "${nouveauNom}"`);
    cy.contains(nouveauNom).scrollIntoView();
    cy.wait(500);
    cy.contains(nouveauNom).should('be.visible');
    cy.log(`✅ Nom "${nouveauNom}" visible`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 📋 DUPLIQUER
  // ═══════════════════════════════════════════════════════════════════════════
  // v1 : Bouton direct sur la carte active (après sélection du CV)
  // v2 : Icône Dupliquer sur la LIGNE du tableau (Page 1, SANS naviguer)

  /**
   * Dupliquer le CV.
   * ⚠️ En v2, le CV NE doit PAS être sélectionné avant (rester sur Page 1).
   *    L'appelant doit utiliser trouverLigneCV() au lieu de selectionnerCVEtNaviguer().
   */
  static dupliquerCV(version: Version, nomDuplication?: string): void {
    cy.log('📋 Dupliquer le CV');

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.BTN_DUPLIQUER, version)).click({ force: true });
    } else {
      // V2 Page 1 : Clic sur l'icône Dupliquer de la ligne (via alias @ligneCVTrouvee)
      cy.get('@ligneCVTrouvee').within(() => {
        cy.get(getSelector(CARTE_CV.ROW_BTN_DUPLIQUER, version)).click();
      });
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
  // v1 : Bouton direct sur la carte active
  // v2 : Via menu ⋮ Page 2 (après navigation vers détail)

  /**
   * Ouvrir la confirmation de vidage
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
  // v1 : Bouton direct sur la carte active
  // v2 : Via menu ⋮ Page 2 UNIQUEMENT (pas disponible sur Page 1)

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

  // ═══════════════════════════════════════════════════════════════════════════
  // 🗑️ SUPPRIMER
  // ═══════════════════════════════════════════════════════════════════════════
  // v1 : Bouton direct sur la carte active
  // v2 : Via menu ⋮ Page 2 UNIQUEMENT (pas disponible sur Page 1)

  /**
   * Ouvrir la confirmation de suppression
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
  // v1 : Bouton direct sur la carte active
  // v2 : Bouton "Sauvegarder" sur la Page 2 (Détail)

  /**
   * Enregistrer les modifications
   */
  static enregistrerCV(version: Version): void {
    cy.log('💾 Enregistrer');

    if (version === 'v1') {
      cy.get(getSelector(CARTE_CV.BTN_ENREGISTRER, version)).click({ force: true });
    } else {
      // V2 Page 2 : Bouton rouge "Sauvegarder"
      cy.get(getSelector(CARTE_CV.BTN_SAUVEGARDER, version)).click();
    }
    cy.wait(2000);

    cy.log('✅ CV enregistré');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔄 CHANGER STATUT
  // ═══════════════════════════════════════════════════════════════════════════
  // v1 : Select sur la carte active
  // v2 : Dropdown Statut sur la Page 2 (Détail)

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
      // V2 Page 2 : Dropdown Statut
      cy.get(getSelector(CARTE_CV.SELECT_STATUS, version)).select(nouveauStatut);
    }
    cy.wait(1000);

    cy.log(`✅ Statut → "${nouveauStatut}"`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 📥 TÉLÉCHARGER (v2 uniquement — Page 2)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Télécharger le CV en PDF
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
   * Télécharger le JSON (v2 uniquement — Page 2, via menu ⋮)
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