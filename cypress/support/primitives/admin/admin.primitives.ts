import {
  Version,
  getSelector,
  SECTION_ADMIN
} from '../../config/admin/selectors-admin.config';

export class AdminPrimitives {

  // ─── Utilitaires ──────────────────────────────────────────────

  private static attendreChargement(): void {
    cy.wait(4000);
  }

  /**
   * Garde de sécurité : empêche toute action destructive sur la prod.
   */
  private static verifierEnvironnementNonProd(): void {
    const baseUrl = Cypress.config('baseUrl') || '';
    if (baseUrl.includes('prod')) {
      throw new Error(
        '⛔ Action destructive interdite sur l\'environnement de production'
      );
    }
  }

  /**
   * Trouve la carte CV de l'utilisateur de test courant via son email unique.
   * Garantit qu'une seule carte est sélectionnée (sécurité anti-collision
   * avec d'autres utilisateurs réels portant le même prénom)/...
   */
  private static trouverMaCarteCV(): Cypress.Chainable<JQuery<HTMLElement>> {
    const monEmail = Cypress.env('TEST_USER_EMAIL');
    if (!monEmail) {
      throw new Error('TEST_USER_EMAIL non défini dans cypress.env.json');
    }
  
    return cy.get('mat-card.result-card', { timeout: 10000 })
      .filter((_i, card) => {
        const texte = card.innerText;
        return texte.includes(`Propriétaire : ${monEmail}`);
      })
      .should('have.length.at.least', 1)
      .first();
  }
  // ─── Navigation ───────────────────────────────────────────────

  static naviguerVersInvitation(version: Version): void {
    cy.log('Navigation vers Invitation Candidat');
    cy.contains('.mat-sidenav a', 'Invitation Candidat', { timeout: 10000 })
      .scrollIntoView()
      .click({ force: true });
    cy.wait(1000);
    cy.contains('Invitation Candidat', { timeout: 10000 }).should('be.visible');
  }

  static naviguerVersRechercheCV(version: Version): void {
    cy.log('Navigation vers Recherche CV');
    cy.contains('.mat-sidenav a', 'Recherche CV', { timeout: 10000 })
      .scrollIntoView()
      .click({ force: true });
    cy.wait(1000);
    cy.get('input[name="searchTerm"]', { timeout: 10000 }).should('exist');
  }

  // ─── Invitation Candidat ──────────────────────────────────────

  static envoyerInvitation(version: Version, email: string): void {
    cy.log(`Envoi invitation à "${email}"`);

    const inputSel = getSelector(SECTION_ADMIN.INPUT_EMAIL_INVITATION, version);
    const btnSel = getSelector(SECTION_ADMIN.BTN_ENVOYER_INVITATION, version);

    cy.get(inputSel, { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(email, { delay: 50 });

    cy.get(btnSel, { timeout: 10000 })
      .scrollIntoView()
      .click({ force: true });

    AdminPrimitives.attendreChargement();
  }

  static verifierInvitationEnvoyee(): void {
    cy.log('Vérification invitation envoyée');
    cy.get('body').should('not.contain.text', 'Erreur');
  }

  static verifierErreurEmailInvalide(): void {
    cy.log('Vérification erreur email invalide');
    const formSel = 'red-user-invitation form';
    cy.get(formSel, { timeout: 10000 }).should('have.class', 'ng-invalid');
  }

  static verifierChampEmailVide(): void {
    cy.log('Vérification champ email vide après envoi');
    cy.get('input.input-invit', { timeout: 10000 })
      .should('have.value', '');
  }

  // ─── Recherche CV ─────────────────────────────────────────────

  static rechercherCV(version: Version, terme: string): void {
    cy.log(`Recherche CV avec "${terme}"`);

    const inputSel = getSelector(SECTION_ADMIN.INPUT_RECHERCHE, version);
    const btnSel = getSelector(SECTION_ADMIN.BTN_RECHERCHE, version);

    cy.get(inputSel, { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(terme, { delay: 50 });

    cy.get(btnSel, { timeout: 10000 })
      .scrollIntoView()
      .click({ force: true });

    AdminPrimitives.attendreChargement();
  }

  static verifierResultatsAffiches(): void {
    cy.log('Vérification résultats affichés');
    cy.get('mat-card.result-card', { timeout: 15000 })
      .should('have.length.greaterThan', 0);
  }

  static verifierResultatContient(nom: string): void {
    cy.log(`Vérification résultat contient "${nom}"`);
    cy.get('div.results-grid', { timeout: 10000 })
      .should('contain.text', nom);
  }

  static verifierNombreResultats(nombreMin: number): void {
    cy.log(`Vérification au moins ${nombreMin} résultat(s)`);
    cy.get('mat-card.result-card', { timeout: 15000 })
      .should('have.length.gte', nombreMin);
  }

  static verifierAucunResultat(): void {
    cy.log('Vérification aucun résultat');
    cy.wait(4000);
    cy.get('body').then($body => {
      const cards = $body.find('mat-card.result-card');
      expect(cards.length).to.equal(0);
    });
  }

  static verifierStatutCV(nom: string, statut: string): void {
    cy.log(`Vérification statut "${statut}" pour "${nom}"`);

    const normaliser = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    cy.get('mat-card.result-card', { timeout: 10000 }).then($cards => {
      const nomNorm = normaliser(nom);
      const statutNorm = normaliser(statut);

      const matchingCard = $cards.filter((_i, card) => {
        const texte = normaliser(card.textContent || '');
        return texte.includes(nomNorm) && texte.includes(statutNorm);
      });

      expect(
        matchingCard.length,
        `Aucune carte "${nom}" avec statut "${statut}" trouvée`
      ).to.be.greaterThan(0);
    });
  }

  static verifierCVExistePourNom(nom: string): void {
    cy.log(`Vérification qu'un CV existe pour "${nom}"`);
    cy.get('mat-card.result-card', { timeout: 10000 })
      .contains(nom, { matchCase: false })
      .should('be.visible');
  }

  // ─── Actions génériques sur les cartes CV (par nom) ──────────
  // ⚠️ À éviter pour Modifier/Supprimer si plusieurs utilisateurs
  //    peuvent partager le même nom. Préférer les variantes "Mon CV".

  static cliquerVoirCV(version: Version, nom: string): void {
    cy.log(`Voir CV de "${nom}"`);

    cy.contains('mat-card, .cv-card, .card', nom, { timeout: 10000 })
      .scrollIntoView()
      .within(() => {
        cy.get(getSelector(SECTION_ADMIN.BTN_CARTE_VOIR, version))
          .click({ force: true });
      });

    AdminPrimitives.attendreChargement();
  }

  static cliquerModifierCV(version: Version, nom: string): void {
    cy.log(`Modifier CV de "${nom}"`);

    cy.contains('mat-card, .cv-card, .card', nom, { timeout: 10000 })
      .scrollIntoView()
      .within(() => {
        cy.get(getSelector(SECTION_ADMIN.BTN_CARTE_MODIFIER, version))
          .click({ force: true });
      });

    AdminPrimitives.attendreChargement();
  }

  // ─── Actions sécurisées sur MON propre CV (par email unique) ──

  static cliquerVoirMonCV(version: Version): void {
    cy.log('Voir mon CV');
    AdminPrimitives.trouverMaCarteCV().within(() => {
      cy.get(getSelector(SECTION_ADMIN.BTN_CARTE_VOIR, version))
        .click({ force: true });
    });
    AdminPrimitives.attendreChargement();
  }

  static cliquerModifierMonCV(version: Version): void {
    cy.log('Modifier mon CV');
    AdminPrimitives.trouverMaCarteCV().within(() => {
      cy.get(getSelector(SECTION_ADMIN.BTN_CARTE_MODIFIER, version))
        .click({ force: true });
    });
    AdminPrimitives.attendreChargement();
  }

  static cliquerSupprimerMonCV(version: Version): void {
    AdminPrimitives.verifierEnvironnementNonProd();
    cy.log('Suppression de mon CV');

    AdminPrimitives.trouverMaCarteCV().within(() => {
      cy.get(getSelector(SECTION_ADMIN.BTN_CARTE_SUPPRIMER, version))
        .click({ force: true });
    });

    AdminPrimitives.attendreChargement();
  }

  // ─── Suppression générique (sécurisée par email) ──────────────
  // Conservée pour compatibilité avec les steps existants, mais
  // utilise en interne le filtrage par email pour rester sûre.

  static cliquerSupprimerCV(version: Version, _nom: string): void {
    AdminPrimitives.cliquerSupprimerMonCV(version);
  }
}