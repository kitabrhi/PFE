import {
    Version, getSelector,
    SECTION_ADMIN
  } from '../../config/admin/selectors-admin.config'
  
  export class AdminPrimitives {
 
    // ─── Utilitaires ──────────────────────────────────────────────
   
    private static attendreChargement(): void {
      cy.wait(2000);
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
      // vérifier via le champ de recherche (name="searchTerm") au lieu du titre
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
      // après envoi, le champ devrait se vider ou un message de succès apparaît
      cy.get('body').should('not.contain.text', 'Erreur');
    }
   
    static verifierErreurEmailInvalide(): void {
      cy.log('Vérification erreur email invalide');
      // le formulaire a la classe ng-invalid quand l'email est invalide
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
      // attendre que la recherche soit terminée
      cy.wait(2000);
      // vérifier que la grille est vide ou n'existe pas
      cy.get('body').then($body => {
        const cards = $body.find('mat-card.result-card');
        expect(cards.length).to.equal(0);
      });
    }
   
    static verifierStatutCV(nom: string, statut: string): void {
      cy.log(`Vérification statut "${statut}" pour "${nom}"`);
      // chercher parmi TOUTES les cartes celle qui contient le nom ET le statut
      cy.get('mat-card.result-card', { timeout: 10000 }).then($cards => {
        const matchingCard = $cards.filter((_i, card) => {
          const text = card.textContent || '';
          const contientNom = text.toLowerCase().includes(nom.toLowerCase());
          const contientStatut = text.toLowerCase().includes(statut.toLowerCase());
          return contientNom && contientStatut;
        });
        expect(matchingCard.length, `Aucune carte "${nom}" avec statut "${statut}" trouvée`)
          .to.be.greaterThan(0);
      });
    }
   
    // ─── Actions sur les cartes CV ────────────────────────────────
   
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
   
    static cliquerSupprimerCV(version: Version, nom: string): void {
      cy.log(`Supprimer CV de "${nom}"`);
   
      cy.contains('mat-card, .cv-card, .card', nom, { timeout: 10000 })
        .scrollIntoView()
        .within(() => {
          cy.get(getSelector(SECTION_ADMIN.BTN_CARTE_SUPPRIMER, version))
            .click({ force: true });
        });
   
      AdminPrimitives.attendreChargement();
    }
  }
   