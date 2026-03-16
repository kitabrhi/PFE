// Helpers de navigation pour les parcours autour des CV.

import { Version, getSelector, CARTE_CV } from '../../config/carte-cv/selectors-carte-cv.config';
import { AuthPrimitives } from '../auth/auth.primitives';
import { CarteCVPrimitives } from '../carte-cv/actions.primitives';
import { SectionsCVPrimitives } from '../sections-cv/titre-cv.primitives';

export class NavigationPrimitives {

  // Connexion

  static seConnecterEtVerifier(version: Version): void {
    AuthPrimitives.authentifierComplet(version);
    AuthPrimitives.verifierAuthentificationReussie(version);
  }

  // Navigation vers Mes CV

  static naviguerVersPageMesCVs(version: Version): void {
    cy.log('🗺️ Navigation vers Mes CVS');

    if (version === 'v1') {
      cy.get('.mat-sidenav', { timeout: 10000 }).should('be.visible');
      cy.contains('a', 'Mes CVS').click({ force: true });
      cy.url().should('include', '/user/versioning');
    } else {
      cy.contains('a', 'Mes CV').click({ force: true });
    }

    CarteCVPrimitives.assurerTableVisible(version);
    cy.log('✅ Sur la page: Mes CVS');
  }

  static naviguerVersPage(version: Version, pageName: string): void {
    if (pageName === 'Mes CVS') {
      NavigationPrimitives.naviguerVersPageMesCVs(version);
    } else {
      throw new Error(`❌ Page inconnue : "${pageName}"`);
    }
  }

  // Sélection d'un CV

  // sélectionne le premier CV et ouvre son détail — lève une erreur si la liste est vide
  static selectionnerPremierCV(version: Version): void {
    cy.log('🔍 Sélection du premier CV');

    const rowSelector = getSelector(CARTE_CV.TABLE_ROW, version);

    cy.get(rowSelector, { timeout: 10000 }).then($rows => {
      if ($rows.length === 0) {
        throw new Error(
          '❌ Aucun CV trouvé dans la liste. ' +
          'Veuillez créer au moins un CV avant de lancer les tests de section.'
        );
      }
      cy.wrap($rows).first().click();
      cy.wait(1500);
      CarteCVPrimitives.verifierNavigationPageDetail(version);
    });

    cy.log('✅ CV sélectionné');
  }

  

  // Parcours complets

  // Mes CVS → premier CV → section demandée
  static naviguerVersSectionCVExistant(version: Version, nomSection: string): void {
    NavigationPrimitives.naviguerVersPageMesCVs(version);
    NavigationPrimitives.selectionnerPremierCV(version);
    SectionsCVPrimitives.naviguerVersSection(version, nomSection);
    cy.log(`✅ Sur la section "${nomSection}" d'un CV existant`);
  }
}
