// Primitives pour manipuler la carte CV (v1 et v2).
// v1 : liste et détail sur la même page.
// v2 : liste sur Page 1, détail sur Page 2.

import { Version, getSelector, CARTE_CV } from '../../config/carte-cv/selectors-carte-cv.config';

export class CarteCVPrimitives {

  // Navigation

  // en v2 on attend que la page détail soit prête ; en v1 rien à faire
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

  // v1 : scroll vers la table ; v2 : clic sur le bouton retour
  static retourListeCV(version: Version): void {
    if (version === 'v1') {
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

  static assurerTableVisible(version: Version): void {
    cy.get(getSelector(CARTE_CV.TABLE, version), { timeout: 10000 })
      .first()
      .scrollIntoView()
      .should('be.visible');
  }

  // Préparation de la liste

  // revient sur la liste si on est resté sur le détail, puis vérifie que la table est visible
  static assurerSurPageListe(version: Version): void {
    if (version === 'v2') {
      cy.get('body').then($body => {
        const detailSelector = getSelector(CARTE_CV.PAGE_DETAIL, version);
        const sauvegarderSelector = getSelector(CARTE_CV.BTN_SAUVEGARDER, version);

        if (
          $body.find(detailSelector).length > 0 ||
          $body.find(sauvegarderSelector).length > 0
        ) {
          cy.log('🧭 Détecté sur Page 2 → retour à Page 1');
          CarteCVPrimitives.retourListeCV(version);
        }
      });
    }

    cy.get(getSelector(CARTE_CV.TABLE, version), { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible');

    cy.get(getSelector(CARTE_CV.TABLE_ROW, version), { timeout: 10000 })
      .first()
      .scrollIntoView()
      .should('be.visible');
  }

  // duplique le premier CV jusqu'à atteindre le minimum demandé
  static garantirNbMinCVs(version: Version, nbMin: number): void {
    cy.log(`🚨 Vérification: au moins ${nbMin} CV(s) requis`);

    const rowSelector = getSelector(CARTE_CV.TABLE_ROW, version);

    cy.get(rowSelector, { timeout: 10000 }).then($rows => {
      const nbActuel = $rows.length;
      cy.log(`📊 ${nbActuel} CV(s) trouvé(s)`);

      if (nbActuel < nbMin) {
        const nbACreer = nbMin - nbActuel;
        cy.log(`⚠️ Seulement ${nbActuel} CV(s), ${nbMin} requis → création de ${nbACreer}`);

        for (let i = 0; i < nbACreer; i++) {
          if (version === 'v1') {
            cy.get(rowSelector).first().click();
            cy.wait(1500);
            CarteCVPrimitives.dupliquerCV(version);
            CarteCVPrimitives.retourListeCV(version);
          } else {
            CarteCVPrimitives.trouverLigneCV(version, '');
            CarteCVPrimitives.dupliquerCV(version);
            cy.wait(1000);
          }
        }

        cy.log(`✅ DUPLICATION TERMINÉE: ${nbMin} CV(s) disponibles`);
      } else {
        cy.log(`✅ ${nbActuel} CV(s) trouvé(s) (minimum requis: ${nbMin})`);
      }
    });
  }

  static preparerEtVerifier(version: Version, nbMinCVs: number = 1): void {
    CarteCVPrimitives.assurerSurPageListe(version);
    if (nbMinCVs > 1) {
      CarteCVPrimitives.garantirNbMinCVs(version, nbMinCVs);
    }
  }

  // Sélection de CV

  static selectionnerCVEtNaviguer(version: Version, statut: string): void {
    cy.log(`🔍 Sélection CV "${statut}" + navigation`);

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

  static selectionnerCVParIndex(version: Version, index: number): void {
    cy.log(`🔍 Sélection CV index ${index} + navigation`);

    CarteCVPrimitives.assurerTableVisible(version);

    const rowSelector = getSelector(CARTE_CV.TABLE_ROW, version);
    cy.get(rowSelector).eq(index).scrollIntoView().click();

    cy.wait(1500);
    CarteCVPrimitives.verifierNavigationPageDetail(version);
  }

  // trouve la ligne sans naviguer — si statut vide, prend la première ligne
  static trouverLigneCV(version: Version, statut: string): void {
    cy.log(`🔍 Recherche ligne CV "${statut || '(première ligne)'}" (sans navigation)`);

    CarteCVPrimitives.assurerTableVisible(version);

    const rowSelector = getSelector(CARTE_CV.TABLE_ROW, version);

    if (!statut) {
      cy.get(rowSelector).first().scrollIntoView().as('ligneCVTrouvee');
      return;
    }

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

  // Helpers internes

  // ouvre une action : directement en v1, via le menu du détail en v2
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

  // ouvre une action depuis le menu contextuel d'une ligne (v2 seulement)
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

  static verifierMessageToast(version: Version, message: string): void {
    cy.log(`🔍 Vérification toast: "${message}"`);
    cy.contains(message, { timeout: 5000 }).should('be.visible');
  }

  // Modale — actions génériques

  static annulerActionModale(version: Version): void {
    cy.log('❌ Annulation action modale');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains('button', 'Annuler').click();
    });
    cy.wait(500);
  }

  static verifierModaleFermee(version: Version): void {
    cy.get(getSelector(CARTE_CV.MODAL, version)).should('not.exist');
  }

  static verifierMessageErreur(version: Version, message: string): void {
    cy.log(`🔍 Vérification erreur: "${message}"`);
    cy.get(getSelector(CARTE_CV.MODAL, version)).should('be.visible');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains(message).should('be.visible');
    });
  }

  // Renommage

  static ouvrirModaleRenommer(version: Version): void {
    cy.log('📂 Ouverture modale renommage');
    CarteCVPrimitives.ouvrirActionPage2(
      version,
      getSelector(CARTE_CV.BTN_RENOMMER, version),
      'Renommer'
    );
    cy.get(getSelector(CARTE_CV.MODAL, version), { timeout: 5000 }).should('be.visible');
  }

  static saisirNouveauNom(version: Version, nouveauNom: string): void {
    cy.log(`⌨️ Saisie: "${nouveauNom}"`);
    cy.get(getSelector(CARTE_CV.MODAL_INPUT, version)).clear().type(nouveauNom);
  }

  static confirmerRenommage(version: Version): void {
    cy.log('✔️ Confirmation renommage');
    cy.get(getSelector(CARTE_CV.MODAL, version)).within(() => {
      cy.contains('button', 'Valider').click();
    });
    cy.wait(2000);
  }

  static annulerRenommage(version: Version): void {
    cy.log('❌ Annulation renommage');
    CarteCVPrimitives.annulerActionModale(version);
  }

  static verifierNouveauNom(version: Version, nouveauNom: string): void {
    cy.log(`✅ Vérification nom: "${nouveauNom}"`);
    cy.contains(nouveauNom).scrollIntoView();
    cy.wait(500);
    cy.contains(nouveauNom).should('be.visible');
    cy.log(`✅ Nom "${nouveauNom}" visible`);
  }

  // Duplication

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

  // Vidage

  static ouvrirConfirmationVider(version: Version): void {
    cy.log('🧹 Ouverture confirmation vidage');
    CarteCVPrimitives.ouvrirActionPage2(
      version,
      getSelector(CARTE_CV.BTN_VIDER, version),
      'Vider'
    );
  }

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

  // Changement de propriétaire

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
    CarteCVPrimitives.annulerActionModale(version);
  }

  // Suppression

  static ouvrirConfirmationSupprimer(version: Version): void {
    cy.log('🗑️ Ouverture confirmation suppression');
    CarteCVPrimitives.ouvrirActionPage2(
      version,
      getSelector(CARTE_CV.BTN_SUPPRIMER, version),
      'Supprimer'
    );
  }

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

  // Sauvegarde

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

  // Changement de statut

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

  // Téléchargement

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

  // Vérification du statut

  static verifierStatutVisible(statutAttendu: string): void {
    cy.contains(statutAttendu).should('be.visible');
    cy.log(`✅ Statut: ${statutAttendu}`);
  }
}
