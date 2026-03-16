// Steps de navigation globale : connexion, accès à Mes CVS,
// sélection d'un CV et ouverture d'une section.

import { Given, When } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/carte-cv/selectors-carte-cv.config';
import { NavigationPrimitives } from '@support/primitives/navigaation/navigation.primitives';
import { SectionsCVPrimitives } from '@support/primitives/sections-cv/titre-cv.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Connexion

Given('je suis connecté à mon compte', () => {
  NavigationPrimitives.seConnecterEtVerifier(VERSION);
});

// Navigation vers une section d'un CV

Given('je suis sur la section {string} d\'un CV existant', (nomSection: string) => {
  NavigationPrimitives.naviguerVersSectionCVExistant(VERSION, nomSection);
});

// Navigation vers Mes CVS

Given('je suis sur la page {string}', (pageName: string) => {
  NavigationPrimitives.naviguerVersPage(VERSION, pageName);
});

// Navigation entre sections

Given('je suis sur la section {string}', (nomSection: string) => {
  SectionsCVPrimitives.naviguerVersSection(VERSION, nomSection);
});

When('je quitte la section {string}', (nomSection: string) => {
  cy.log(`🚪 Quitter la section "${nomSection}"`);
  const autreSection = nomSection === 'Informations' ? 'Titres' : 'Informations';
  SectionsCVPrimitives.naviguerVersSection(VERSION, autreSection);
});

When('je reviens sur la section {string}', (nomSection: string) => {
  cy.log(`🔙 Retour sur la section "${nomSection}"`);
  SectionsCVPrimitives.naviguerVersSection(VERSION, nomSection);
});