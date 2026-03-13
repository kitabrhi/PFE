import {
    Version, getSelector,
    SECTION_LANGUES
  } from '../../config/section/selectors-langues.config';
  
  // ─── Fixtures ────────────────────────────────────────────────────────────────
  
  const FIXTURE_LANGUE = { nom: 'Français', niveau: 'Langue maternelle' };
  const FIXTURE_LANGUE_2 = { nom: 'Anglais', niveau: 'C1' };
  
  // ═════════════════════════════════════════════════════════════════════════════
  //  CLASSE PRIMITIVES
  // ═════════════════════════════════════════════════════════════════════════════
  
  export class LanguesPrimitives {
  
    private static attendreAutoSave(): void {
      cy.log('⏳ Attente sauvegarde automatique...');
      cy.wait(2500);
    }
  
    // ─── Trouver une ligne par nom de langue ──────────────────────────────
  
    static trouverLigneParNom(version: Version, nom: string): void {
      cy.log(`🔍 Recherche ligne langue "${nom}"`);
  
      const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
      const inputSelector = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
          .filter((_index, el) => (el as HTMLInputElement).value === nom)
          .first()
          .closest(rowSelector)
          .first()
          .scrollIntoView()
          .as('ligneLangue');
      } else {
        cy.contains(rowSelector, nom).scrollIntoView().as('ligneLangue');
      }
    }
  
    static trouverDerniereLigneVide(version: Version): void {
      cy.log('🔍 Recherche dernière ligne vide');
  
      const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
      const inputSelector = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`)
          .filter((_index, el) => (el as HTMLInputElement).value === '')
          .first()
          .closest(rowSelector)
          .scrollIntoView()
          .as('ligneLangueVide');
      } else {
        cy.get(rowSelector).last().scrollIntoView().as('ligneLangueVide');
      }
    }
  
    // ─── Ajouter une langue ───────────────────────────────────────────────
  
    static ajouterLangue(
      version: Version,
      nom: string = FIXTURE_LANGUE.nom,
      niveau: string = FIXTURE_LANGUE.niveau
    ): void {
      cy.log(`➕ Ajout langue "${nom}" — niveau ${niveau}`);
  
      const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
      const inputLangue = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);
      const selectNiveau = getSelector(SECTION_LANGUES.SELECT_NIVEAU, version);
  
      if (version === 'v1') {
        // Trouver la ligne vide et saisir le nom.
        cy.get(`${rowSelector} ${inputLangue}`)
          .filter((_index, el) => (el as HTMLInputElement).value === '')
          .first()
          .scrollIntoView()
          .clear()
          .type(nom)
          .blur();
  
        // Retrouver la ligne par le nom pour sélectionner le niveau.
        cy.get(`${rowSelector} ${inputLangue}`)
          .filter((_index, el) => (el as HTMLInputElement).value === nom)
          .first()
          .closest(rowSelector)
          .within(() => {
            cy.get(selectNiveau).click({ force: true });
          });
  
        // L'overlay du mat-select est en dehors du row.
        cy.get('.mat-mdc-select-panel')
          .should('be.visible')
          .contains('mat-option', niveau)
          .click();
  
        LanguesPrimitives.attendreAutoSave();
  
        // Vérifier que la langue a été ajoutée.
        cy.get(`${rowSelector} ${inputLangue}`, { timeout: 10000 })
          .filter((_index, el) => (el as HTMLInputElement).value === nom)
          .should('have.length.greaterThan', 0);
  
      } else {
        LanguesPrimitives.trouverDerniereLigneVide(version);
        cy.get('@ligneLangueVide').scrollIntoView().within(() => {
          cy.get(inputLangue).clear().type(nom).blur();
          cy.get(selectNiveau).select(niveau);
        });
        LanguesPrimitives.attendreAutoSave();
      }
  
      cy.log(`✅ Langue "${nom}" ajoutée`);
    }
  
    // ─── Modifier une langue ──────────────────────────────────────────────
  
    static modifierLangue(
      version: Version,
      ancienNom: string,
      nouveauNom: string,
      nouveauNiveau: string
    ): void {
      cy.log(`✏️ Modification "${ancienNom}" → "${nouveauNom}" (${nouveauNiveau})`);
  
      const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
      const inputLangue = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);
      const selectNiveau = getSelector(SECTION_LANGUES.SELECT_NIVEAU, version);
  
      if (version === 'v1') {
        // Modifier le nom.
        cy.get(`${rowSelector} ${inputLangue}`, { timeout: 10000 })
          .filter((_index, el) => (el as HTMLInputElement).value === ancienNom)
          .first()
          .scrollIntoView()
          .clear()
          .type(nouveauNom)
          .blur();
  
        // Modifier le niveau dans la même ligne.
        cy.get(`${rowSelector} ${inputLangue}`)
          .filter((_index, el) => (el as HTMLInputElement).value === nouveauNom)
          .first()
          .closest(rowSelector)
          .within(() => {
            cy.get(selectNiveau).click({ force: true });
          });
  
        cy.get('.mat-mdc-select-panel')
          .should('be.visible')
          .contains('mat-option', nouveauNiveau)
          .click();
  
        LanguesPrimitives.attendreAutoSave();
  
      } else {
        LanguesPrimitives.trouverLigneParNom(version, ancienNom);
        cy.get('@ligneLangue').scrollIntoView().within(() => {
          cy.get(inputLangue).clear().type(nouveauNom).blur();
          cy.get(selectNiveau).select(nouveauNiveau);
        });
        LanguesPrimitives.attendreAutoSave();
      }
  
      cy.log(`✅ Langue modifiée`);
    }
  
    // ─── Supprimer une langue ─────────────────────────────────────────────
  
    static supprimerLangue(version: Version, nom: string): void {
      cy.log(`🗑️ Suppression langue "${nom}"`);
  
      const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
      const inputLangue = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);
  
      if (version === 'v1') {
        const supprimerSiExiste = () => {
          cy.get(`${rowSelector} ${inputLangue}`).then($inputs => {
            const found = $inputs.filter((_i, el) =>
              (el as HTMLInputElement).value === nom
            );
  
            if (found.length > 0) {
              cy.wrap(found.first())
                .closest(rowSelector)
                .first()
                .scrollIntoView()
                .within(() => {
                  cy.get(getSelector(SECTION_LANGUES.BTN_MENU_CONTEXTUEL, version))
                    .click({ force: true });
                });
  
              cy.get('.mat-mdc-menu-panel')
                .should('be.visible')
                .contains('button', 'Supprimer')
                .click();
  
              cy.wait(2500).then(() => supprimerSiExiste());
            } else {
              cy.log(`✅ Toutes les occurrences de "${nom}" supprimées`);
            }
          });
        };
  
        supprimerSiExiste();
  
      } else {
        LanguesPrimitives.trouverLigneParNom(version, nom);
        cy.get('@ligneLangue').scrollIntoView().within(() => {
          cy.get(getSelector(SECTION_LANGUES.BTN_SUPPRIMER, version)).click();
        });
        LanguesPrimitives.attendreAutoSave();
      }
    }
  
    // ─── Toggle visibilité ────────────────────────────────────────────────
  
    static toggleVisibilite(version: Version, nom: string, activer: boolean): void {
      const action = activer ? 'Rendre visible' : 'Masquer';
      cy.log(`${activer ? '✅' : '⬜'} ${action} langue "${nom}"`);
  
      LanguesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneLangue').scrollIntoView().within(() => {
        const checkboxSelector = getSelector(SECTION_LANGUES.COL_AFFICHER, version);
  
        cy.get(checkboxSelector)
          .find('input[type="checkbox"]')
          .then($input => {
            const isChecked = $input.is(':checked');
  
            if ((activer && !isChecked) || (!activer && isChecked)) {
              cy.get(checkboxSelector)
                .find('input[type="checkbox"]')
                .click({ force: true });
            }
          });
      });
  
      LanguesPrimitives.attendreAutoSave();
    }
  
    // ─── Changer l'ordre ──────────────────────────────────────────────────
  
    static changerOrdre(version: Version, nom: string, nouvelOrdre: number): void {
      cy.log(`🔢 Changer ordre langue "${nom}" → position ${nouvelOrdre}`);
  
      LanguesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneLangue').scrollIntoView().within(() => {
        cy.get(getSelector(SECTION_LANGUES.COL_ORDRE, version)).click();
      });
  
      if (version === 'v1') {
        cy.get('.mat-mdc-select-panel')
          .should('be.visible')
          .contains('mat-option', nouvelOrdre.toString())
          .click();
      } else {
        cy.get('@ligneLangue').scrollIntoView().within(() => {
          cy.get(getSelector(SECTION_LANGUES.COL_ORDRE, version))
            .select(nouvelOrdre.toString());
        });
      }
  
      LanguesPrimitives.attendreAutoSave();
    }
  
    // ═══════════════════════════════════════════════════════════════════════
    //  VÉRIFICATIONS
    // ═══════════════════════════════════════════════════════════════════════
  
    static verifierLangueExiste(version: Version, nom: string): void {
      cy.log(`🔍 Vérification existence langue "${nom}"`);
  
      const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
      const inputLangue = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputLangue}`, { timeout: 10000 })
          .filter((_index, el) => (el as HTMLInputElement).value === nom)
          .should('have.length.greaterThan', 0);
      } else {
        cy.contains(rowSelector, nom).scrollIntoView().should('exist').and('be.visible');
      }
    }
  
    static verifierLangueAbsente(version: Version, nom: string): void {
      cy.log(`🔍 Vérification absence langue "${nom}"`);
  
      const rowSelector = getSelector(SECTION_LANGUES.ROW, version);
      const inputLangue = getSelector(SECTION_LANGUES.INPUT_LANGUE, version);
  
      if (version === 'v1') {
        cy.wait(3000);
        cy.get(`${rowSelector} ${inputLangue}`)
          .then($inputs => {
            const found = $inputs.filter((_i, el) =>
              (el as HTMLInputElement).value === nom
            );
            expect(found.length).to.equal(0);
          });
      } else {
        cy.contains(rowSelector, nom).should('not.exist');
      }
    }
  
    static verifierVisibilite(version: Version, nom: string, attenduVisible: boolean): void {
      cy.log(`🔍 Vérification visibilité langue "${nom}" = ${attenduVisible}`);
  
      LanguesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneLangue').scrollIntoView().within(() => {
        cy.get(getSelector(SECTION_LANGUES.COL_AFFICHER, version))
          .find('input[type="checkbox"]')
          .then($input => {
            expect($input.is(':checked')).to.equal(attenduVisible);
          });
      });
    }
  
    static verifierNiveau(version: Version, nom: string, niveauAttendu: string): void {
      cy.log(`🔍 Vérification niveau langue "${nom}" = "${niveauAttendu}"`);
  
      LanguesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneLangue').scrollIntoView().within(() => {
        if (version === 'v1') {
          cy.get(getSelector(SECTION_LANGUES.SELECT_NIVEAU, version))
            .find('.mat-mdc-select-min-line')
            .should('have.text', niveauAttendu);
        } else {
          cy.get(getSelector(SECTION_LANGUES.SELECT_NIVEAU, version))
            .should('have.value', niveauAttendu);
        }
      });
    }
  
    static verifierOrdre(version: Version, nom: string, ordreAttendu: number): void {
      cy.log(`🔍 Vérification ordre langue "${nom}" = ${ordreAttendu}`);
  
      LanguesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneLangue').scrollIntoView().within(() => {
        if (version === 'v1') {
          cy.get(getSelector(SECTION_LANGUES.COL_ORDRE, version))
            .find('.mat-mdc-select-min-line')
            .should('have.text', ordreAttendu.toString());
        } else {
          cy.get(getSelector(SECTION_LANGUES.COL_ORDRE, version))
            .should('have.value', ordreAttendu.toString());
        }
      });
    }
  }