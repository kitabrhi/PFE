// Steps de navigation globale : connexion, accès à Mes CVS,
// sélection d'un CV et ouverture d'une section.

import { Given } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/carte-cv/selectors-carte-cv.config';
import { NavigationPrimitives } from '@support/primitives/navigaation/navigation.primitives';

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
