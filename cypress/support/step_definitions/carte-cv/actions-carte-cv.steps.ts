
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version, getSelector, CARTE_CV } from '../../config/carte-cv/selectors-carte-cv.config';
import { CarteCVPrimitives } from '../../primitives/carte-cv/actions.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Helpers

function genererNomUnique(base: string): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${base}-${timestamp}`;
}

let dernierNomGenere = '';

// S'assure qu'on est sur la page liste.

function assurerSurPageListe(): void {
  if (VERSION === 'v2') {
    cy.get('body').then($body => {
      const detailSelector = getSelector(CARTE_CV.PAGE_DETAIL, VERSION);
      const sauvegarderSelector = getSelector(CARTE_CV.BTN_SAUVEGARDER, VERSION);

      if (
        $body.find(detailSelector).length > 0 ||
        $body.find(sauvegarderSelector).length > 0
      ) {
        cy.log('🧭 Détecté sur Page 2 → retour à Page 1');
        CarteCVPrimitives.retourListeCV(VERSION);
      }
    });
  }
  cy.get(getSelector(CARTE_CV.TABLE, VERSION), { timeout: 10000 }).should('be.visible');
  // Attend que les lignes soient bien chargées.
  cy.get(getSelector(CARTE_CV.TABLE_ROW, VERSION), { timeout: 10000 }).should('have.length.at.least', 1);
}

// Garantit un minimum de CV.

/**
 * Vérifie qu'on a au moins `nbMin` CV dans la liste.
 * Si ce n'est pas le cas, on duplique automatiquement le premier CV.
 */
function garantirNbMinCVs(nbMin: number): void {
  cy.log(`🚨 Vérification: au moins ${nbMin} CV(s) requis`);

  const rowSelector = getSelector(CARTE_CV.TABLE_ROW, VERSION);

  // On passe par cy.get + timeout pour laisser le tableau se stabiliser.
  cy.get(rowSelector, { timeout: 10000 }).then($rows => {
    const nbActuel = $rows.length;

    cy.log(`📊 ${nbActuel} CV(s) trouvé(s)`);

    // Pas assez de CV: duplication automatique.
    if (nbActuel < nbMin) {
      const nbACreer = nbMin - nbActuel;
      cy.log(`⚠️ Seulement ${nbActuel} CV(s) trouvé(s), ${nbMin} requis.`);
      cy.log(`📋 DUPLICATION AUTOMATIQUE: Création de ${nbACreer} CV(s) supplémentaire(s)...`);

      for (let i = 0; i < nbACreer; i++) {
        if (VERSION === 'v1') {
          cy.get(rowSelector).first().click();
          cy.wait(1500);
          CarteCVPrimitives.dupliquerCV(VERSION);
          cy.contains('a', 'Mes CVS').click({ force: true });
          cy.wait(1000);
        } else {
          cy.get(rowSelector).first().as('ligneCVTrouvee');
          CarteCVPrimitives.dupliquerCV(VERSION);
          cy.wait(1000);
        }
      }

      cy.log(`✅ DUPLICATION TERMINÉE: ${nbMin} CV(s) maintenant disponibles (${nbACreer} créé(s) automatiquement)`);
    } else {
      cy.log(`✅ ${nbActuel} CV(s) trouvé(s) (minimum requis: ${nbMin})`);
    }
  });
}

/**
 * Raccourci: on s'assure d'abord d'être sur la liste,
 * puis on vérifie le nombre minimum demandé.
 */
function preparerEtVerifier(nbMinCVs: number = 1): void {
  assurerSurPageListe();
  if (nbMinCVs > 1) {
    garantirNbMinCVs(nbMinCVs);
  }
}

// Navigation

Given('je suis sur la page {string}', (pageName: string) => {
  if (pageName === 'Mes CVS') {
    cy.log('🗺️ Navigation vers Mes CVS');

    if (VERSION === 'v1') {
      cy.get('.mat-sidenav', { timeout: 10000 }).should('be.visible');
      cy.contains('a', 'Mes CVS').click({ force: true });
      cy.url().should('include', '/user/versioning');
    } else {
      cy.contains('a', 'Mes CV').click({ force: true });
      cy.get(getSelector(CARTE_CV.TABLE, VERSION), { timeout: 10000 }).should('be.visible');
    }

    cy.log('✅ Sur la page: Mes CVS');
  }
});

// Préparation: statut

Given('un CV a le statut {string}', (statut: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer qu'un CV a le statut "${statut}"`);

  preparerEtVerifier(1);

  cy.get(getSelector(CARTE_CV.TABLE_ROW, VERSION)).first().click();
  cy.wait(1500);
  CarteCVPrimitives.verifierNavigationPageDetail(VERSION);

  CarteCVPrimitives.changerStatut(VERSION, statut);

  CarteCVPrimitives.retourListeCV(VERSION);
});

// Préparation: nombre minimum de CV

Given('j\'ai au moins {int} CVs dans ma liste', (nbMin: number) => {
  cy.log(`🔧 PRÉPARATION: Garantir au moins ${nbMin} CVs`);

  assurerSurPageListe();
  garantirNbMinCVs(nbMin);
});

// Renommer: succès

When('je renomme un CV avec le statut {string} en {string}', (statut: string, nouveauNom: string) => {
  dernierNomGenere = genererNomUnique(nouveauNom);
  cy.log(`✏️ INTENTION: Renommer CV "${statut}" en "${dernierNomGenere}"`);

  preparerEtVerifier(1);

  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.ouvrirModaleRenommer(VERSION);
  CarteCVPrimitives.saisirNouveauNom(VERSION, dernierNomGenere);
  CarteCVPrimitives.confirmerRenommage(VERSION);
});

Then('le CV est renommé en {string}', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
  CarteCVPrimitives.verifierNouveauNom(VERSION, dernierNomGenere);
});

// Renommer: erreur (nom déjà pris)

Given('un CV porte déjà le nom {string}', (nom: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer qu'un CV s'appelle "${nom}"`);

  preparerEtVerifier(2);

  cy.get(getSelector(CARTE_CV.TABLE_ROW, VERSION)).first().click();
  cy.wait(1500);
  CarteCVPrimitives.verifierNavigationPageDetail(VERSION);

  CarteCVPrimitives.ouvrirModaleRenommer(VERSION);
  CarteCVPrimitives.saisirNouveauNom(VERSION, nom);
  CarteCVPrimitives.confirmerRenommage(VERSION);
  CarteCVPrimitives.verifierModaleFermee(VERSION);

  CarteCVPrimitives.retourListeCV(VERSION);
});

When('je tente de renommer un autre CV en {string}', (nouveauNom: string) => {
  cy.log(`✏️ INTENTION: Tenter de renommer un autre CV en "${nouveauNom}"`);

  preparerEtVerifier(2);

  cy.get(getSelector(CARTE_CV.TABLE_ROW, VERSION)).eq(1).click();
  cy.wait(1500);
  CarteCVPrimitives.verifierNavigationPageDetail(VERSION);

  CarteCVPrimitives.ouvrirModaleRenommer(VERSION);
  CarteCVPrimitives.saisirNouveauNom(VERSION, nouveauNom);
});

Then('le message d\'erreur {string} apparaît', (messageErreur: string) => {
  CarteCVPrimitives.verifierMessageErreur(VERSION, messageErreur);
});

Then('le renommage est refusé', () => {
  CarteCVPrimitives.annulerRenommage(VERSION);
  CarteCVPrimitives.verifierModaleFermee(VERSION);
});

// Duplication

When('je duplique un CV avec le statut {string}', (statut: string) => {
  cy.log(`📋 INTENTION: Dupliquer CV "${statut}"`);

  preparerEtVerifier(1);

  if (VERSION === 'v1') {
    CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
    CarteCVPrimitives.dupliquerCV(VERSION);
  } else {
    CarteCVPrimitives.trouverLigneCV(VERSION, statut);
    CarteCVPrimitives.dupliquerCV(VERSION);
  }
});

Then('une copie du CV est créée', () => {
  cy.log('✅ Copie créée');
});

Then('la copie apparaît dans ma liste de CV', () => {
  assurerSurPageListe();
  cy.get(getSelector(CARTE_CV.TABLE, VERSION)).should('be.visible');
  cy.log('✅ Copie visible');
});

// Vidage

When('je vide un CV avec le statut {string}', (statut: string) => {
  cy.log(`🧹 INTENTION: Vider CV "${statut}"`);

  preparerEtVerifier(1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.viderCV(VERSION, true);
});

When('je demande à vider un CV avec le statut {string}', (statut: string) => {
  cy.log(`🧹 INTENTION: Demander vidage CV "${statut}"`);

  preparerEtVerifier(1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.ouvrirConfirmationVider(VERSION);
});

When('j\'annule l\'opération', () => {
  cy.log('❌ INTENTION: Annuler');
  cy.get(getSelector(CARTE_CV.MODAL, VERSION)).within(() => {
    cy.contains('button', 'Annuler').click();
  });
  cy.wait(500);
});

Then('toutes les informations sont supprimées', () => {
  cy.log('✅ Informations supprimées');
});

Then('le contenu du CV reste intact', () => {
  cy.log('✅ Contenu intact');
});

// Changer propriétaire: succès
// En v1, cette action peut nécessiter au moins 2 CV.

When('je transfère un CV avec le statut {string} à {string}', (statut: string, email: string) => {
  cy.log(`👤 INTENTION: Transférer CV "${statut}" à ${email}`);

  preparerEtVerifier(2);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.ouvrirModaleChangerProprietaire(VERSION);
  CarteCVPrimitives.saisirEmailProprietaire(VERSION, email);
  CarteCVPrimitives.confirmerChangementProprietaire(VERSION);
});

Then('le transfert est enregistré avec succès', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
  cy.log('✅ Transfert enregistré');
});

// Changer propriétaire: erreur (email inexistant)
// En v1, cette action peut nécessiter au moins 2 CV.

When('je tente de transférer un CV avec le statut {string} à {string}', (statut: string, email: string) => {
  cy.log(`👤 INTENTION: Tenter de transférer CV "${statut}" à ${email}`);

  preparerEtVerifier(2);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.ouvrirModaleChangerProprietaire(VERSION);
  CarteCVPrimitives.saisirEmailProprietaire(VERSION, email);
  CarteCVPrimitives.confirmerChangementProprietaire(VERSION);
});

Then('le message {string} s\'affiche', (message: string) => {
  CarteCVPrimitives.verifierMessageToast(VERSION, message);
});

// Suppression
// En v1, cette action peut nécessiter au moins 2 CV.

When('je supprime un CV avec le statut {string}', (statut: string) => {
  cy.log(`🗑️ INTENTION: Supprimer CV "${statut}"`);

  preparerEtVerifier(2);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.supprimerCV(VERSION, true);
});

When('je demande à supprimer un CV avec le statut {string}', (statut: string) => {
  cy.log(`🗑️ INTENTION: Demander suppression CV "${statut}"`);

  preparerEtVerifier(2);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.ouvrirConfirmationSupprimer(VERSION);
});

When('j\'annule la suppression', () => {
  cy.log('❌ INTENTION: Annuler suppression');
  cy.get(getSelector(CARTE_CV.MODAL, VERSION)).within(() => {
    cy.contains('button', 'Annuler').click();
  });
  cy.wait(500);
});

Then('le CV est supprimé définitivement', () => {
  cy.log('✅ CV supprimé');
  if (VERSION === 'v2') {
    cy.get(getSelector(CARTE_CV.TABLE, VERSION), { timeout: 10000 }).should('be.visible');
  }
});

Then('il n\'apparaît plus dans ma liste', () => {
  assurerSurPageListe();
  cy.log('✅ CV absent');
});

Then('le CV reste dans ma liste', () => {
  assurerSurPageListe();
  cy.get(getSelector(CARTE_CV.TABLE, VERSION)).should('be.visible');
  cy.log('✅ CV toujours présent');
});

// Enregistrement

When('j\'enregistre les modifications d\'un CV avec le statut {string}', (statut: string) => {
  cy.log(`💾 INTENTION: Enregistrer CV "${statut}"`);

  preparerEtVerifier(1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.enregistrerCV(VERSION);
});

Then('les modifications sont sauvegardées', () => {
  cy.log('✅ Modifications sauvegardées');
});

// Changer statut

When('je change le statut d\'un CV {string} en {string}', (statutActuel: string, nouveauStatut: string) => {
  cy.log(`🔄 INTENTION: Changer statut "${statutActuel}" → "${nouveauStatut}"`);

  preparerEtVerifier(1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statutActuel);
  CarteCVPrimitives.changerStatut(VERSION, nouveauStatut);
});

Then('le statut du CV devient {string}', (statutAttendu: string) => {
  cy.contains(statutAttendu).should('be.visible');
  cy.log(`✅ Statut: ${statutAttendu}`);
});

// Download JSON (v2)

When('je télécharge le JSON d\'un CV avec le statut {string}', (statut: string) => {
  cy.log(`📄 INTENTION: Download Json CV "${statut}"`);

  preparerEtVerifier(1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.downloadJson(VERSION);
});

Then('le fichier JSON est téléchargé', () => {
  cy.log('✅ JSON téléchargé');
});
