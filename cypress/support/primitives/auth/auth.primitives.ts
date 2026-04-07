// Helpers d'authentification pour les versions v1 et v2.

import {
  Version,
  getSelector,
  AUTH_URLS,
  AUTH_SELECTORS,
  AUTH_CREDENTIALS
} from '../../config/auth/selectors-auth.config';

export class AuthPrimitives {
  // Navigation
  static naviguerPageConnexion(version: Version): void {
    cy.log('Navigation vers page de connexion');

    cy.visit(getSelector(AUTH_URLS.BASE, version));

    AuthPrimitives.verifierElement(version, AUTH_SELECTORS.PAGE_LOGIN_VISIBLE, AUTH_SELECTORS.PAGE_LOGIN_TEXT);
  }

  static tenterAccesPageProtegee(version: Version): void {
    cy.log('Tentative accès page protégée');

    cy.visit(getSelector(AUTH_URLS.PAGE_PROTEGEE, version), {
      failOnStatusCode: false
    });
  }

  // Session

  // on vide les cookies et le localStorage pour repartir propre
  static nettoyerSession(): void {
    cy.log('Nettoyage session');
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.log('Session nettoyée');
  }

  // Connexion

  static saisirEmail(version: Version, email: string): void {
    cy.log(`Saisie email: ${email}`);

    cy.get(getSelector(AUTH_SELECTORS.INPUT_EMAIL, version), { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type(email);
  }

  static saisirPassword(version: Version, password: string): void {
    cy.log('Saisie mot de passe');

    cy.get(getSelector(AUTH_SELECTORS.INPUT_PASSWORD, version))
      .should('be.visible')
      .clear()
      .type(password);
  }

  static cliquerConnexion(version: Version): void {
    cy.log('Clic bouton connexion');

    cy.get(getSelector(AUTH_SELECTORS.BTN_CONNEXION, version)).click();
  }

  static seConnecter(version: Version, email: string, password: string): void {
    cy.log(`Connexion avec ${email}`);

    AuthPrimitives.saisirEmail(version, email);
    AuthPrimitives.saisirPassword(version, password);
    AuthPrimitives.cliquerConnexion(version);
    cy.wait(3000);
  }

  // Scénarios prêts à l'emploi

  static seConnecterCompteValide(version: Version): void {
    AuthPrimitives.seConnecter(
      version,
      AUTH_CREDENTIALS.VALID.email,
      AUTH_CREDENTIALS.VALID.password
    );
  }

  static seConnecterIdentifiantsIncorrects(version: Version): void {
    AuthPrimitives.seConnecter(
      version,
      AUTH_CREDENTIALS.INVALID.email,
      AUTH_CREDENTIALS.INVALID.password
    );
  }

  static seConnecterEmailInexistant(version: Version): void {
    AuthPrimitives.seConnecter(
      version,
      AUTH_CREDENTIALS.EMAIL_INVALIDE.email,
      AUTH_CREDENTIALS.EMAIL_INVALIDE.password
    );
  }

  static authentifierComplet(version: Version): void {
    AuthPrimitives.naviguerPageConnexion(version);
    AuthPrimitives.seConnecterCompteValide(version);
  }

  // Déconnexion

  static seDeconnecter(version: Version): void {
    cy.log('Déconnexion');

    if (version === 'v1') {
      cy.get('mat-icon').contains('keyboard_arrow_down')
        .should('be.visible')
        .click({ force: true });
      cy.contains(getSelector(AUTH_SELECTORS.DECONNEXION_TEXT, version))
        .should('be.visible')
        .click({ force: true });
    } else {
      cy.get(getSelector(AUTH_SELECTORS.MENU_UTILISATEUR, version)).click();
      cy.get(getSelector(AUTH_SELECTORS.BTN_DECONNEXION, version)).click();
    }

    cy.wait(2000);
  }

  // vérifie un élément soit par sélecteur soit par texte selon la version
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

  // factorise la logique commune à toutes les erreurs de connexion
  private static verifierErreur(
    version: Version,
    selectorMap: { v1: string; v2: string },
    textMap: { v1: string; v2: string },
    timeout: number = 5000
  ): void {
    const selector = getSelector(selectorMap, version);
    const text = getSelector(textMap, version);

    if (selector) {
      cy.get(selector, { timeout }).should('contain', text);
    } else {
      cy.contains(text, { timeout }).should('be.visible');
    }
  }

  static verifierAuthentificationReussie(version: Version): void {
    cy.log('Vérification authentification réussie');

    cy.url({ timeout: 20000 }).should('not.include', getSelector(AUTH_URLS.URL_LOGIN, version));
    AuthPrimitives.verifierElement(version, AUTH_SELECTORS.APP_LOADED, AUTH_SELECTORS.APP_LOADED_TEXT);
  }

  static verifierEspacePersonnel(version: Version): void {
    cy.log('Vérification espace personnel');

    AuthPrimitives.verifierElement(version, AUTH_SELECTORS.ESPACE_PERSONNEL, AUTH_SELECTORS.ESPACE_PERSONNEL_TEXT);
  }

  static verifierErreurIdentifiants(version: Version): void {
    cy.log('Vérification erreur identifiants');

    AuthPrimitives.verifierErreur(
      version,
      AUTH_SELECTORS.ERROR_IDENTIFIANTS,
      AUTH_SELECTORS.ERROR_IDENTIFIANTS_TEXT
    );
  }

  static verifierErreurCompteInexistant(version: Version): void {
    cy.log('Vérification erreur compte inexistant');

    AuthPrimitives.verifierErreur(
      version,
      AUTH_SELECTORS.ERROR_COMPTE_INEXISTANT,
      AUTH_SELECTORS.ERROR_COMPTE_INEXISTANT_TEXT
    );
  }

  // couvre : reste sur la page de connexion, redirigé, session terminée, accès refusé
  static verifierSurPageConnexion(version: Version, timeout: number = 10000): void {
    cy.log('Vérification présence sur page de connexion');

    cy.url({ timeout }).should('include', getSelector(AUTH_URLS.URL_LOGIN, version));
  }
}
