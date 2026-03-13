import { Given } from '@badeball/cypress-cucumber-preprocessor';
import { Version, getSelector, CARTE_CV } from '../../config/carte-cv/selectors-carte-cv.config';
import { CarteCVPrimitives } from '../../primitives/carte-cv/actions.primitives';
import { SectionsCVPrimitives } from '../../primitives/sections-cv/titre-cv.primitives';
import { AuthPrimitives } from '@support/primitives/auth/auth.primitives';
import { AUTH_CREDENTIALS } from '@support/config/auth/selectors-auth.config';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Regroupe : connexion + vérification auth
Given('je suis connecté à mon compte', () => {
  // Naviguer vers la page de connexion
  cy.visit('/');

  // Se connecter
  AuthPrimitives.seConnecter(
     VERSION,
     AUTH_CREDENTIALS.VALID.email,
     AUTH_CREDENTIALS.VALID.password
   );
 });

// Regroupe : aller sur Mes CVS + sélectionner un CV + naviguer vers la section
Given('je suis sur la section {string} d\'un CV existant', (nomSection: string) => {
  // Naviguer vers Mes CVS
  if (VERSION === 'v1') {
    cy.get('.mat-sidenav', { timeout: 10000 }).should('be.visible');
    cy.contains('a', 'Mes CVS').click({ force: true });
    cy.url().should('include', '/user/versioning');
  } else {
    cy.contains('a', 'Mes CV').click({ force: true });
  }

  CarteCVPrimitives.assurerTableVisible(VERSION);

  // Sélectionner le premier CV
 cy.log('🔍 Sélection d\'un CV existant');

  if (VERSION === 'v1') {
    cy.get('tr.mat-mdc-row', { timeout: 10000 }).then($rows => {
      if ($rows.length === 0) {
        throw new Error(
          '❌ Aucun CV trouvé dans la liste. ' +
          'Veuillez créer au moins un CV avant de lancer les tests de section.'
        );
      }
      cy.wrap($rows).first().click();
      cy.wait(1500);
    });
  } else {
    cy.get('[data-testid="cv-row"]', { timeout: 10000 }).then($rows => {
      if ($rows.length === 0) {
        throw new Error(
          '❌ Aucun CV trouvé dans la liste. ' +
          'Veuillez créer au moins un CV avant de lancer les tests de section.'
        );
      }
      cy.wrap($rows).first().click();
      cy.wait(1500);
      CarteCVPrimitives.verifierNavigationPageDetail(VERSION);
    });
  }

  cy.log('✅ CV sélectionné');

  // Naviguer vers la section demandée
  SectionsCVPrimitives.naviguerVersSection(VERSION, nomSection);

  cy.log(`✅ Sur la section "${nomSection}" d'un CV existant`);
});