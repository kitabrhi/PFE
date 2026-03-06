/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRIMITIVES - AUTHENTIFICATION
 * ═══════════════════════════════════════════════════════════════════════════
 * Couche d'abstraction : Actions techniques (COMMENT)
 * Instanciable sur v1 ET v2 via getSelector()
 * 
 * UN SEUL fichier au lieu de 4 (navigation + connexion + déconnexion + vérification)
 * Zéro duplication : les if/else v1/v2 sont remplacés par getSelector()
 */

import {
  Version,
  getSelector,
  AUTH_URLS,
  AUTH_SELECTORS,
  AUTH_CREDENTIALS
} from '../../config/Selectors-auth.config';

export class AuthPrimitives {

  // ═══════════════════════════════════════════════════════════════════════════
  // 🌐 NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Naviguer vers la page de connexion
   */
  static naviguerPageConnexion(version: Version): void {
    cy.log('🌐 Navigation vers page de connexion');

    cy.visit(getSelector(AUTH_URLS.BASE, version));

    // Vérifier que la page de connexion est chargée
    AuthPrimitives.verifierElement(version, AUTH_SELECTORS.PAGE_LOGIN_VISIBLE, AUTH_SELECTORS.PAGE_LOGIN_TEXT);
  }

  /**
   * Tenter d'accéder à une page protégée sans authentification
   */
  static tenterAccesPageProtegee(version: Version): void {
    cy.log('🚫 Tentative accès page protégée');

    cy.visit(getSelector(AUTH_URLS.PAGE_PROTEGEE, version), {
      failOnStatusCode: false
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔐 CONNEXION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Saisir email dans le champ de connexion
   */
  static saisirEmail(version: Version, email: string): void {
    cy.log(`📧 Saisie email: ${email}`);

    cy.get(getSelector(AUTH_SELECTORS.INPUT_EMAIL, version), { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type(email);
  }

  /**
   * Saisir mot de passe
   */
  static saisirPassword(version: Version, password: string): void {
    cy.log('🔑 Saisie mot de passe');

    cy.get(getSelector(AUTH_SELECTORS.INPUT_PASSWORD, version))
      .should('be.visible')
      .clear()
      .type(password);
  }

  /**
   * Cliquer sur le bouton de connexion
   */
  static cliquerConnexion(version: Version): void {
    cy.log('🖱️ Clic bouton connexion');

    cy.get(getSelector(AUTH_SELECTORS.BTN_CONNEXION, version)).click();
  }

  /**
   * Connexion complète : saisie email + password + clic
   */
  static seConnecter(version: Version, email: string, password: string): void {
    cy.log(`🔐 Connexion avec ${email}`);

    AuthPrimitives.saisirEmail(version, email);
    AuthPrimitives.saisirPassword(version, password);
    AuthPrimitives.cliquerConnexion(version);
    cy.wait(3000);
  }

  /**
   * Authentification complète : navigation + connexion
   */
  static authentifierComplet(version: Version): void {
    AuthPrimitives.naviguerPageConnexion(version);
    AuthPrimitives.seConnecter(
      version,
      AUTH_CREDENTIALS.VALID.email,
      AUTH_CREDENTIALS.VALID.password
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 🚪 DÉCONNEXION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Se déconnecter de l'application
   */
  static seDeconnecter(version: Version): void {
    cy.log('🚪 Déconnexion');

    if (version === 'v1') {
      // V1 : Ouvrir menu dropdown puis cliquer "Déconnexion"
      cy.get('mat-icon').contains('keyboard_arrow_down')
        .should('be.visible')
        .click({ force: true });
      cy.contains(getSelector(AUTH_SELECTORS.DECONNEXION_TEXT, version))
        .should('be.visible')
        .click({ force: true });
    } else {
      // V2 : Menu utilisateur puis bouton déconnexion
      cy.get(getSelector(AUTH_SELECTORS.MENU_UTILISATEUR, version)).click();
      cy.get(getSelector(AUTH_SELECTORS.BTN_DECONNEXION, version)).click();
    }

    cy.wait(2000);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ VÉRIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Helper privé : vérifier un élément par sélecteur OU par texte selon la version
   * v1 utilise souvent cy.contains() (pas de data-testid)
   * v2 utilise cy.get() avec data-testid
   */
  private static verifierElement(
    version: Version,
    selectorMap: { v1: string; v2: string },
    textMap: { v1: string; v2: string },
    timeout: number = 10000
  ): void {
    const selector = getSelector(selectorMap, version);
    const text = getSelector(textMap, version);

    if (selector) {
      cy.get(selector, { timeout }).should('be.visible');
    } else if (text) {
      cy.contains(text, { timeout }).should('be.visible');
    }
  }

  /**
   * Vérifier authentification réussie
   */
  static verifierAuthentificationReussie(version: Version): void {
    cy.log('✅ Vérification authentification réussie');

    cy.url({ timeout: 20000 }).should('not.include', getSelector(AUTH_URLS.URL_LOGIN, version));
    AuthPrimitives.verifierElement(version, AUTH_SELECTORS.APP_LOADED, AUTH_SELECTORS.APP_LOADED_TEXT);
  }

  /**
   * Vérifier espace personnel visible
   */
  static verifierEspacePersonnel(version: Version): void {
    cy.log('✅ Vérification espace personnel');

    AuthPrimitives.verifierElement(version, AUTH_SELECTORS.ESPACE_PERSONNEL, AUTH_SELECTORS.ESPACE_PERSONNEL_TEXT);
  }

  /**
   * Vérifier erreur identifiants invalides
   */
  static verifierErreurIdentifiants(version: Version): void {
    cy.log('❌ Vérification erreur identifiants');

    const selector = getSelector(AUTH_SELECTORS.ERROR_IDENTIFIANTS, version);
    const text = getSelector(AUTH_SELECTORS.ERROR_IDENTIFIANTS_TEXT, version);

    if (selector) {
      cy.get(selector, { timeout: 5000 }).should('contain', text);
    } else {
      cy.contains(text, { timeout: 5000 }).should('be.visible');
    }
  }

  /**
   * Vérifier erreur compte inexistant
   */
  static verifierErreurCompteInexistant(version: Version): void {
    cy.log('❌ Vérification erreur compte inexistant');

    const selector = getSelector(AUTH_SELECTORS.ERROR_COMPTE_INEXISTANT, version);
    const text = getSelector(AUTH_SELECTORS.ERROR_COMPTE_INEXISTANT_TEXT, version);

    if (selector) {
      cy.get(selector, { timeout: 5000 }).should('contain', text);
    } else {
      cy.contains(text, { timeout: 5000 }).should('be.visible');
    }
  }

  /**
   * Vérifier qu'on reste sur la page de connexion
   */
  static verifierResteSurPageConnexion(version: Version): void {
    cy.log('❌ Vérification reste sur page connexion');

    cy.url().should('include', getSelector(AUTH_URLS.URL_LOGIN, version));
  }

  /**
   * Vérifier redirection vers page de connexion
   */
  static verifierRedirectionPageConnexion(version: Version): void {
    cy.log('➡️ Vérification redirection page connexion');

    cy.url({ timeout: 10000 }).should('include', getSelector(AUTH_URLS.URL_LOGIN, version));
  }

  /**
   * Vérifier session terminée (pas de token/cookie actif)
   */
  static verifierSessionTerminee(version: Version): void {
    cy.log('🔒 Vérification session terminée');

    cy.url().should('include', getSelector(AUTH_URLS.URL_LOGIN, version));
  }
}