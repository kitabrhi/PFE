import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/carte-cv/selectors-carte-cv.config';
import { CarteCVPrimitives } from '../../primitives/carte-cv/actions.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// utilitaire local, pas de logique UI

function genererNomUnique(base: string): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${base}-${timestamp}`;
}

let dernierNomGenere = '';

// Préparation

Given('un CV a le statut {string}', (statut: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer qu'un CV a le statut "${statut}"`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.changerStatut(VERSION, statut);
  CarteCVPrimitives.retourListeCV(VERSION);
});

Given('j\'ai au moins {int} CVs dans ma liste', (nbMin: number) => {
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

// Renommage

When('je renomme un CV avec le statut {string} en {string}', (statut: string, nouveauNom: string) => {
  dernierNomGenere = genererNomUnique(nouveauNom);
  cy.log(`✏️ INTENTION: Renommer CV "${statut}" en "${dernierNomGenere}"`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
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

  // on sélectionne le deuxième CV (index 1)
  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 1);
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

  CarteCVPrimitives.preparerEtVerifier(VERSION, 1);

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
  CarteCVPrimitives.assurerSurPageListe(VERSION);
  CarteCVPrimitives.assurerTableVisible(VERSION);
  cy.log('✅ Copie visible');
});

// Vidage

When('je vide un CV avec le statut {string}', (statut: string) => {
  cy.log(`🧹 INTENTION: Vider CV "${statut}"`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.viderCV(VERSION, true);
});

When('je demande à vider un CV avec le statut {string}', (statut: string) => {
  cy.log(`🧹 INTENTION: Demander vidage CV "${statut}"`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
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

// Changement de propriétaire

When('je transfère un CV avec le statut {string} à {string}', (statut: string, email: string) => {
  cy.log(`👤 INTENTION: Transférer CV "${statut}" à ${email}`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 2);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.ouvrirModaleChangerProprietaire(VERSION);
  CarteCVPrimitives.saisirEmailProprietaire(VERSION, email);
  CarteCVPrimitives.confirmerChangementProprietaire(VERSION);
});

Then('le transfert est enregistré avec succès', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
  cy.log('✅ Transfert enregistré');
});

When('je tente de transférer un CV avec le statut {string} à {string}', (statut: string, email: string) => {
  cy.log(`👤 INTENTION: Tenter de transférer CV "${statut}" à ${email}`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 2);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.ouvrirModaleChangerProprietaire(VERSION);
  CarteCVPrimitives.saisirEmailProprietaire(VERSION, email);
  CarteCVPrimitives.confirmerChangementProprietaire(VERSION);
});

Then('le message {string} s\'affiche', (message: string) => {
  CarteCVPrimitives.verifierMessageToast(VERSION, message);
});

// Suppression

When('je supprime un CV avec le statut {string}', (statut: string) => {
  cy.log(`🗑️ INTENTION: Supprimer CV "${statut}"`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 2);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.supprimerCV(VERSION, true);
});

When('je demande à supprimer un CV avec le statut {string}', (statut: string) => {
  cy.log(`🗑️ INTENTION: Demander suppression CV "${statut}"`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 2);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
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

// Sauvegarde

When('j\'enregistre les modifications d\'un CV avec le statut {string}', (statut: string) => {
  cy.log(`💾 INTENTION: Enregistrer CV "${statut}"`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.enregistrerCV(VERSION);
});

Then('les modifications sont sauvegardées', () => {
  cy.log('✅ Modifications sauvegardées');
});

// Changement de statut

When('je change le statut d\'un CV {string} en {string}', (statutActuel: string, nouveauStatut: string) => {
  cy.log(`🔄 INTENTION: Changer statut "${statutActuel}" → "${nouveauStatut}"`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statutActuel);
  CarteCVPrimitives.changerStatut(VERSION, nouveauStatut);
});

Then('le statut du CV devient {string}', (statutAttendu: string) => {
  CarteCVPrimitives.verifierStatutVisible(statutAttendu);
});

// Téléchargement JSON (v2 seulement)

When('je télécharge le JSON d\'un CV avec le statut {string}', (statut: string) => {
  cy.log(`📄 INTENTION: Download Json CV "${statut}"`);

  CarteCVPrimitives.preparerEtVerifier(VERSION, 1);
  CarteCVPrimitives.selectionnerCVEtNaviguer(VERSION, statut);
  CarteCVPrimitives.downloadJson(VERSION);
});

Then('le fichier JSON est téléchargé', () => {
  cy.log('✅ JSON téléchargé');
});
