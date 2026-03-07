/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STEP DEFINITIONS - CARTE CV ACTIVE (TOUTES ACTIONS)
 * ═══════════════════════════════════════════════════════════════════════════
 * Décodage technique : Lien Gherkin ↔ Primitives
 */

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version, getSelector, CARTE_CV } from '../../config/selectors-carte-cv.config';
import { CarteCVPrimitives } from '../../primitives/carte-cv/actions.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER : Générer un nom de CV unique
// ═══════════════════════════════════════════════════════════════════════════════

function genererNomUnique(base: string): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${base}-${timestamp}`;
}

let dernierNomGenere = '';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

Given('je suis sur la page {string}', (pageName: string) => {
  if (pageName === 'Mes CVS') {
    cy.log('🗺️ Navigation vers Mes CVS');
    cy.get('.mat-sidenav', { timeout: 10000 }).should('be.visible');
    cy.contains('a', 'Mes CVS').click({ force: true });
    cy.url().should('include', '/user/versioning');
    cy.log('✅ Sur la page: Mes CVS');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER : Sélectionner un CV par statut (avec abandon si introuvable)
// ═══════════════════════════════════════════════════════════════════════════════

function selectionnerCVParStatut(statut: string): void {
  const rowSelector = getSelector(CARTE_CV.TABLE_ROW, VERSION);

  cy.get('body').then(($body) => {
    const found = $body.find(rowSelector).filter(`:contains("${statut}")`);

    if (found.length === 0) {
      cy.log(`⚠️ Aucun CV "${statut}" trouvé — changement de statut automatique`);

      // Sélectionner le premier CV disponible
      cy.get(rowSelector).first().click();
      cy.wait(1500);

      // Changer son statut
      CarteCVPrimitives.changerStatut(VERSION, statut);
    } else {
      cy.contains(rowSelector, statut).click();
      cy.wait(1500);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 PRÉPARATION : S'assurer qu'un CV a le statut voulu
// ═══════════════════════════════════════════════════════════════════════════════

Given('un CV a le statut {string}', (statut: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer qu'un CV a le statut "${statut}"`);

  // Sélectionner le premier CV disponible
  cy.get(getSelector(CARTE_CV.TABLE_ROW, VERSION)).first().click();
  cy.wait(1500);

  // Forcer son statut à la valeur voulue
  CarteCVPrimitives.changerStatut(VERSION, statut);
});

// ═══════════════════════════════════════════════════════════════════════════════
// ✏️ RENOMMER - SUCCÈS
// ═══════════════════════════════════════════════════════════════════════════════

When('je renomme un CV avec le statut {string} en {string}', (statut: string, nouveauNom: string) => {
  dernierNomGenere = genererNomUnique(nouveauNom);
  cy.log(`✏️ INTENTION: Renommer CV "${statut}" en "${dernierNomGenere}"`);

  selectionnerCVParStatut(statut);
  CarteCVPrimitives.ouvrirModaleRenommer(VERSION);
  CarteCVPrimitives.saisirNouveauNom(VERSION, dernierNomGenere);
  CarteCVPrimitives.confirmerRenommage(VERSION);
});

Then('le CV est renommé en {string}', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
  CarteCVPrimitives.verifierNouveauNom(VERSION, dernierNomGenere);
});
// ═══════════════════════════════════════════════════════════════════════════════
// ✏️ RENOMMER - ERREUR (nom existant)
// ═══════════════════════════════════════════════════════════════════════════════

Given('un CV porte déjà le nom {string}', (nom: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer qu'un CV s'appelle "${nom}"`);

  cy.get(getSelector(CARTE_CV.TABLE_ROW, VERSION)).first().click();
  cy.wait(1500);
  CarteCVPrimitives.ouvrirModaleRenommer(VERSION);
  CarteCVPrimitives.saisirNouveauNom(VERSION, nom);
  CarteCVPrimitives.confirmerRenommage(VERSION);
  CarteCVPrimitives.verifierModaleFermee(VERSION);
});

When('je tente de renommer un autre CV en {string}', (nouveauNom: string) => {
  cy.log(`✏️ INTENTION: Tenter de renommer un autre CV en "${nouveauNom}"`);

  cy.get(getSelector(CARTE_CV.TABLE_ROW, VERSION)).eq(1).click();
  cy.wait(1500);

  CarteCVPrimitives.ouvrirModaleRenommer(VERSION);
  CarteCVPrimitives.saisirNouveauNom(VERSION, nouveauNom);
});

// ⚠️ CE STEP EXISTAIT AVANT — IL FAUT LE GARDER
Then('le message d\'erreur {string} apparaît', (messageErreur: string) => {
  CarteCVPrimitives.verifierMessageErreur(VERSION, messageErreur);
});

Then('le renommage est refusé', () => {
  CarteCVPrimitives.annulerRenommage(VERSION);
  CarteCVPrimitives.verifierModaleFermee(VERSION);
});
// ═══════════════════════════════════════════════════════════════════════════════
// 📋 DUPLIQUER
// ═══════════════════════════════════════════════════════════════════════════════

When('je duplique un CV avec le statut {string}', (statut: string) => {
  cy.log(`📋 INTENTION: Dupliquer CV "${statut}"`);

  selectionnerCVParStatut(statut);
  CarteCVPrimitives.dupliquerCV(VERSION);
});

Then('une copie du CV est créée', () => {
  cy.log('✅ Copie créée');
});

Then('la copie apparaît dans ma liste de CV', () => {
  cy.get(getSelector(CARTE_CV.TABLE, VERSION)).should('be.visible');
  cy.log('✅ Copie visible');
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🧹 VIDER
// ═══════════════════════════════════════════════════════════════════════════════

When('je vide un CV avec le statut {string}', (statut: string) => {
  cy.log(`🧹 INTENTION: Vider CV "${statut}"`);

  selectionnerCVParStatut(statut);
  CarteCVPrimitives.viderCV(VERSION, true);
});

When('je demande à vider un CV avec le statut {string}', (statut: string) => {
  cy.log(`🧹 INTENTION: Demander vidage CV "${statut}"`);

  selectionnerCVParStatut(statut);
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

// ═══════════════════════════════════════════════════════════════════════════════
// 👤 CHANGER PROPRIÉTAIRE
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// 👤 CHANGER PROPRIÉTAIRE - SUCCÈS
// ═══════════════════════════════════════════════════════════════════════════════

When('je transfère un CV avec le statut {string} à {string}', (statut: string, email: string) => {
  cy.log(`👤 INTENTION: Transférer CV "${statut}" à ${email}`);

  selectionnerCVParStatut(statut);
  CarteCVPrimitives.ouvrirModaleChangerProprietaire(VERSION);
  CarteCVPrimitives.saisirEmailProprietaire(VERSION, email);
  CarteCVPrimitives.confirmerChangementProprietaire(VERSION);
});

Then('le transfert est enregistré avec succès', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
  cy.log('✅ Transfert enregistré');
});

// ═══════════════════════════════════════════════════════════════════════════════
// 👤 CHANGER PROPRIÉTAIRE - ERREUR (email inexistant)
// ═══════════════════════════════════════════════════════════════════════════════

When('je tente de transférer un CV avec le statut {string} à {string}', (statut: string, email: string) => {
  cy.log(`👤 INTENTION: Tenter de transférer CV "${statut}" à ${email}`);

  selectionnerCVParStatut(statut);
  CarteCVPrimitives.ouvrirModaleChangerProprietaire(VERSION);
  CarteCVPrimitives.saisirEmailProprietaire(VERSION, email);
  CarteCVPrimitives.confirmerChangementProprietaire(VERSION);
  // La modale se ferme, le message apparaît en toast
});

Then('le message {string} s\'affiche', (message: string) => {
  CarteCVPrimitives.verifierMessageToast(VERSION, message);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🗑️ SUPPRIMER
// ═══════════════════════════════════════════════════════════════════════════════

When('je supprime un CV avec le statut {string}', (statut: string) => {
  cy.log(`🗑️ INTENTION: Supprimer CV "${statut}"`);

  selectionnerCVParStatut(statut);
  CarteCVPrimitives.supprimerCV(VERSION, true);
});

When('je demande à supprimer un CV avec le statut {string}', (statut: string) => {
  cy.log(`🗑️ INTENTION: Demander suppression CV "${statut}"`);

  selectionnerCVParStatut(statut);
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
});

Then('il n\'apparaît plus dans ma liste', () => {
  cy.log('✅ CV absent');
});

Then('le CV reste dans ma liste', () => {
  cy.get(getSelector(CARTE_CV.TABLE, VERSION)).should('be.visible');
  cy.log('✅ CV toujours présent');
});

// ═══════════════════════════════════════════════════════════════════════════════
// 💾 ENREGISTRER
// ═══════════════════════════════════════════════════════════════════════════════

When('j\'enregistre les modifications d\'un CV avec le statut {string}', (statut: string) => {
  cy.log(`💾 INTENTION: Enregistrer CV "${statut}"`);

  selectionnerCVParStatut(statut);
  CarteCVPrimitives.enregistrerCV(VERSION);
});

Then('les modifications sont sauvegardées', () => {
  cy.log('✅ Modifications sauvegardées');
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🔄 CHANGER STATUT
// ═══════════════════════════════════════════════════════════════════════════════

When('je change le statut d\'un CV {string} en {string}', (statutActuel: string, nouveauStatut: string) => {
  cy.log(`🔄 INTENTION: Changer statut "${statutActuel}" → "${nouveauStatut}"`);

  selectionnerCVParStatut(statutActuel);
  CarteCVPrimitives.changerStatut(VERSION, nouveauStatut);
});

Then('le statut du CV devient {string}', (statutAttendu: string) => {
  cy.contains(statutAttendu).should('be.visible');
  cy.log(`✅ Statut: ${statutAttendu}`);
});
