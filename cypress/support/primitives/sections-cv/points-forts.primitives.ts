import {
    Version, getSelector,
    SECTION_POINTS_FORTS
  } from '../../config/section/selectors-points-forts.config';
  
  const FIXTURE_POINT_FORT = 'Cadrage stratégique';
  const FIXTURE_POINT_FORT_MODIFIE = 'Gestion de projet Agile';
  
  export class PointsFortsPrimitives {
  
    private static attendreAutoSave(): void {
      cy.log('⏳ Attente sauvegarde automatique...');
      cy.wait(2500);
    }
  
    // ─── Trouver une ligne ────────────────────────────────────────────────
  
    static trouverLigneParTexte(version: Version, texte: string): void {
      cy.log(`🔍 Recherche ligne point fort "${texte}"`);
  
      const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, version);
      const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === texte)
          .first()
          .closest(rowSelector)
          .first()
          .scrollIntoView()
          .as('lignePointFort');
      } else {
        cy.contains(rowSelector, texte).scrollIntoView().as('lignePointFort');
      }
    }
  
    // ─── Ajouter ──────────────────────────────────────────────────────────
  
    static ajouterPointFort(version: Version, texte: string = FIXTURE_POINT_FORT): void {
      cy.log(`➕ Ajout point fort "${texte}"`);
  
      const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, version);
      const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`)
          .filter((_i, el) => (el as HTMLInputElement).value === '')
          .first()
          .scrollIntoView()
          .clear()
          .type(texte)
          .blur();
  
        cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === texte)
          .should('have.length.greaterThan', 0);
      } else {
        cy.get(rowSelector).last().scrollIntoView().within(() => {
          cy.get(inputSelector).clear().type(texte).blur();
        });
      }
  
      PointsFortsPrimitives.attendreAutoSave();
      cy.log(`✅ Point fort "${texte}" ajouté`);
    }
  
    // ─── Modifier ─────────────────────────────────────────────────────────
  
    static modifierPointFort(version: Version, ancien: string, nouveau: string = FIXTURE_POINT_FORT_MODIFIE): void {
      cy.log(`✏️ Modification "${ancien}" → "${nouveau}"`);
  
      const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, version);
      const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === ancien)
          .first()
          .scrollIntoView()
          .clear()
          .type(nouveau)
          .blur();
      } else {
        PointsFortsPrimitives.trouverLigneParTexte(version, ancien);
        cy.get('@lignePointFort').scrollIntoView().within(() => {
          cy.get(inputSelector).clear().type(nouveau).blur();
        });
      }
  
      PointsFortsPrimitives.attendreAutoSave();
      cy.log(`✅ Point fort modifié`);
    }
  
    // ─── Supprimer ────────────────────────────────────────────────────────
  
    static supprimerPointFort(version: Version, texte: string): void {
      cy.log(`🗑️ Suppression point fort "${texte}"`);
  
      const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, version);
      const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, version);
  
      if (version === 'v1') {
        const supprimerSiExiste = () => {
          cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
            const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === texte);
            if (found.length > 0) {
              cy.wrap(found.first()).closest(rowSelector).first().scrollIntoView().within(() => {
                cy.get(getSelector(SECTION_POINTS_FORTS.BTN_MENU_CONTEXTUEL, version)).click({ force: true });
              });
              cy.get('.mat-mdc-menu-panel').should('be.visible').contains('button', 'Supprimer').click();
              cy.wait(2500).then(() => supprimerSiExiste());
            } else {
              cy.log(`✅ "${texte}" supprimé`);
            }
          });
        };
        supprimerSiExiste();
      } else {
        PointsFortsPrimitives.trouverLigneParTexte(version, texte);
        cy.get('@lignePointFort').scrollIntoView().within(() => {
          cy.get('[data-testid="point-fort-delete-button"]').click();
        });
        PointsFortsPrimitives.attendreAutoSave();
      }
    }
  
    // ─── Toggle visibilité ────────────────────────────────────────────────
  
    static toggleVisibilite(version: Version, texte: string, activer: boolean): void {
      cy.log(`${activer ? '✅' : '⬜'} ${activer ? 'Rendre visible' : 'Masquer'} "${texte}"`);
  
      PointsFortsPrimitives.trouverLigneParTexte(version, texte);
  
      cy.get('@lignePointFort').scrollIntoView().within(() => {
        const sel = getSelector(SECTION_POINTS_FORTS.COL_AFFICHER, version);
        cy.get(sel).find('input[type="checkbox"]').then($input => {
          const isChecked = $input.is(':checked');
          if ((activer && !isChecked) || (!activer && isChecked)) {
            cy.get(sel).find('input[type="checkbox"]').click({ force: true });
          }
        });
      });
  
      PointsFortsPrimitives.attendreAutoSave();
    }
  
    // ─── Vérifications ────────────────────────────────────────────────────
  
    static verifierExiste(version: Version, texte: string): void {
      const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, version);
      const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === texte)
          .should('have.length.greaterThan', 0);
      } else {
        cy.contains(rowSelector, texte).scrollIntoView().should('exist');
      }
    }
  
    static verifierAbsent(version: Version, texte: string): void {
      const rowSelector = getSelector(SECTION_POINTS_FORTS.ROW, version);
      const inputSelector = getSelector(SECTION_POINTS_FORTS.INPUT_POINT_FORT, version);
  
      if (version === 'v1') {
        cy.wait(3000);
        cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
          const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === texte);
          expect(found.length).to.equal(0);
        });
      } else {
        cy.contains(rowSelector, texte).should('not.exist');
      }
    }
  
    static verifierVisibilite(version: Version, texte: string, attenduVisible: boolean): void {
      PointsFortsPrimitives.trouverLigneParTexte(version, texte);
      cy.get('@lignePointFort').scrollIntoView().within(() => {
        cy.get(getSelector(SECTION_POINTS_FORTS.COL_AFFICHER, version))
          .find('input[type="checkbox"]')
          .then($input => expect($input.is(':checked')).to.equal(attenduVisible));
      });
    }
  }