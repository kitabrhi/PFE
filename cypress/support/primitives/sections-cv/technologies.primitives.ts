import {
  Version,
  getSelector,
  SECTION_TECHNOLOGIES
} from '../../config/section/selectors-technologies.config';

const FIXTURE_TECHNO = {
  categorie: 'Développement',
  nom: 'Angular',
  experience: '3 ANS'
};

// Sélecteurs utilises pour la version v1
const V1_INPUT_TECHNO = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, 'v1');
const V1_SELECT_CAT = getSelector(SECTION_TECHNOLOGIES.SELECT_CATEGORIE, 'v1');
const V1_SELECT_EXP = getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, 'v1');
const V1_ROW = getSelector(SECTION_TECHNOLOGIES.ROW, 'v1');
const V1_BTN_SUPPRIMER = getSelector(SECTION_TECHNOLOGIES.BTN_SUPPRIMER, 'v1');

const V1_VISIBLE_PANEL =
  '.cdk-overlay-pane:visible .mat-mdc-select-panel,' +
  '.mat-mdc-select-panel:visible,' +
  '.cdk-overlay-pane:visible .mat-select-panel,' +
  '.mat-select-panel:visible';

export class TechnologiesPrimitives {
  // Petites methodes utilitaires

  private static normaliserTexte(valeur: string): string {
    return (valeur || '').replace(/\s+/g, ' ').trim();
  }

  private static lireValeurInput(el: Element): string {
    const maybeInput = el as unknown as { value?: unknown };
    return typeof maybeInput.value === 'string' ? maybeInput.value : '';
  }

  private static attendreAutoSave(): void {
    cy.log('Attente sauvegarde automatique...');
    cy.wait(2500);
  }

  private static choisirOptionVisible(valeur: string): void {
    const texte = TechnologiesPrimitives.normaliserTexte(valeur);
    const regex = new RegExp(`^\\s*${Cypress._.escapeRegExp(texte)}\\s*$`);

    cy.get(V1_VISIBLE_PANEL, { timeout: 10000 })
      .last()
      .should('be.visible')
      .within(() => {
        cy.contains('mat-option, mat-mdc-option', regex, { timeout: 10000 })
          .scrollIntoView()
          .click({ force: true });
      });
  }

  private static categorieExisteDejaV1(categorie: string): Cypress.Chainable<boolean> {
    return cy.get('body').then($body => {
      const $selects = $body.find(V1_SELECT_CAT);

      const existe = $selects.toArray().some(el => {
        const texte = TechnologiesPrimitives.normaliserTexte(el.textContent || '');
        return texte.includes(TechnologiesPrimitives.normaliserTexte(categorie));
      });

      return existe;
    });
  }

  private static ajouterNouvelleCategorieV1(categorie: string): void {
    cy.log(`Ajout catégorie "${categorie}"`);

    cy.get(V1_SELECT_CAT, { timeout: 10000 })
      .last()
      .scrollIntoView()
      .click({ force: true });

    TechnologiesPrimitives.choisirOptionVisible(categorie);

    cy.wait(800);
    cy.get(V1_INPUT_TECHNO, { timeout: 10000 }).should('exist');
  }

  private static assurerCategorie(version: Version, categorie: string): void {
    cy.log(`Assurer catégorie "${categorie}"`);

    if (version === 'v1') {
      TechnologiesPrimitives.categorieExisteDejaV1(categorie).then(existe => {
        if (existe) {
          cy.log(`Catégorie "${categorie}" déjà visible`);
        } else {
          TechnologiesPrimitives.ajouterNouvelleCategorieV1(categorie);
        }
      });
      return;
    }

    const selectCategorie = getSelector(SECTION_TECHNOLOGIES.SELECT_CATEGORIE, version);

    cy.get(selectCategorie, { timeout: 10000 }).then($el => {
      const tagName = ($el.prop('tagName') || '').toString().toLowerCase();

      if (tagName === 'select') {
        cy.wrap($el).select(categorie, { force: true });
      } else if ($el.find('select').length > 0) {
        cy.wrap($el).find('select').select(categorie, { force: true });
      } else {
        cy.wrap($el).scrollIntoView().click({ force: true });
        TechnologiesPrimitives.choisirOptionVisible(categorie);
      }
    });

    cy.wait(800);
  }

  private static trouverDerniereLigneVideVisibleV1(categorie: string): void {
    cy.get(V1_SELECT_CAT, { timeout: 10000 }).then($allSelects => {
      // On repere la categorie dans la liste deja affichee.
      let targetIdx = -1;
  
      $allSelects.each((i, el) => {
        if (
          TechnologiesPrimitives.normaliserTexte(el.textContent || '')
            .includes(TechnologiesPrimitives.normaliserTexte(categorie))
        ) {
          targetIdx = i;
          return false;
        }
      });
  
      // Si elle n'existe pas encore, on la cree puis on prend la ligne vide.
      if (targetIdx === -1) {
        cy.log(`Catégorie "${categorie}" absente → création`);
        TechnologiesPrimitives.ajouterNouvelleCategorieV1(categorie);
  
        cy.get(V1_INPUT_TECHNO, { timeout: 10000 })
          .filter((_i, el) => !TechnologiesPrimitives.lireValeurInput(el).trim())
          .last()
          .should('exist')
          .closest(V1_ROW)
          .scrollIntoView()
          .as('ligneTechno');
  
        return;
      }
  
      // Sinon, on cherche une ligne vide dans le bloc de cette categorie.
      cy.log(`Catégorie "${categorie}" trouvée → recherche ligne vide`);
  
      const catEl = $allSelects[targetIdx];
      const nextCatEl =
        targetIdx + 1 < $allSelects.length ? $allSelects[targetIdx + 1] : null;
  
      // On se place sur le bloc pour s'assurer que tout est bien rendu.
      cy.wrap(Cypress.$(catEl)).scrollIntoView();
      cy.wait(500);
  
      // On regarde tous les inputs, pas seulement les visibles,
      // car la ligne vide peut apparaitre apres le scroll.
      cy.get(V1_INPUT_TECHNO, { timeout: 10000 }).then($inputs => {
        const $scoped = $inputs.filter((_i, el) => {
          const isAfter = !!(
            catEl.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
          );
          const isBefore = nextCatEl
            ? !!(
                nextCatEl.compareDocumentPosition(el) &
                Node.DOCUMENT_POSITION_PRECEDING
              )
            : true;
          return isAfter && isBefore;
        });
  
        const $ligneVide = Cypress.$($scoped).filter((_i, el) => {
          return !TechnologiesPrimitives.lireValeurInput(el).trim();
        }).last();
  
        if ($ligneVide.length) {
          cy.wrap($ligneVide)
            .closest(V1_ROW)
            .scrollIntoView()
            .as('ligneTechno');
          } else {
            // Pas de ligne vide → la dernière ligne a probablement
            // une expérience vide qui bloque la création d'une nouvelle ligne.
            // On remplit l'expérience de cette dernière ligne pour débloquer.
            cy.log(
              `Pas de ligne vide dans "${categorie}" → ` +
              `remplissage expérience de la dernière ligne pour débloquer`
            );
          
            const $lastInScope = Cypress.$($scoped).last();
          
            if (!$lastInScope.length) {
              throw new Error(`Aucun input trouvé dans la catégorie "${categorie}".`);
            }
          
            // Cliquer sur le select expérience de la dernière ligne remplie
            cy.wrap($lastInScope)
              .closest(V1_ROW)
              .scrollIntoView()
              .within(() => {
                cy.get(V1_SELECT_EXP, { timeout: 10000 })
                  .scrollIntoView()
                  .click({ force: true });
              });
          
            // Choisir la première option disponible pour débloquer
            cy.get(V1_VISIBLE_PANEL, { timeout: 10000 })
              .last()
              .should('be.visible')
              .within(() => {
                cy.get('mat-option, mat-mdc-option', { timeout: 10000 })
                  .first()
                  .click({ force: true });
              });
          
            cy.wait(1500);
          
            // Maintenant une nouvelle ligne vide devrait apparaître
            cy.get(V1_INPUT_TECHNO, { timeout: 10000 }).then($refreshed => {
              const $rScoped = $refreshed.filter((_i, el) => {
                const isAfter = !!(
                  catEl.compareDocumentPosition(el) &
                  Node.DOCUMENT_POSITION_FOLLOWING
                );
                const isBefore = nextCatEl
                  ? !!(
                      nextCatEl.compareDocumentPosition(el) &
                      Node.DOCUMENT_POSITION_PRECEDING
                    )
                  : true;
                return isAfter && isBefore;
              });
          
              const $retry = Cypress.$($rScoped).filter((_i, el) => {
                return !TechnologiesPrimitives.lireValeurInput(el).trim();
              }).last();
          
              if (!$retry.length) {
                throw new Error(
                  `Aucune ligne vide dans "${categorie}" même après ` +
                  `remplissage de l'expérience.`
                );
              }
          
              cy.wrap($retry)
                .closest(V1_ROW)
                .scrollIntoView()
                .as('ligneTechno');
            });
          }
      });
    });
  }

  private static choisirExperienceDansLigneV1(experience: string): void {
    cy.get('@ligneTechno').within(() => {
      cy.get(V1_SELECT_EXP, { timeout: 10000 })
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true });
    });

    TechnologiesPrimitives.choisirOptionVisible(experience);
  }

  private static setCheckboxDansLigne(version: Version, attenduCoche: boolean): void {
    const checkboxSelector = getSelector(SECTION_TECHNOLOGIES.COL_AFFICHER, version);

    cy.get('@ligneTechno').within(() => {
      cy.get(checkboxSelector, { timeout: 10000 }).then($root => {
        const $input = $root.find('input[type="checkbox"]').first();

        if ($input.length > 0) {
          const estCoche = $input.is(':checked');

          if (estCoche !== attenduCoche) {
            cy.wrap($input).click({ force: true });
          }
        } else {
          cy.wrap($root).click({ force: true });
        }
      });
    });
  }

  private static supprimerToutesOccurrencesV1(nom: string): void {
    cy.get('body').then($body => {
      const $inputs = $body.find(V1_INPUT_TECHNO).filter((_i, el) => {
        return (
          TechnologiesPrimitives.normaliserTexte(
            TechnologiesPrimitives.lireValeurInput(el)
          ) === TechnologiesPrimitives.normaliserTexte(nom)
        );
      });

      if ($inputs.length === 0) {
        cy.log(`"${nom}" n'est plus présent`);
        return;
      }

      cy.wrap($inputs.last())
        .closest(V1_ROW)
        .scrollIntoView()
        .within(() => {
          cy.get(V1_BTN_SUPPRIMER, { timeout: 10000 })
            .first()
            .click({ force: true });
        });

      cy.wait(800);
      TechnologiesPrimitives.supprimerToutesOccurrencesV1(nom);
    });
  }

    // Actions principales

  static selectionnerCategorie(version: Version, categorie: string): void {
    TechnologiesPrimitives.assurerCategorie(version, categorie);
  }

  static trouverLigneParNom(version: Version, nom: string): void {
    cy.log(`Recherche technologie "${nom}"`);

    if (version === 'v1') {
      cy.get(V1_INPUT_TECHNO, { timeout: 10000 })
        .filter(':visible')
        .filter((_i, el) => {
          return (
            TechnologiesPrimitives.normaliserTexte(
              TechnologiesPrimitives.lireValeurInput(el)
            ) === TechnologiesPrimitives.normaliserTexte(nom)
          );
        })
        .last()
        .should('exist')
        .closest(V1_ROW)
        .scrollIntoView()
        .as('ligneTechno');

      return;
    }

    const rowSelector = getSelector(SECTION_TECHNOLOGIES.ROW, version);

    cy.contains(rowSelector, nom, { timeout: 10000 })
      .scrollIntoView()
      .as('ligneTechno');
  }

  static ajouterTechnologie(
    version: Version,
    categorie: string = FIXTURE_TECHNO.categorie,
    nom: string = FIXTURE_TECHNO.nom,
    experience?: string
  ): void {
    cy.log(
      `Ajout technologie "${nom}" (${experience || 'sans expérience'}) dans "${categorie}"`
    );

    TechnologiesPrimitives.assurerCategorie(version, categorie);

    if (version === 'v1') {
      TechnologiesPrimitives.trouverDerniereLigneVideVisibleV1(categorie);

      cy.get('@ligneTechno').within(() => {
        cy.get(V1_INPUT_TECHNO, { timeout: 10000 })
          .should('be.visible')
          .clear()
          .type(nom)
          .blur();
      });

      cy.wait(500);

      if (experience) {
        TechnologiesPrimitives.choisirExperienceDansLigneV1(experience);
      }

      TechnologiesPrimitives.attendreAutoSave();
      cy.log(`Technologie "${nom}" ajoutée`);
      return;
    }

    const rowSelector = getSelector(SECTION_TECHNOLOGIES.ROW, version);
    const inputTechno = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, version);
    const selectExperience = getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, version);

    cy.get(rowSelector, { timeout: 10000 })
      .last()
      .scrollIntoView()
      .within(() => {
        cy.get(inputTechno, { timeout: 10000 }).clear().type(nom).blur();

        if (experience) {
          cy.get(selectExperience).then($el => {
            const tagName = ($el.prop('tagName') || '').toString().toLowerCase();

            if (tagName === 'select') {
              cy.wrap($el).select(experience, { force: true });
            } else if ($el.find('select').length > 0) {
              cy.wrap($el).find('select').select(experience, { force: true });
            } else {
              cy.wrap($el).click({ force: true });
              TechnologiesPrimitives.choisirOptionVisible(experience);
            }
          });
        }
      });

    TechnologiesPrimitives.attendreAutoSave();
    cy.log(`Technologie "${nom}" ajoutée`);
  }

  static modifierExperience(
    version: Version,
    categorie: string,
    nom: string,
    nouvelleExperience: string
  ): void {
    cy.log(`Modification expérience "${nom}" -> "${nouvelleExperience}"`);

    TechnologiesPrimitives.assurerCategorie(version, categorie);
    TechnologiesPrimitives.trouverLigneParNom(version, nom);

    if (version === 'v1') {
      TechnologiesPrimitives.choisirExperienceDansLigneV1(nouvelleExperience);
      TechnologiesPrimitives.attendreAutoSave();
      cy.log(`Expérience modifiée pour "${nom}"`);
      return;
    }

    const selectExperience = getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, version);

    cy.get('@ligneTechno').within(() => {
      cy.get(selectExperience).then($el => {
        const tagName = ($el.prop('tagName') || '').toString().toLowerCase();

        if (tagName === 'select') {
          cy.wrap($el).select(nouvelleExperience, { force: true });
        } else if ($el.find('select').length > 0) {
          cy.wrap($el).find('select').select(nouvelleExperience, { force: true });
        } else {
          cy.wrap($el).click({ force: true });
          TechnologiesPrimitives.choisirOptionVisible(nouvelleExperience);
        }
      });
    });

    TechnologiesPrimitives.attendreAutoSave();
    cy.log(`Expérience modifiée pour "${nom}"`);
  }

  static supprimerTechnologie(version: Version, categorie: string, nom: string): void {
    cy.log(`Suppression technologie "${nom}" dans "${categorie}"`);

    TechnologiesPrimitives.assurerCategorie(version, categorie);

    if (version === 'v1') {
      TechnologiesPrimitives.supprimerToutesOccurrencesV1(nom);
      TechnologiesPrimitives.attendreAutoSave();
      return;
    }

    TechnologiesPrimitives.trouverLigneParNom(version, nom);

    cy.get('@ligneTechno').within(() => {
      cy.get(getSelector(SECTION_TECHNOLOGIES.BTN_SUPPRIMER, version), {
        timeout: 10000
      }).click({ force: true });
    });

    TechnologiesPrimitives.attendreAutoSave();
  }

  static toggleVisibilite(
    version: Version,
    categorie: string,
    nom: string,
    activer: boolean
  ): void {
    cy.log(
      `${activer ? 'Rendre visible' : 'Masquer'} "${nom}"`
    );

    TechnologiesPrimitives.assurerCategorie(version, categorie);
    TechnologiesPrimitives.trouverLigneParNom(version, nom);
    TechnologiesPrimitives.setCheckboxDansLigne(version, activer);
    TechnologiesPrimitives.attendreAutoSave();
  }

    // Verifications

  static verifierTechnologieExiste(
    version: Version,
    categorie: string,
    nom: string
  ): void {
    cy.log(`Vérification existence "${nom}" dans "${categorie}"`);

    if (version === 'v1') {
      cy.get(V1_INPUT_TECHNO, { timeout: 10000 })
        .filter((_i, el) => {
          return (
            TechnologiesPrimitives.normaliserTexte(
              TechnologiesPrimitives.lireValeurInput(el)
            ) === TechnologiesPrimitives.normaliserTexte(nom)
          );
        })
        .should('have.length.greaterThan', 0);

      return;
    }

    TechnologiesPrimitives.assurerCategorie(version, categorie);

    cy.get(getSelector(SECTION_TECHNOLOGIES.ROW, version), { timeout: 10000 })
      .filter(`:contains("${nom}")`)
      .should('have.length.greaterThan', 0);
  }

  static verifierTechnologieAbsente(
    version: Version,
    categorie: string,
    nom: string
  ): void {
    cy.log(`Vérification absence "${nom}" dans "${categorie}"`);

    if (version === 'v1') {
      cy.wait(1000);

      cy.get(V1_INPUT_TECHNO, { timeout: 10000 }).then($inputs => {
        const trouvees = $inputs.filter((_i, el) => {
          return (
            TechnologiesPrimitives.normaliserTexte(
              TechnologiesPrimitives.lireValeurInput(el)
            ) === TechnologiesPrimitives.normaliserTexte(nom)
          );
        });

        expect(trouvees.length).to.equal(0);
      });

      return;
    }

    TechnologiesPrimitives.assurerCategorie(version, categorie);
    cy.wait(1000);

    cy.get('body').then($body => {
      const rows = $body
        .find(getSelector(SECTION_TECHNOLOGIES.ROW, version))
        .filter(`:contains("${nom}")`);

      expect(rows.length).to.equal(0);
    });
  }

  static verifierVisibilite(
    version: Version,
    categorie: string,
    nom: string,
    attenduVisible: boolean
  ): void {
    cy.log(`Vérification visibilité "${nom}" = ${attenduVisible}`);

    TechnologiesPrimitives.assurerCategorie(version, categorie);
    TechnologiesPrimitives.trouverLigneParNom(version, nom);

    cy.get('@ligneTechno').within(() => {
      cy.get(getSelector(SECTION_TECHNOLOGIES.COL_AFFICHER, version), {
        timeout: 10000
      }).then($root => {
        const $input = $root.find('input[type="checkbox"]').first();

        if ($input.length > 0) {
          expect($input.is(':checked')).to.equal(attenduVisible);
        } else {
          cy.wrap($root).should('exist');
        }
      });
    });
  }

  static verifierExperience(
    version: Version,
    categorie: string,
    nom: string,
    experienceAttendue: string
  ): void {
    cy.log(`Vérification expérience "${nom}" = "${experienceAttendue}"`);

    TechnologiesPrimitives.assurerCategorie(version, categorie);
    TechnologiesPrimitives.trouverLigneParNom(version, nom);

    if (version === 'v1') {
      cy.get('@ligneTechno').within(() => {
        cy.get(V1_SELECT_EXP, { timeout: 10000 })
          .invoke('text')
          .then(text => {
            expect(
              TechnologiesPrimitives.normaliserTexte(text)
            ).to.include(TechnologiesPrimitives.normaliserTexte(experienceAttendue));
          });
      });

      return;
    }

    cy.get('@ligneTechno').within(() => {
      cy.get(getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, version), {
        timeout: 10000
      }).then($el => {
        const texte = TechnologiesPrimitives.normaliserTexte($el.text());
        expect(texte).to.include(
          TechnologiesPrimitives.normaliserTexte(experienceAttendue)
        );
      });
    });
  }
}
