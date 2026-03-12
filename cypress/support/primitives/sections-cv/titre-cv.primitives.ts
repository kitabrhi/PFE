import {
  Version, getSelector, getLabelSection,
  SECTION_NAV, SECTION_ROW, SECTION_TITRES
} from '../../config/section/selectors-titre-cv.config';

export class SectionsCVPrimitives {

  // L'auto-save n'est pas instantané, on lui laisse un peu de marge.

  private static attendreAutoSave(): void {
    cy.log('⏳ Attente sauvegarde automatique...');
    cy.wait(2500);
  }

  // Navigation entre sections.

  static naviguerVersSection(version: Version, nomSection: string): void {
    const label = getLabelSection(nomSection, version);
    cy.log(`🧭 Navigation vers section "${nomSection}" (label: "${label}")`);

    cy.get(getSelector(SECTION_NAV.NAV_CONTAINER, version), { timeout: 10000 })
      .should('be.visible');

    cy.contains(getSelector(SECTION_NAV.NAV_LINK, version), label)
      .click({ force: true });

    cy.wait(1000);
    cy.log(`✅ Sur la section "${nomSection}"`);
  }

  // Recherche et manipulation des lignes.

  static trouverLigneParTexte(version: Version, texte: string): void {
    cy.log(`🔍 Recherche ligne contenant "${texte}"`);
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);
  
    if (version === 'v1') {
      cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
        .filter((_index, el) => (el as HTMLInputElement).value === texte)
        .first()
        .closest('.custom-form-item')
        .first()
        .as('ligneTrouvee');
    } else {
      cy.contains(rowSelector, texte).as('ligneTrouvee');
    }
  }

  static trouverDerniereLigne(version: Version): void {
    cy.log('🔍 Recherche dernière ligne (vide)');
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);

    if (version === 'v1') {
      cy.get(`${rowSelector} ${inputSelector}`)
        .filter((_index, el) => (el as HTMLInputElement).value === '')
        .first()
        .closest('.custom-form-item')
        .as('derniereLigne');
    } else {
      cy.get(rowSelector).last().as('derniereLigne');
    }
  }

  static verifierNouvelleLigneVide(version: Version): void {
    cy.log('🔍 Vérification nouvelle ligne vide');

    if (version === 'v1') {
      cy.log('ℹ️ v1 : pas de nouvelle ligne vide auto-créée');
      return;
    }

    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);
    cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
      .filter((_index, el) => (el as HTMLInputElement).value === '')
      .should('have.length.greaterThan', 0);
  }

  // Suppression.

  static supprimerLigne(version: Version, texte: string): void {
    cy.log(`🗑️ Suppression de la ligne "${texte}"`);
  
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);
  
    if (version === 'v1') {
      // En v1, le plus fiable reste de supprimer chaque occurrence l'une après l'autre.
      const supprimerSiExiste = () => {
        cy.get(`${rowSelector} ${inputSelector}`).then($inputs => {
          const found = $inputs.filter((_i, el) =>
            (el as HTMLInputElement).value === texte
          );
  
          if (found.length > 0) {
            cy.wrap(found.first())
              .closest('.custom-form-item')
              .first()
              .within(() => {
                cy.get(getSelector(SECTION_ROW.BTN_SUPPRIMER_LIGNE, version)).click();
              });
  
            cy.get('.mat-mdc-menu-panel')
              .should('be.visible')
              .contains('button', 'Supprimer')
              .click();
  
            cy.wait(2500).then(() => supprimerSiExiste());
          } else {
            cy.log(`✅ Toutes les occurrences de "${texte}" supprimées`);
          }
        });
      };
  
      supprimerSiExiste();
  
    } else {
      SectionsCVPrimitives.trouverLigneParTexte(version, texte);
      cy.get('@ligneTrouvee').within(() => {
        cy.get(getSelector(SECTION_ROW.BTN_SUPPRIMER_LIGNE, version)).click();
      });
      SectionsCVPrimitives.attendreAutoSave();
    }
  }
  // Affichage et masquage.

  static toggleVisibilite(version: Version, texte: string, activer: boolean): void {
    const action = activer ? 'Rendre visible' : 'Masquer';
    cy.log(`${activer ? '✅' : '⬜'} ${action} "${texte}"`);

    SectionsCVPrimitives.trouverLigneParTexte(version, texte);

    cy.get('@ligneTrouvee').within(() => {
      cy.get(getSelector(SECTION_ROW.COL_AFFICHER, version)).then($cb => {
        const isChecked = $cb.is(':checked') || $cb.hasClass('mat-mdc-checkbox-checked');

        if ((activer && !isChecked) || (!activer && isChecked)) {
          cy.get(getSelector(SECTION_ROW.COL_AFFICHER, version)).click({ force: true });
        }
      });
    });

    SectionsCVPrimitives.attendreAutoSave();
  }

  static verifierVisibilite(version: Version, texte: string, attenduVisible: boolean): void {
    cy.log(`🔍 Vérification visibilité "${texte}" = ${attenduVisible}`);

    SectionsCVPrimitives.trouverLigneParTexte(version, texte);

    cy.get('@ligneTrouvee').within(() => {
      cy.get(getSelector(SECTION_ROW.COL_AFFICHER, version)).then($cb => {
        const isChecked = $cb.is(':checked') || $cb.hasClass('mat-mdc-checkbox-checked');
        expect(isChecked).to.equal(attenduVisible);
      });
    });
  }

  // Réordonnancement.

  static changerOrdre(version: Version, texte: string, nouvelOrdre: number): void {
    cy.log(`🔢 Changer ordre "${texte}" → position ${nouvelOrdre}`);

    SectionsCVPrimitives.trouverLigneParTexte(version, texte);

    cy.get('@ligneTrouvee').within(() => {
      cy.get(getSelector(SECTION_ROW.COL_ORDRE, version)).click();
    });

    if (version === 'v1') {
      cy.get('.mat-mdc-select-panel, .cdk-overlay-container mat-option')
        .should('be.visible')
        .contains('mat-option', nouvelOrdre.toString())
        .click();
    } else {
      cy.get('@ligneTrouvee').within(() => {
        cy.get(getSelector(SECTION_ROW.COL_ORDRE, version))
          .select(nouvelOrdre.toString());
      });
    }

    SectionsCVPrimitives.attendreAutoSave();
  }

  static verifierOrdre(version: Version, texte: string, ordreAttendu: number): void {
    cy.log(`🔍 Vérification ordre "${texte}" = ${ordreAttendu}`);

    SectionsCVPrimitives.trouverLigneParTexte(version, texte);

    cy.get('@ligneTrouvee').within(() => {
      if (version === 'v1') {
        cy.get(getSelector(SECTION_ROW.COL_ORDRE, version))
          .find('.mat-mdc-select-min-line')
          .should('have.text', ordreAttendu.toString());
      } else {
        cy.get(getSelector(SECTION_ROW.COL_ORDRE, version))
          .should('have.value', ordreAttendu.toString());
      }
    });
  }

  // Actions propres à la section Titres.

  static ajouterTitre(version: Version, titre: string): void {
    cy.log(`➕ Ajout du titre "${titre}"`);

    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);

    if (version === 'v1') {
      // En v1, on réutilise le premier champ encore vide.
      cy.get(`${rowSelector} ${inputSelector}`)
        .filter((_index, el) => (el as HTMLInputElement).value === '')
        .first()
        .clear()
        .type(titre)
        .blur();

      // Vérification légère pour éviter une saisie silencieusement perdue.
      cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
        .filter((_index, el) => (el as HTMLInputElement).value === titre)
        .should('have.length.greaterThan', 0);

    } else {
      SectionsCVPrimitives.trouverDerniereLigne(version);
      cy.get('@derniereLigne').within(() => {
        cy.get(inputSelector).first().clear().type(titre).blur();
      });
      SectionsCVPrimitives.attendreAutoSave();
    }

    cy.log(`✅ Titre "${titre}" ajouté`);
  }

  static modifierTitre(version: Version, ancienTitre: string, nouveauTitre: string): void {
    cy.log(`✏️ Modification "${ancienTitre}" → "${nouveauTitre}"`);

    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);

    if (version === 'v1') {
      // On cible directement le champ qui contient déjà l'ancien titre.
      cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
        .filter((_index, el) => (el as HTMLInputElement).value === ancienTitre)
        .first()
        .clear()
        .type(nouveauTitre)
        .blur();

      // Même contrôle rapide après modification.
      cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
        .filter((_index, el) => (el as HTMLInputElement).value === nouveauTitre)
        .should('have.length.greaterThan', 0);

    } else {
      SectionsCVPrimitives.trouverLigneParTexte(version, ancienTitre);
      cy.get('@ligneTrouvee').within(() => {
        cy.get(inputSelector).first().clear().type(nouveauTitre).blur();
      });
      SectionsCVPrimitives.attendreAutoSave();
    }

    cy.log(`✅ Titre modifié`);
  }

  static verifierTitreExiste(version: Version, titre: string): void {
    cy.log(`🔍 Vérification existence "${titre}"`);
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);

    if (version === 'v1') {
      cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
        .filter((_index, el) => (el as HTMLInputElement).value === titre)
        .should('have.length.greaterThan', 0);
    } else {
      cy.contains(rowSelector, titre).should('exist').and('be.visible');
    }
  }

  static verifierTitreAbsent(version: Version, titre: string): void {
    cy.log(`🔍 Vérification absence "${titre}"`);
    const rowSelector = getSelector(SECTION_ROW.ROW, version);
    const inputSelector = getSelector(SECTION_TITRES.INPUT_TITRE, version);
  
    if (version === 'v1') {
      cy.wait(3000); // Le DOM prend parfois un peu de temps à se remettre d'aplomb.
      cy.get(`${rowSelector} ${inputSelector}`)
        .then($inputs => {
          // Ce log aide à voir rapidement ce qu'il reste réellement dans la liste.
          $inputs.each((_i, el) => {
            cy.log(`📋 Input value: "${(el as HTMLInputElement).value}"`);
          });
  
          const found = $inputs.filter((_i, el) =>
            (el as HTMLInputElement).value === titre
          );
          expect(found.length).to.equal(0);
        });
    } else {
      cy.contains(rowSelector, titre).should('not.exist');
    }
  }
}
