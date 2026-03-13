import {
    Version, getSelector,
    SECTION_COMPETENCES
  } from '../../config/section/selectors-competences.config';
  
  const FIXTURE_COMPETENCE = { nom: 'Angular', experience: '3 ANS' };
  const FIXTURE_COMPETENCE_MODIFIE = { nom: 'React', experience: '> 5 ANS' };
  
  export class CompetencesPrimitives {
  
    private static attendreAutoSave(): void {
      cy.log('⏳ Attente sauvegarde automatique...');
      cy.wait(2500);
    }
  
    // ─── Trouver une ligne ────────────────────────────────────────────────
  
    static trouverLigneParNom(version: Version, nom: string): void {
      cy.log(`🔍 Recherche ligne compétence "${nom}"`);
  
      const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
      const inputSelector = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === nom)
          .first()
          .closest(rowSelector)
          .first()
          .scrollIntoView()
          .as('ligneCompetence');
      } else {
        cy.contains(rowSelector, nom).scrollIntoView().as('ligneCompetence');
      }
    }
  
    // ─── Ajouter ──────────────────────────────────────────────────────────
  
    static ajouterCompetence(
      version: Version,
      nom: string = FIXTURE_COMPETENCE.nom,
      experience: string = FIXTURE_COMPETENCE.experience
    ): void {
      cy.log(`➕ Ajout compétence "${nom}" — ${experience}`);
  
      const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
      const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
      const selectExp = getSelector(SECTION_COMPETENCES.SELECT_EXPERIENCE, version);
  
      if (version === 'v1') {
        // Trouver la ligne vide.
        cy.get(`${rowSelector} ${inputComp}`)
          .filter((_i, el) => (el as HTMLInputElement).value === '')
          .first()
          .scrollIntoView()
          .clear()
          .type(nom)
          .blur();
  
        // Sélectionner l'expérience dans la même ligne.
        cy.get(`${rowSelector} ${inputComp}`)
          .filter((_i, el) => (el as HTMLInputElement).value === nom)
          .first()
          .closest(rowSelector)
          .within(() => {
            cy.get(selectExp).click({ force: true });
          });
  
        // L'overlay du mat-select est en dehors du row.
        cy.get('.mat-mdc-select-panel')
          .should('be.visible')
          .contains('mat-option', experience)
          .click();
  
        CompetencesPrimitives.attendreAutoSave();
  
        // Vérifier.
        cy.get(`${rowSelector} ${inputComp}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === nom)
          .should('have.length.greaterThan', 0);
  
      } else {
        cy.get(rowSelector).last().scrollIntoView().within(() => {
          cy.get(inputComp).clear().type(nom).blur();
          cy.get(selectExp).select(experience);
        });
        CompetencesPrimitives.attendreAutoSave();
      }
  
      cy.log(`✅ Compétence "${nom}" ajoutée`);
    }
  
    // ─── Modifier ─────────────────────────────────────────────────────────
  
    static modifierCompetence(
      version: Version,
      ancienNom: string,
      nouveauNom: string = FIXTURE_COMPETENCE_MODIFIE.nom,
      nouvelleExp: string = FIXTURE_COMPETENCE_MODIFIE.experience
    ): void {
      cy.log(`✏️ Modification "${ancienNom}" → "${nouveauNom}" (${nouvelleExp})`);
  
      const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
      const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
      const selectExp = getSelector(SECTION_COMPETENCES.SELECT_EXPERIENCE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputComp}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === ancienNom)
          .first()
          .scrollIntoView()
          .clear()
          .type(nouveauNom)
          .blur();
  
        cy.get(`${rowSelector} ${inputComp}`)
          .filter((_i, el) => (el as HTMLInputElement).value === nouveauNom)
          .first()
          .closest(rowSelector)
          .within(() => {
            cy.get(selectExp).click({ force: true });
          });
  
        cy.get('.mat-mdc-select-panel')
          .should('be.visible')
          .contains('mat-option', nouvelleExp)
          .click();
  
        CompetencesPrimitives.attendreAutoSave();
  
      } else {
        CompetencesPrimitives.trouverLigneParNom(version, ancienNom);
        cy.get('@ligneCompetence').scrollIntoView().within(() => {
          cy.get(inputComp).clear().type(nouveauNom).blur();
          cy.get(selectExp).select(nouvelleExp);
        });
        CompetencesPrimitives.attendreAutoSave();
      }
  
      cy.log(`✅ Compétence modifiée`);
    }
  
    // ─── Supprimer ────────────────────────────────────────────────────────
  
    static supprimerCompetence(version: Version, nom: string): void {
      cy.log(`🗑️ Suppression compétence "${nom}"`);
  
      const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
      const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
  
      if (version === 'v1') {
        const supprimerSiExiste = () => {
          cy.get(`${rowSelector} ${inputComp}`).then($inputs => {
            const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
            if (found.length > 0) {
              cy.wrap(found.first()).closest(rowSelector).first().scrollIntoView().within(() => {
                cy.get(getSelector(SECTION_COMPETENCES.BTN_MENU_CONTEXTUEL, version)).click({ force: true });
              });
              cy.get('.mat-mdc-menu-panel').should('be.visible').contains('button', 'Supprimer').click();
              cy.wait(2500).then(() => supprimerSiExiste());
            } else {
              cy.log(`✅ "${nom}" supprimé`);
            }
          });
        };
        supprimerSiExiste();
      } else {
        CompetencesPrimitives.trouverLigneParNom(version, nom);
        cy.get('@ligneCompetence').scrollIntoView().within(() => {
          cy.get(getSelector(SECTION_COMPETENCES.BTN_SUPPRIMER, version)).click();
        });
        CompetencesPrimitives.attendreAutoSave();
      }
    }
  
    // ─── Toggle visibilité ────────────────────────────────────────────────
  
    static toggleVisibilite(version: Version, nom: string, activer: boolean): void {
      cy.log(`${activer ? '✅' : '⬜'} ${activer ? 'Rendre visible' : 'Masquer'} "${nom}"`);
  
      CompetencesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneCompetence').scrollIntoView().within(() => {
        const sel = getSelector(SECTION_COMPETENCES.COL_AFFICHER, version);
        cy.get(sel).find('input[type="checkbox"]').then($input => {
          const isChecked = $input.is(':checked');
          if ((activer && !isChecked) || (!activer && isChecked)) {
            cy.get(sel).find('input[type="checkbox"]').click({ force: true });
          }
        });
      });
  
      CompetencesPrimitives.attendreAutoSave();
    }
  
    // ─── Vérifications ────────────────────────────────────────────────────
  
    static verifierExiste(version: Version, nom: string): void {
      const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
      const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputComp}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === nom)
          .should('have.length.greaterThan', 0);
      } else {
        cy.contains(rowSelector, nom).scrollIntoView().should('exist');
      }
    }
  
    static verifierAbsente(version: Version, nom: string): void {
      const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
      const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
  
      if (version === 'v1') {
        cy.wait(3000);
        cy.get(`${rowSelector} ${inputComp}`).then($inputs => {
          const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
          expect(found.length).to.equal(0);
        });
      } else {
        cy.contains(rowSelector, nom).should('not.exist');
      }
    }
  
    static verifierVisibilite(version: Version, nom: string, attenduVisible: boolean): void {
      CompetencesPrimitives.trouverLigneParNom(version, nom);
      cy.get('@ligneCompetence').scrollIntoView().within(() => {
        cy.get(getSelector(SECTION_COMPETENCES.COL_AFFICHER, version))
          .find('input[type="checkbox"]')
          .then($input => expect($input.is(':checked')).to.equal(attenduVisible));
      });
    }
  }