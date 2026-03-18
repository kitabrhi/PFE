// Etapes de navigation communes : connexion, acces a Mes CV,
// ouverture d'un CV et passage d'une section a une autre.

import { Given, When } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/carte-cv/selectors-carte-cv.config';
import { NavigationPrimitives } from '@support/primitives/navigaation/navigation.primitives';
import { SectionsCVPrimitives } from '@support/primitives/sections-cv/titre-cv.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Connexion

Given('je suis connecté à mon compte', () => {
  NavigationPrimitives.seConnecterEtVerifier(VERSION);
});

// Aller sur une section d'un CV existant

Given('je suis sur la section {string} d\'un CV existant', (nomSection: string) => {
  NavigationPrimitives.naviguerVersSectionCVExistant(VERSION, nomSection);
});

// Aller sur une page de navigation

Given('je suis sur la page {string}', (pageName: string) => {
  NavigationPrimitives.naviguerVersPage(VERSION, pageName);
});

// Passer d'une section a une autre

Given('je suis sur la section {string}', (nomSection: string) => {
  SectionsCVPrimitives.naviguerVersSection(VERSION, nomSection);
});

When('je quitte la section {string}', (nomSection: string) => {
  cy.log(`Quitter la section "${nomSection}"`);
  const autreSection = nomSection === 'Informations' ? 'Titres' : 'Informations';
  SectionsCVPrimitives.naviguerVersSection(VERSION, autreSection);
});

When('je reviens sur la section {string}', (nomSection: string) => {
  cy.log(`Retour sur la section "${nomSection}"`);
  SectionsCVPrimitives.naviguerVersSection(VERSION, nomSection);
});
