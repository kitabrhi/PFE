import {
    Version,
    getSelector,
    SECTION_DIPLOMES,
  } from '../../config/section/selectors-diplomes.config';
  
  // ─── Fixtures ────────────────────────────────────────────────────────────────
  
  const FIXTURE_DIPLOME = {
    nom: 'Master Informatique',
    lieu: 'Université Hassan II',
    annee: '2024'
  };
  
  const FIXTURE_DIPLOME_MODIFIE = {
    nom: 'Master Génie Logiciel',
    lieu: 'ENSIAS Rabat',
    annee: '2025'
  };
  
  // ═════════════════════════════════════════════════════════════════════════════
  //  CLASSE PRIMITIVES
  // ═════════════════════════════════════════════════════════════════════════════
  
  export class DiplomesPrimitives {
  
    // ─── Utilitaires ──────────────────────────────────────────────────────
  
    private static attendreAutoSave(): void {
      cy.log('⏳ Attente sauvegarde automatique...');
      cy.wait(2500);
    }
  
    /**
     * Trouve la ligne contenant un diplôme par son nom.
     * Stocke le résultat dans l'alias @ligneDiplome.
     */
    static trouverLigneParNom(version: Version, nom: string): void {
      cy.log(`🔍 Recherche ligne diplôme "${nom}"`);
  
      const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
      const inputSelector = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
          .filter((_index, el) => (el as HTMLInputElement).value === nom)
          .first()
          .closest(rowSelector)
          .first()
          .scrollIntoView()
          .as('ligneDiplome');
      } else {
        cy.contains(rowSelector, nom).scrollIntoView().as('ligneDiplome');
      }
    }
  
    /**
     * Trouve la dernière ligne vide pour y ajouter un nouveau diplôme.
     */
    static trouverDerniereLigneVide(version: Version): void {
      cy.log('🔍 Recherche dernière ligne vide');
  
      const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
      const inputSelector = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`)
          .filter((_index, el) => (el as HTMLInputElement).value === '')
          .first()
          .closest(rowSelector)
          .scrollIntoView()
          .as('ligneDiplomeVide');
      } else {
        cy.get(rowSelector).last().scrollIntoView().as('ligneDiplomeVide');
      }
    }
  
    // ─── Ajouter un diplôme ───────────────────────────────────────────────
  
    static ajouterDiplome(
      version: Version,
      nom: string = FIXTURE_DIPLOME.nom,
      lieu: string = FIXTURE_DIPLOME.lieu,
      annee: string = FIXTURE_DIPLOME.annee
    ): void {
      cy.log(`➕ Ajout diplôme "${nom}" — ${lieu} (${annee})`);
  
      const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
      const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);
      const inputLieu = getSelector(SECTION_DIPLOMES.INPUT_LIEU, version);
      const inputAnnee = getSelector(SECTION_DIPLOMES.INPUT_ANNEE, version);
  
      if (version === 'v1') {
        // Trouver la ligne vide et saisir le nom.
        cy.get(`${rowSelector} ${inputDiplome}`)
          .filter((_index, el) => (el as HTMLInputElement).value === '')
          .first()
          .scrollIntoView()
          .clear()
          .type(nom)
          .blur();
  
        // Retrouver la ligne par le nom pour remplir lieu et année.
        cy.get(`${rowSelector} ${inputDiplome}`)
          .filter((_index, el) => (el as HTMLInputElement).value === nom)
          .first()
          .closest(rowSelector)
          .within(() => {
            // Saisir le lieu.
            cy.get(inputLieu).clear().type(lieu).blur();
  
            // Saisir l'année — c'est un mat-datepicker (input texte).
            cy.get(inputAnnee).clear().type(annee).blur();
          });
  
        DiplomesPrimitives.attendreAutoSave();
  
        // Vérifier que le diplôme a été ajouté.
        cy.get(`${rowSelector} ${inputDiplome}`, { timeout: 10000 })
          .filter((_index, el) => (el as HTMLInputElement).value === nom)
          .should('have.length.greaterThan', 0);
  
      } else {
        // v2 : dernière ligne vide.
        DiplomesPrimitives.trouverDerniereLigneVide(version);
        cy.get('@ligneDiplomeVide').scrollIntoView().within(() => {
          cy.get(inputDiplome).clear().type(nom).blur();
          cy.get(inputLieu).clear().type(lieu).blur();
          cy.get(inputAnnee).select(annee);
        });
        DiplomesPrimitives.attendreAutoSave();
      }
  
      cy.log(`✅ Diplôme "${nom}" ajouté`);
    }
  
    // ─── Modifier un diplôme ──────────────────────────────────────────────
  
    static modifierDiplome(
      version: Version,
      ancienNom: string,
      nouveauNom: string = FIXTURE_DIPLOME_MODIFIE.nom,
      nouveauLieu: string = FIXTURE_DIPLOME_MODIFIE.lieu,
      nouvelleAnnee: string = FIXTURE_DIPLOME_MODIFIE.annee
    ): void {
      cy.log(`✏️ Modification "${ancienNom}" → "${nouveauNom}"`);
  
      const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
      const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);
      const inputLieu = getSelector(SECTION_DIPLOMES.INPUT_LIEU, version);
      const inputAnnee = getSelector(SECTION_DIPLOMES.INPUT_ANNEE, version);
  
      if (version === 'v1') {
        // Modifier le nom du diplôme.
        cy.get(`${rowSelector} ${inputDiplome}`, { timeout: 10000 })
          .filter((_index, el) => (el as HTMLInputElement).value === ancienNom)
          .first()
          .scrollIntoView()
          .clear()
          .type(nouveauNom)
          .blur();
  
        // Modifier lieu et année dans la même ligne.
        cy.get(`${rowSelector} ${inputDiplome}`)
          .filter((_index, el) => (el as HTMLInputElement).value === nouveauNom)
          .first()
          .closest(rowSelector)
          .within(() => {
            cy.get(inputLieu).clear().type(nouveauLieu).blur();
            cy.get(inputAnnee).clear().type(nouvelleAnnee).blur();
          });
  
        DiplomesPrimitives.attendreAutoSave();
  
      } else {
        DiplomesPrimitives.trouverLigneParNom(version, ancienNom);
        cy.get('@ligneDiplome').scrollIntoView().within(() => {
          cy.get(inputDiplome).clear().type(nouveauNom).blur();
          cy.get(inputLieu).clear().type(nouveauLieu).blur();
          cy.get(inputAnnee).select(nouvelleAnnee);
        });
        DiplomesPrimitives.attendreAutoSave();
      }
  
      cy.log(`✅ Diplôme modifié`);
    }
  
    // ─── Supprimer un diplôme ─────────────────────────────────────────────
  
    static supprimerDiplome(version: Version, nom: string): void {
      cy.log(`🗑️ Suppression diplôme "${nom}"`);
  
      const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
      const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);
  
      if (version === 'v1') {
        // Boucle récursive pour supprimer toutes les occurrences.
        const supprimerSiExiste = () => {
          cy.get(`${rowSelector} ${inputDiplome}`).then($inputs => {
            const found = $inputs.filter((_i, el) =>
              (el as HTMLInputElement).value === nom
            );
  
            if (found.length > 0) {
              cy.wrap(found.first())
                .closest(rowSelector)
                .first()
                .scrollIntoView()
                .within(() => {
                  // Cliquer sur le menu ⋮ (dernier bouton avec mat-icon dans la ligne).
                  cy.get(getSelector(SECTION_DIPLOMES.BTN_MENU_CONTEXTUEL, version))
                    .last()
                    .click({ force: true });
                });
  
              // Le menu s'ouvre en overlay.
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
        // v2 : icône corbeille directe.
        DiplomesPrimitives.trouverLigneParNom(version, nom);
        cy.get('@ligneDiplome').scrollIntoView().within(() => {
          cy.get(getSelector(SECTION_DIPLOMES.BTN_SUPPRIMER, version)).click();
        });
        DiplomesPrimitives.attendreAutoSave();
      }
    }
  
    // ─── Toggle visibilité ────────────────────────────────────────────────
  
    static toggleVisibilite(version: Version, nom: string, activer: boolean): void {
      const action = activer ? 'Rendre visible' : 'Masquer';
      cy.log(`${activer ? '✅' : '⬜'} ${action} diplôme "${nom}"`);
  
      DiplomesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneDiplome').scrollIntoView().within(() => {
        const checkboxSelector = getSelector(SECTION_DIPLOMES.COL_AFFICHER, version);
  
        cy.get(checkboxSelector).then($cb => {
          // mat-checkbox : la classe "selected" ou "mat-mdc-checkbox-checked" indique l'état.
          const isChecked =
            $cb.hasClass('mat-mdc-checkbox-checked') ||
            $cb.hasClass('selected') ||
            $cb.find('input[type="checkbox"]').is(':checked');
  
          if ((activer && !isChecked) || (!activer && isChecked)) {
            cy.get(checkboxSelector)
            .find('input[type="checkbox"]')
            .click({ force: true });
          }
        });
      });
  
      DiplomesPrimitives.attendreAutoSave();
    }
  
    // ─── Changer l'ordre ──────────────────────────────────────────────────
  
    static changerOrdre(version: Version, nom: string, nouvelOrdre: number): void {
      cy.log(`🔢 Changer ordre diplôme "${nom}" → position ${nouvelOrdre}`);
  
      DiplomesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneDiplome').scrollIntoView().within(() => {
        cy.get(getSelector(SECTION_DIPLOMES.COL_ORDRE, version)).click();
      });
  
      if (version === 'v1') {
        // L'overlay du mat-select est en dehors du row.
        cy.get('.mat-mdc-select-panel, .cdk-overlay-container mat-option')
          .should('be.visible')
          .contains('mat-option', nouvelOrdre.toString())
          .click();
      } else {
        cy.get('@ligneDiplome').scrollIntoView().within(() => {
          cy.get(getSelector(SECTION_DIPLOMES.COL_ORDRE, version))
            .select(nouvelOrdre.toString());
        });
      }
  
      DiplomesPrimitives.attendreAutoSave();
    }
  
    // ═══════════════════════════════════════════════════════════════════════
    //  VÉRIFICATIONS
    // ═══════════════════════════════════════════════════════════════════════
  
    static verifierDiplomeExiste(version: Version, nom: string): void {
      cy.log(`🔍 Vérification existence diplôme "${nom}"`);
  
      const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
      const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputDiplome}`, { timeout: 10000 })
          .filter((_index, el) => (el as HTMLInputElement).value === nom)
          .should('have.length.greaterThan', 0);
      } else {
        cy.contains(rowSelector, nom).scrollIntoView().should('exist').and('be.visible');
      }
    }
  
    static verifierDiplomeAbsent(version: Version, nom: string): void {
      cy.log(`🔍 Vérification absence diplôme "${nom}"`);
  
      const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
      const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);
  
      if (version === 'v1') {
        cy.wait(3000);
        cy.get(`${rowSelector} ${inputDiplome}`)
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
      cy.log(`🔍 Vérification visibilité diplôme "${nom}" = ${attenduVisible}`);
  
      DiplomesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneDiplome').scrollIntoView().within(() => {
        const checkboxSelector = getSelector(SECTION_DIPLOMES.COL_AFFICHER, version);
  
        cy.get(checkboxSelector)
        .find('input[type="checkbox"]')
        .then($input => {
          expect($input.is(':checked')).to.equal(attenduVisible);
        });
      });
    }
  
    static verifierOrdre(version: Version, nom: string, ordreAttendu: number): void {
      cy.log(`🔍 Vérification ordre diplôme "${nom}" = ${ordreAttendu}`);
  
      DiplomesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneDiplome').scrollIntoView().within(() => {
        if (version === 'v1') {
          cy.get(getSelector(SECTION_DIPLOMES.COL_ORDRE, version))
            .find('.mat-mdc-select-min-line')
            .should('have.text', ordreAttendu.toString());
        } else {
          cy.get(getSelector(SECTION_DIPLOMES.COL_ORDRE, version))
            .should('have.value', ordreAttendu.toString());
        }
      });
    }
  
    static verifierLieu(version: Version, nom: string, lieuAttendu: string): void {
      cy.log(`🔍 Vérification lieu diplôme "${nom}" = "${lieuAttendu}"`);
  
      DiplomesPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneDiplome').scrollIntoView().within(() => {
        cy.get(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version))
          .should('have.value', lieuAttendu);
      });
    }
  }