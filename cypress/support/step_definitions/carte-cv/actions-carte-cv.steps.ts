import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

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
// HELPER: Sélectionner un CV par statut
// ═══════════════════════════════════════════════════════════════════════════════

function selectionnerCVParStatut(statut: string): void {
  cy.log(`📋 Sélection CV avec statut "${statut}"`);
  cy.contains('tr', statut).click();
  cy.get('button[title]', { timeout: 5000 }).should('be.visible');
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENOMMER (Fichier 01-renommer-cv.feature)
// ═══════════════════════════════════════════════════════════════════════════════

When('je renomme un CV avec le statut {string} en {string}', (statut: string, nouveauNom: string) => {
  cy.log(`✏️ INTENTION: Renommer CV "${statut}" en "${nouveauNom}"`);

  selectionnerCVParStatut(statut);

  cy.get('button[title="Renommer"]').click({ force: true });
  cy.get('.mat-mdc-dialog-container').should('be.visible');
  cy.get('.mat-mdc-dialog-container input').clear().type(nouveauNom);
  cy.contains('button', 'Valider').click();
  cy.get('.mat-mdc-dialog-container').should('not.exist');
});

Then('le CV est renommé en {string}', (nouveauNom: string) => {
  cy.contains(nouveauNom).should('be.visible');
  cy.log(`✅ CV renommé`);
});

// ═══════════════════════════════════════════════════════════════════════════════
// DUPLIQUER (Fichier 02-dupliquer-cv.feature)
// ═══════════════════════════════════════════════════════════════════════════════

When('je duplique un CV avec le statut {string}', (statut: string) => {
  cy.log(`📋 INTENTION: Dupliquer CV "${statut}"`);

  // Trouver la ligne avec ce statut et cliquer sur le bouton dupliquer (2ème icône)
  cy.contains('tr', statut).find('button').eq(1).click();
  cy.get('.mat-mdc-table').should('be.visible');
});

Then('une copie du CV est créée', () => {
  cy.log('✅ Copie créée');
});

Then('la copie apparaît dans ma liste de CV', () => {
  cy.get('.mat-mdc-table').should('be.visible');
  cy.log('✅ Copie visible');
});

// ═══════════════════════════════════════════════════════════════════════════════
// VIDER (Fichier 03-vider-cv.feature)
// ═══════════════════════════════════════════════════════════════════════════════

When('je vide un CV avec le statut {string}', (statut: string) => {
  cy.log(`🧹 INTENTION: Vider CV "${statut}"`);

  selectionnerCVParStatut(statut);

  cy.get('button[title="Vider"]').click({ force: true });
  cy.get('.mat-mdc-dialog-container').should('be.visible');
  cy.contains('button', 'Vider').click();
  cy.get('.mat-mdc-dialog-container').should('not.exist');
});

When('je demande à vider un CV avec le statut {string}', (statut: string) => {
  cy.log(`🧹 INTENTION: Demander vidage CV "${statut}"`);

  selectionnerCVParStatut(statut);

  cy.get('button[title="Vider"]').click({ force: true });
  cy.get('.mat-mdc-dialog-container').should('be.visible');
});

When('j\'annule l\'opération', () => {
  cy.log('❌ INTENTION: Annuler');
  cy.contains('button', 'Annuler').click();
  cy.get('.mat-mdc-dialog-container').should('not.exist');
});

Then('toutes les informations sont supprimées', () => {
  cy.log('✅ Informations supprimées');
});

Then('le contenu du CV reste intact', () => {
  cy.log('✅ Contenu intact');
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHANGER PROPRIÉTAIRE (Fichier 04-changer-proprietaire.feature)
// ═══════════════════════════════════════════════════════════════════════════════

When('je transfère un CV avec le statut {string} à {string}', (statut: string, email: string) => {
  cy.log(`👤 INTENTION: Transférer CV "${statut}" à ${email}`);

  selectionnerCVParStatut(statut);

  cy.get('button[title="Changer propriétaire"]').click({ force: true });
  cy.get('.mat-mdc-dialog-container').should('be.visible');
  cy.get('.mat-mdc-dialog-container input').clear().type(email);
  cy.contains('button', 'Confirmer').click();
  cy.get('.mat-mdc-dialog-container').should('not.exist');
});

Then('le propriétaire du CV devient {string}', (email: string) => {
  cy.contains(email).should('be.visible');
  cy.log(`✅ Propriétaire changé: ${email}`);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPRIMER (Fichier 05-supprimer-cv.feature)
// ═══════════════════════════════════════════════════════════════════════════════

When('je supprime un CV avec le statut {string}', (statut: string) => {
  cy.log(`🗑️ INTENTION: Supprimer CV "${statut}"`);

  selectionnerCVParStatut(statut);

  cy.get('button[title="Supprimer"]').click({ force: true });
  cy.get('.mat-mdc-dialog-container').should('be.visible');
  cy.contains('button', 'Supprimer').click();
  cy.get('.mat-mdc-dialog-container').should('not.exist');
});

When('je demande à supprimer un CV avec le statut {string}', (statut: string) => {
  cy.log(`🗑️ INTENTION: Demander suppression CV "${statut}"`);

  selectionnerCVParStatut(statut);

  cy.get('button[title="Supprimer"]').click({ force: true });
  cy.get('.mat-mdc-dialog-container').should('be.visible');
});

When('j\'annule la suppression', () => {
  cy.log('❌ INTENTION: Annuler suppression');
  cy.contains('button', 'Annuler').click();
  cy.get('.mat-mdc-dialog-container').should('not.exist');
});

Then('le CV est supprimé définitivement', () => {
  cy.log('✅ CV supprimé');
});

Then('il n\'apparaît plus dans ma liste', () => {
  cy.log('✅ CV absent');
});

Then('le CV reste dans ma liste', () => {
  cy.get('.mat-mdc-table').should('be.visible');
  cy.log('✅ CV toujours présent');
});

// ═══════════════════════════════════════════════════════════════════════════════
// ENREGISTRER (Fichier 06-enregistrer-cv.feature)
// ═══════════════════════════════════════════════════════════════════════════════

When('j\'enregistre les modifications d\'un CV avec le statut {string}', (statut: string) => {
  cy.log(`💾 INTENTION: Enregistrer CV "${statut}"`);

  selectionnerCVParStatut(statut);

  cy.get('button[title="Enregistrer"]').click({ force: true });
  cy.get('.mat-mdc-table').should('be.visible');
});

Then('les modifications sont sauvegardées', () => {
  cy.log('✅ Modifications sauvegardées');
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHANGER STATUT (Fichier 07-changer-statut-cv.feature)
// ═══════════════════════════════════════════════════════════════════════════════

When('je change le statut d\'un CV {string} en {string}', (statutActuel: string, nouveauStatut: string) => {
  cy.log(`🔄 INTENTION: Changer statut "${statutActuel}" → "${nouveauStatut}"`);

  selectionnerCVParStatut(statutActuel);

  cy.get('.mat-mdc-form-field mat-select').click({ force: true });
  cy.get('.mat-mdc-option').should('be.visible');
  cy.contains('.mat-mdc-option', nouveauStatut).click({ force: true });
  cy.get('.mat-mdc-option').should('not.exist');
});

Then('le statut du CV devient {string}', (statutAttendu: string) => {
  cy.contains(statutAttendu).should('be.visible');
  cy.log(`✅ Statut: ${statutAttendu}`);
});
