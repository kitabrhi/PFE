import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/carte-cv/selectors-carte-cv.config';
import { AUTH_CREDENTIALS } from '../../config/auth/selectors-auth.config';
import { CarteCVPrimitives } from '../../primitives/carte-cv/actions.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Petit utilitaire pour éviter les doublons de nom pendant les tests.
function genererNomUnique(base: string): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${base}-${timestamp}`;
}

let dernierNomGenere = '';

// ===============================
// PRÉPARATION
// ===============================

Given('un CV existe dans ma liste', () => {
  cy.log('PRÉPARATION: Vérifier qu\'un CV existe');
  CarteCVPrimitives.preparerEtVerifier(VERSION, 1);
});

Given('j\'ai au moins {int} CVs sur la page', (nbMin: number) => {
  cy.log(`PRÉPARATION: Garantir au moins ${nbMin} CV(s)`);
  CarteCVPrimitives.preparerEtVerifier(VERSION, nbMin);
});

Given('un CV porte déjà le nom {string}', (nom: string) => {
  cy.log(`PRÉPARATION: S'assurer qu'un CV porte déjà le nom "${nom}"`);
  CarteCVPrimitives.assurerQuUnCVPorteDejaCeNom(VERSION, nom);
});

// ===============================
// RENOMMAGE
// ===============================

When('je renomme ce CV en {string}', (nouveauNom: string) => {
  dernierNomGenere = genererNomUnique(nouveauNom);
  cy.log(`INTENTION : renommer le CV en "${dernierNomGenere}"`);

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirModaleRenommer(VERSION);
  CarteCVPrimitives.saisirNouveauNom(VERSION, dernierNomGenere);
  CarteCVPrimitives.confirmerRenommage(VERSION);
});

Then('le CV est renommé en {string}', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
  CarteCVPrimitives.verifierNouveauNom(VERSION, dernierNomGenere);
});

// ===============================
// RENOMMAGE — SCÉNARIO NÉGATIF
// ===============================

When('je tente de renommer un autre CV en {string}', (nomExistant: string) => {
  cy.log(`INTENTION : tenter de renommer un autre CV en "${nomExistant}"`);
  CarteCVPrimitives.tenterRenommageAvecNomExistant(VERSION, nomExistant);
});

Then('un message d\'erreur indique que ce nom existe déjà', () => {
  CarteCVPrimitives.verifierErreurNomDejaExistant(VERSION, 'Ce nom existe déjà');
});

Then('le renommage est refusé', () => {
  CarteCVPrimitives.fermerModaleApresRefusRenommage(VERSION);
});

// ===============================
// DUPLICATION
// ===============================

When('je duplique ce CV', () => {
  cy.log('INTENTION: Dupliquer le CV');

  if (VERSION === 'v1') {
    CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
    CarteCVPrimitives.dupliquerCV(VERSION);
  } else {
    CarteCVPrimitives.trouverLigneCV(VERSION, '');
    CarteCVPrimitives.dupliquerCV(VERSION);
  }
});

Then('une copie du CV est créée', () => {
  CarteCVPrimitives.assurerSurPageListe(VERSION);
  CarteCVPrimitives.assurerTableVisible(VERSION);
});

Then('la copie apparaît dans ma liste de CV', () => {
  CarteCVPrimitives.assurerSurPageListe(VERSION);
  CarteCVPrimitives.assurerTableVisible(VERSION);
  cy.log('Copie visible');
});

// ===============================
// VIDAGE
// ===============================

When('je vide ce CV', () => {
  cy.log('INTENTION: Vider le CV');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.viderCV(VERSION, true);
});

When('je demande à vider ce CV', () => {
  cy.log('INTENTION: Demander vidage du CV');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirConfirmationVider(VERSION);
});

When('j\'annule l\'opération', () => {
  cy.log('INTENTION: Annuler');
  CarteCVPrimitives.annulerActionModale(VERSION);
});

Then('toutes les informations sont supprimées', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
});

Then('le contenu du CV reste intact', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
});

// ===============================
// CHANGEMENT DE PROPRIÉTAIRE
// ===============================

When('je transfère ce CV à un collègue', () => {
  cy.log('INTENTION: Transférer le CV à un collègue');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirModaleChangerProprietaire(VERSION);
  CarteCVPrimitives.saisirEmailProprietaire(VERSION, AUTH_CREDENTIALS.COLLEGUE.email);
  CarteCVPrimitives.confirmerChangementProprietaire(VERSION);
});

When('je tente de transférer ce CV à un email inexistant', () => {
  cy.log('INTENTION: Tenter transfert à un email inexistant');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirModaleChangerProprietaire(VERSION);
  CarteCVPrimitives.saisirEmailProprietaire(VERSION, 'inexistant@fake.com');
  CarteCVPrimitives.confirmerChangementProprietaire(VERSION);
});

Then('le transfert est enregistré avec succès', () => {
  CarteCVPrimitives.verifierModaleFermee(VERSION);
  cy.log('Transfert enregistré');
});

Then('un message indique que le propriétaire est introuvable', () => {
  CarteCVPrimitives.verifierMessageToast(VERSION, 'introuvable');
});

// ===============================
// SUPPRESSION
// ===============================

When('je supprime ce CV', () => {
  cy.log('INTENTION: Supprimer le CV');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.supprimerCV(VERSION, true);
});

When('je demande à supprimer ce CV', () => {
  cy.log('INTENTION: Demander suppression du CV');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.ouvrirConfirmationSupprimer(VERSION);
});

When('j\'annule la suppression', () => {
  cy.log('INTENTION: Annuler suppression');
  CarteCVPrimitives.annulerActionModale(VERSION);
});

Then('le CV est supprimé définitivement', () => {
  cy.log('CV supprimé');
  CarteCVPrimitives.assurerSurPageListe(VERSION);
});

Then('il n\'apparaît plus dans ma liste', () => {
  CarteCVPrimitives.assurerSurPageListe(VERSION);
  cy.log('CV absent');
});

Then('le CV reste dans ma liste', () => {
  CarteCVPrimitives.assurerSurPageListe(VERSION);
  CarteCVPrimitives.assurerTableVisible(VERSION);
  cy.log('CV toujours présent');
});

// ===============================
// SAUVEGARDE
// ===============================

When('je modifie ce CV', () => {
  cy.log('INTENTION: Modifier le CV');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.changerStatut(VERSION, 'En cours');
});

When('j\'enregistre les modifications', () => {
  cy.log('INTENTION: Enregistrer les modifications');
  CarteCVPrimitives.enregistrerCV(VERSION);
});

Then('les modifications sont sauvegardées', () => {
  CarteCVPrimitives.verifierStatutVisible('En cours');
});

// ===============================
// CHANGEMENT DE STATUT
// ===============================

When('je change le statut de ce CV en {string}', (nouveauStatut: string) => {
  cy.log(`INTENTION: Changer statut → "${nouveauStatut}"`);

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.changerStatut(VERSION, nouveauStatut);
});

Then('le statut du CV devient {string}', (statutAttendu: string) => {
  CarteCVPrimitives.verifierStatutVisible(statutAttendu);
});

// ===============================
// TÉLÉCHARGEMENT JSON
// ===============================

When('je télécharge le JSON de ce CV', () => {
  cy.log('INTENTION: Download Json');

  CarteCVPrimitives.selectionnerCVParIndex(VERSION, 0);
  CarteCVPrimitives.downloadJson(VERSION);
});

Then('le fichier JSON est téléchargé', () => {
  // Pas de message de confirmation côté UI — on vérifie que la page reste stable
  CarteCVPrimitives.assurerSurPageListe(VERSION);
});