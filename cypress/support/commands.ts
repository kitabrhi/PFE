/// <reference types="cypress" />
import 'cypress-wait-until';

/**
 * Commandes Cypress ajoutees pour les tests du projet.
 */

/**
 * Lance la connexion Azure AD B2C avec les identifiants donnes.
 */
function loginViaAAD(username: string, password: string): void {
  // La redirection MSAL génère automatiquement les paramètres OAuth (code_challenge, nonce, state)
  cy.visit('/');
 
  // La saisie du formulaire se fait dans le domaine Azure B2C.
  cy.origin(
    'https://redsumeb2c.b2clogin.com',
    {
      args: {
        username,
        password,
      },
    },
    ({ username, password }: { username: string; password: string }) => {
      cy.get('input[id="signInName"]').type(username, {
        log: false,
      });
      cy.get('input[id="password"]').type(password, {
        log: false,
      });
      cy.get('button[type="submit"]').click();
    }
  );
 
  cy.url().should('include', '/home');
}

/**
 * Expose la connexion Azure AD B2C comme commande Cypress.
 */
Cypress.Commands.add('loginViaAAD', (username: string, password: string): void => {
  cy.session([username, password], () => {
    const log = Cypress.log({
      displayName: 'Azure Active Directory Login',
      message: [`Authenticating | ${username}`],
      autoEnd: false,
    });
    log.snapshot('before');
 
    loginViaAAD(username, password);
 
    log.snapshot('after');
    log.end();
  });
});

/**
 * Declaration TypeScript de la commande personnalisee.
 */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Connexion via Azure Active Directory B2C.
       */
      loginViaAAD(username: string, password: string): Chainable<void>;
    }
  }
}

export {};
