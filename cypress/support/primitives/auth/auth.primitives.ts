/**
 * Primitives d'authentification partagées entre v1 et v2.
 * Les sélecteurs sont choisis à partir de la version active.
 */

import {
  Version,
  getSelector,
  AUTH_URLS,
  AUTH_SELECTORS,
  AUTH_CREDENTIALS
} from '../../config/auth/selectors-auth.config';

export class AuthPrimitives {

  // Navigation.

  /**
   * Ouvre la page de connexion.
   */
  static naviguerPageConnexion(version: Version): void {
    cy.log('🌐 Navigation vers page de connexion');

    cy.visit(getSelector(AUTH_URLS.BASE, version));

    // On attend un repère fiable avant d'aller plus loin.
    AuthPrimitives.verifierElement(version, AUTH_SELECTORS.PAGE_LOGIN_VISIBLE, AUTH_SELECTORS.PAGE_LOGIN_TEXT);
  }

  /**
   * Tente d'ouvrir une page protégée sans session active.
   */
  static tenterAccesPageProtegee(version: Version): void {
    cy.log('🚫 Tentative accès page protégée');

    cy.visit(getSelector(AUTH_URLS.PAGE_PROTEGEE, version), {
      failOnStatusCode: false
    });
  }

  // Connexion.

  /**
   * Renseigne l'email.
   */
  static saisirEmail(version: Version, email: string): void {
    cy.log(`📧 Saisie email: ${email}`);

    cy.get(getSelector(AUTH_SELECTORS.INPUT_EMAIL, version), { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type(email);
  }

  /**
   * Renseigne le mot de passe.
   */
  static saisirPassword(version: Version, password: string): void {
    cy.log('🔑 Saisie mot de passe');

    cy.get(getSelector(AUTH_SELECTORS.INPUT_PASSWORD, version))
      .should('be.visible')
      .clear()
      .type(password);
  }

  /**
   * Clique sur le bouton de connexion.
   */
  static cliquerConnexion(version: Version): void {
    cy.log('🖱️ Clic bouton connexion');

    cy.get(getSelector(AUTH_SELECTORS.BTN_CONNEXION, version)).click();
  }

  /**
   * Enchaîne les étapes de connexion.
   */
  static seConnecter(version: Version, email: string, password: string): void {
    cy.log(`🔐 Connexion avec ${email}`);

    AuthPrimitives.saisirEmail(version, email);
    AuthPrimitives.saisirPassword(version, password);
    AuthPrimitives.cliquerConnexion(version);
    cy.wait(3000);
  }

  /**
   * Ouvre la page de connexion puis s'authentifie.
   */
  static authentifierComplet(version: Version): void {
    AuthPrimitives.naviguerPageConnexion(version);
    AuthPrimitives.seConnecter(
      version,
      AUTH_CREDENTIALS.VALID.email,
      AUTH_CREDENTIALS.VALID.password
    );
  }

  // Déconnexion.

  /**
   * Ferme la session en cours.
   */
  static seDeconnecter(version: Version): void {
    cy.log('🚪 Déconnexion');

    if (version === 'v1') {
      // En v1, la déconnexion passe par le menu utilisateur.
      cy.get('mat-icon').contains('keyboard_arrow_down')
        .should('be.visible')
        .click({ force: true });
      cy.contains(getSelector(AUTH_SELECTORS.DECONNEXION_TEXT, version))
        .should('be.visible')
        .click({ force: true });
    } else {
      // En v2, on utilise les contrôles dédiés du header.
      cy.get(getSelector(AUTH_SELECTORS.MENU_UTILISATEUR, version)).click();
      cy.get(getSelector(AUTH_SELECTORS.BTN_DECONNEXION, version)).click();
    }

    cy.wait(2000);
  }

  // Vérifications.

  /**
   * Vérifie un élément soit par sélecteur, soit par texte.
   * La v1 s'appuie plus souvent sur du texte, la v2 sur des `data-testid`.
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
   * Vérifie que l'utilisateur n'est plus sur l'écran de connexion.
   */
  static verifierAuthentificationReussie(version: Version): void {
    cy.log('✅ Vérification authentification réussie');

    cy.url({ timeout: 20000 }).should('not.include', getSelector(AUTH_URLS.URL_LOGIN, version));
    AuthPrimitives.verifierElement(version, AUTH_SELECTORS.APP_LOADED, AUTH_SELECTORS.APP_LOADED_TEXT);
  }

  /**
   * Vérifie que l'espace personnel est affiché.
   */
  static verifierEspacePersonnel(version: Version): void {
    cy.log('✅ Vérification espace personnel');

    AuthPrimitives.verifierElement(version, AUTH_SELECTORS.ESPACE_PERSONNEL, AUTH_SELECTORS.ESPACE_PERSONNEL_TEXT);
  }

  /**
   * Vérifie l'erreur liée à des identifiants invalides.
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
   * Vérifie l'erreur liée à un compte inexistant.
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
   * Vérifie qu'aucune redirection n'a eu lieu.
   */
  static verifierResteSurPageConnexion(version: Version): void {
    cy.log('❌ Vérification reste sur page connexion');

    cy.url().should('include', getSelector(AUTH_URLS.URL_LOGIN, version));
  }

  /**
   * Vérifie le retour vers la page de connexion.
   */
  static verifierRedirectionPageConnexion(version: Version): void {
    cy.log('➡️ Vérification redirection page connexion');

    cy.url({ timeout: 10000 }).should('include', getSelector(AUTH_URLS.URL_LOGIN, version));
  }

  /**
   * Vérifie que la session est bien terminée.
   */
  static verifierSessionTerminee(version: Version): void {
    cy.log('🔒 Vérification session terminée');

    cy.url().should('include', getSelector(AUTH_URLS.URL_LOGIN, version));
  }
}
