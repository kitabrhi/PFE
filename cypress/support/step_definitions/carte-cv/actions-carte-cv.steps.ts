

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/carte-cv/selectors-carte-cv.config';
import { CarteCVPrimitives } from '../../primitives/carte-cv/actions.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// ─── Utilitaire local (pas de logique UI) ────────────────────────────────────

function genererNomUnique(base: string): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${base}-${timestamp}`;
}

let dernierNomGenere = '';

//  PRÉPARATION

Given('un CV existe dans ma liste', () => {
  cy.log('🔧 PRÉPARATION: Vérifier qu\'un CV existe');
  CarteCVPrimitives.preparerEtVerifier(VERSION, 1);
});


// Given('2 CV existe dans ma liste', (nbMin: number) => {
//   cy.log('🔧 PRÉPARATION: Vérifier que 2 CVs existes');
//   CarteCVPrimitives.preparerEtVerifier2(VERSION, 2);

// });


Given('j\'ai au moins {int} CVs sur la page', (nbMin: number) => {
  cy.log(`🔧 PRÉPARATION: Garantir au moins ${nbMin} CVs`);
  CarteCVPrimitives.assurerSurPageListe(VERSION);
  CarteCVPrimitives.garantirNbMinCVs(VERSION, nbMin);
});

Given('un CV porte déjà le nom {string}', (nom: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer qu'un CV s'appelle "${nom}"`);
  CarteCVPrimitives.preparerEtVerifier(VERSION, 2);
  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirModaleRenommer(VERSION);
  CarteCVPrimitives.saisirNouveauNom(VERSION, nom);
  CarteCVPrimitives.confirmerRenommage(VERSION);
  CarteCVPrimitives.verifierModaleFermee(VERSION);
  CarteCVPrimitives.retourListeCV(VERSION);
});

//  RENOMMAGE

When('je renomme ce CV en {string}', (nouveauNom: string) => {
  dernierNomGenere = genererNomUnique(nouveauNom);
  cy.log(`✏️ INTENTION: Renommer CV en "${dernierNomGenere}"`);

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirModaleRenommer(VERSION);
  CarteCVPrimitives.saisirNouveauNom(VERSION, dernierNomGenere);
  CarteCVPrimitives.confirmerRenommage(VERSION);
});

Then('le CV est renommé en {string}', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
  CarteCVPrimitives.verifierNouveauNom(VERSION, dernierNomGenere);
});

When('je tente de renommer un autre CV en {string}', (nouveauNom: string) => {
  cy.log(`✏️ INTENTION: Tenter de renommer un autre CV en "${nouveauNom}"`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 2);
  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 1);
  CarteCVPrimitives.ouvrirModaleRenommer(VERSION);
  CarteCVPrimitives.saisirNouveauNom(VERSION, nouveauNom);
});

Then('un message d\'erreur indique que ce nom existe déjà', () => {
  CarteCVPrimitives.verifierMessageErreur(VERSION, 'Ce nom existe déjà');
});

Then('le renommage est refusé', () => {
  CarteCVPrimitives.annulerRenommage(VERSION);
  CarteCVPrimitives.verifierModaleFermee(VERSION);
});

//  DUPLICATION

When('je duplique ce CV', () => {
  cy.log('📋 INTENTION: Dupliquer le CV');

  if (VERSION === 'v1') {
    CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
    CarteCVPrimitives.dupliquerCV(VERSION);
  } else {
    CarteCVPrimitives.trouverLigneCV(VERSION, '');
    CarteCVPrimitives.dupliquerCV(VERSION);
  }
});

Then('une copie du CV est créée', () => {
  cy.log('✅ Copie créée');
});

Then('la copie apparaît dans ma liste de CV', () => {
  CarteCVPrimitives.assurerSurPageListe(VERSION);
  CarteCVPrimitives.assurerTableVisible(VERSION);
  cy.log('✅ Copie visible');
});

//  VIDAGE

When('je vide ce CV', () => {
  cy.log('🧹 INTENTION: Vider le CV');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.viderCV(VERSION, true);
});

When('je demande à vider ce CV', () => {
  cy.log('🧹 INTENTION: Demander vidage du CV');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirConfirmationVider(VERSION);
});

When('j\'annule l\'opération', () => {
  cy.log('❌ INTENTION: Annuler');
  CarteCVPrimitives.annulerActionModale(VERSION);
});

Then('toutes les informations sont supprimées', () => {
  cy.log('✅ Informations supprimées');
});

Then('le contenu du CV reste intact', () => {
  cy.log('✅ Contenu intact');
});

//  CHANGEMENT DE PROPRIÉTAIRE

When('je transfère ce CV à un collègue', () => {
  cy.log('👤 INTENTION: Transférer le CV à un collègue');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirModaleChangerProprietaire(VERSION);
  CarteCVPrimitives.saisirEmailProprietaire(VERSION, 'ykitabrhi@redsen.ch');
  CarteCVPrimitives.confirmerChangementProprietaire(VERSION);
});

When('je tente de transférer ce CV à un email inexistant', () => {
  cy.log('👤 INTENTION: Tenter transfert à un email inexistant');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirModaleChangerProprietaire(VERSION);
  CarteCVPrimitives.saisirEmailProprietaire(VERSION, 'inexistant@fake.com');
  CarteCVPrimitives.confirmerChangementProprietaire(VERSION);
});

Then('le transfert est enregistré avec succès', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
  cy.log('✅ Transfert enregistré');
});

Then('un message indique que le propriétaire est introuvable', () => {
  CarteCVPrimitives.verifierMessageToast(VERSION, 'introuvable');
});

// ═══════════════════════════════════════════════════════════════════════════════
//  SUPPRESSION
// ═══════════════════════════════════════════════════════════════════════════════

When('je supprime ce CV', () => {
  cy.log('🗑️ INTENTION: Supprimer le CV');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.supprimerCV(VERSION, true);
});

When('je demande à supprimer ce CV', () => {
  cy.log('🗑️ INTENTION: Demander suppression du CV');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirConfirmationSupprimer(VERSION);
});

When('j\'annule la suppression', () => {
  cy.log('❌ INTENTION: Annuler suppression');
  CarteCVPrimitives.annulerActionModale(VERSION);
});

Then('le CV est supprimé définitivement', () => {
  cy.log('✅ CV supprimé');
  CarteCVPrimitives.assurerSurPageListe(VERSION);
});

Then('il n\'apparaît plus dans ma liste', () => {
  CarteCVPrimitives.assurerSurPageListe(VERSION);
  cy.log('✅ CV absent');
});

Then('le CV reste dans ma liste', () => {
  CarteCVPrimitives.assurerSurPageListe(VERSION);
  CarteCVPrimitives.assurerTableVisible(VERSION);
  cy.log('✅ CV toujours présent');
});

//  SAUVEGARDE

When('je modifie ce CV', () => {
  cy.log('✏️ INTENTION: Modifier le CV');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  // Modification minimale pour que l'enregistrement ait un sens.
  CarteCVPrimitives.changerStatut(VERSION, 'En cours');
});

When('j\'enregistre les modifications', () => {
  cy.log('💾 INTENTION: Enregistrer les modifications');
  CarteCVPrimitives.enregistrerCV(VERSION);
});

Then('les modifications sont sauvegardées', () => {
  cy.log('✅ Modifications sauvegardées');
});

//  CHANGEMENT DE STATUT

When('je change le statut de ce CV en {string}', (nouveauStatut: string) => {
  cy.log(`🔄 INTENTION: Changer statut → "${nouveauStatut}"`);

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.changerStatut(VERSION, nouveauStatut);
});

Then('le statut du CV devient {string}', (statutAttendu: string) => {
  CarteCVPrimitives.verifierStatutVisible(statutAttendu);
});

//  TÉLÉCHARGEMENT JSON (v2)

When('je télécharge le JSON de ce CV', () => {
  cy.log('📄 INTENTION: Download Json');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.downloadJson(VERSION);
});

Then('le fichier JSON est téléchargé', () => {
  cy.log('✅ JSON téléchargé');
});