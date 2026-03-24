import {
  Version,
  getSelector,
  SECTION_TECHNOLOGIES,
  DELAIS,
  experienceVersUI
} from '../../config/section/selectors-technologies.config';

const FIXTURE_TECHNO = {
  categorie: 'Développement',
  nom: 'Angular',
  experience: '3 ANS'
};

// Sélecteurs v1 pré-calculés
const V1_INPUT_TECHNO = getSelector(SECTION_TECHNOLOGIES.INPUT_TECHNOLOGIE, 'v1');
const V1_SELECT_CAT = getSelector(SECTION_TECHNOLOGIES.SELECT_CATEGORIE, 'v1');
const V1_SELECT_EXP = getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, 'v1');
const V1_ROW = getSelector(SECTION_TECHNOLOGIES.ROW, 'v1');
const V1_BTN_SUPPRIMER = getSelector(SECTION_TECHNOLOGIES.BTN_SUPPRIMER, 'v1');
const V1_VISIBLE_PANEL = getSelector(SECTION_TECHNOLOGIES.PANEL_OPTIONS_VISIBLE, 'v1');

export class TechnologiesPrimitives {

  // ──────────────────────────────────────
  //  Utilitaires génériques
  // ──────────────────────────────────────

  private static normaliserTexte(valeur: string): string {
    return (valeur || '').replace(/\s+/g, ' ').trim();
  }

  private static lireValeurInput(el: Element): string {
    const maybeInput = el as unknown as { value?: unknown };
    return typeof maybeInput.value === 'string' ? maybeInput.value : '';
  }

  private static attendreAutoSave(): void {
    cy.log('Attente sauvegarde automatique...');
    cy.wait(DELAIS.AUTO_SAVE);
  }

  /**
   * Pattern réutilisable : sélectionner une valeur dans un dropdown
   * qu'il soit un <select> natif ou un mat-select Angular Material.
   */
  private static selectionnerDansDropdown(
    $el: JQuery<HTMLElement>,
    valeur: string
  ): void {
    const tagName = ($el.prop('tagName') || '').toString().toLowerCase();

    if (tagName === 'select') {
      cy.wrap($el).select(valeur, { force: true });
    } else if ($el.find('select').length > 0) {
      cy.wrap($el).find('select').select(valeur, { force: true });
    } else {
      cy.wrap($el).scrollIntoView().click({ force: true });
      TechnologiesPrimitives.choisirOptionVisible(valeur);
    }
  }

  private static choisirOptionVisible(valeur: string): void {
    const texte = TechnologiesPrimitives.normaliserTexte(valeur);
    const regex = new RegExp(`^\\s*${Cypress._.escapeRegExp(texte)}\\s*$`, 'i');

    cy.get(V1_VISIBLE_PANEL, { timeout: 10000 })
      .last()
      .should('be.visible')
      .within(() => {
        cy.contains('mat-option, mat-mdc-option', regex, { timeout: 10000 })
          .scrollIntoView()
          .click({ force: true });
      });
  }

  // ──────────────────────────────────────
  //  Gestion des catégories
  // ──────────────────────────────────────

  private static categorieExisteDejaV1(categorie: string): Cypress.Chainable<boolean> {
    return cy.get('body').then($body => {
      const $selects = $body.find(V1_SELECT_CAT);
      return $selects.toArray().some(el => {
        const texte = TechnologiesPrimitives.normaliserTexte(el.textContent || '');
        return texte.includes(TechnologiesPrimitives.normaliserTexte(categorie));
      });
    });
  }

  private static ajouterNouvelleCategorieV1(categorie: string): void {
    cy.log(`Ajout catégorie "${categorie}"`);

    cy.get(V1_SELECT_CAT, { timeout: 10000 })
      .last()
      .scrollIntoView()
      .click({ force: true });

    TechnologiesPrimitives.choisirOptionVisible(categorie);
    cy.wait(DELAIS.RENDU_UI);
    cy.get(V1_INPUT_TECHNO, { timeout: 10000 }).should('exist');
  }

  private static assurerCategorie(version: Version, categorie: string): void {
    cy.log(`Assurer catégorie "${categorie}"`);

    if (version === 'v1') {
      TechnologiesPrimitives.categorieExisteDejaV1(categorie).then(existe => {
        if (!existe) {
          TechnologiesPrimitives.ajouterNouvelleCategorieV1(categorie);
        }
      });
      return;
    }

    const selectCategorie = getSelector(SECTION_TECHNOLOGIES.SELECT_CATEGORIE, version);

    cy.get(selectCategorie, { timeout: 10000 }).then($el => {
      TechnologiesPrimitives.selectionnerDansDropdown($el, categorie);
    });

    cy.wait(DELAIS.RENDU_UI);
  }

  // ──────────────────────────────────────
  //  Recherche de ligne vide (v1) — découpée
  // ──────────────────────────────────────

  /**
   * Filtre les inputs qui se trouvent entre deux éléments de catégorie dans le DOM.
   */
  private static filtrerInputsDansBloc(
    $inputs: JQuery<HTMLElement>,
    catEl: Element,
    nextCatEl: Element | null
  ): JQuery<HTMLElement> {
    return $inputs.filter((_i, el) => {
      const isAfter = !!(
        catEl.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
      );
      const isBefore = nextCatEl
        ? !!(nextCatEl.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)
        : true;
      return isAfter && isBefore;
    });
  }

  private static trouverInputVideDansBloc(
    $scoped: JQuery<HTMLElement>
  ): JQuery<HTMLElement> {
    return Cypress.$($scoped).filter((_i, el) => {
      return !TechnologiesPrimitives.lireValeurInput(el).trim();
    }).last();
  }

  /**
   * Débloquer une nouvelle ligne en remplissant l'expérience
   * de la dernière ligne existante dans le bloc.
   */
  private static debloquerLigneEnRemplissantExperience(
    $scoped: JQuery<HTMLElement>,
    categorie: string,
    catEl: Element,
    nextCatEl: Element | null
  ): void {
    const $lastInScope = Cypress.$($scoped).last();

    if (!$lastInScope.length) {
      throw new Error(`Aucun input trouvé dans la catégorie "${categorie}".`);
    }

    cy.wrap($lastInScope)
      .closest(V1_ROW)
      .scrollIntoView()
      .within(() => {
        cy.get(V1_SELECT_EXP, { timeout: 10000 })
          .scrollIntoView()
          .click({ force: true });
      });

    cy.get(V1_VISIBLE_PANEL, { timeout: 10000 })
      .last()
      .should('be.visible')
      .within(() => {
        cy.get('mat-option, mat-mdc-option', { timeout: 10000 })
          .first()
          .click({ force: true });
      });

    cy.wait(DELAIS.RENDU_UI_LONG);

    // Après déblocage, chercher la nouvelle ligne vide
    cy.get(V1_INPUT_TECHNO, { timeout: 10000 }).then($refreshed => {
      const $rScoped = TechnologiesPrimitives.filtrerInputsDansBloc(
        $refreshed, catEl, nextCatEl
      );
      const $retry = TechnologiesPrimitives.trouverInputVideDansBloc($rScoped);

      if (!$retry.length) {
        throw new Error(
          `Aucune ligne vide dans "${categorie}" même après remplissage de l'expérience.`
        );
      }

      cy.wrap($retry).closest(V1_ROW).scrollIntoView().as('ligneTechno');
    });
  }

  private static trouverDerniereLigneVideVisibleV1(categorie: string): void {
    cy.get(V1_SELECT_CAT, { timeout: 10000 }).then($allSelects => {
      // Trouver l'index de la catégorie
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

      // Catégorie absente → la créer
      if (targetIdx === -1) {
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

      // Catégorie trouvée → chercher une ligne vide dans son bloc
      const catEl = $allSelects[targetIdx];
      const nextCatEl =
        targetIdx + 1 < $allSelects.length ? $allSelects[targetIdx + 1] : null;

      cy.wrap(Cypress.$(catEl)).scrollIntoView();
      cy.wait(DELAIS.RENDU_UI_COURT);

      cy.get(V1_INPUT_TECHNO, { timeout: 10000 }).then($inputs => {
        const $scoped = TechnologiesPrimitives.filtrerInputsDansBloc(
          $inputs, catEl, nextCatEl
        );
        const $ligneVide = TechnologiesPrimitives.trouverInputVideDansBloc($scoped);

        if ($ligneVide.length) {
          cy.wrap($ligneVide).closest(V1_ROW).scrollIntoView().as('ligneTechno');
        } else {
          TechnologiesPrimitives.debloquerLigneEnRemplissantExperience(
            $scoped, categorie, catEl, nextCatEl
          );
        }
      });
    });
  }

  // ──────────────────────────────────────
  //  Expérience & checkbox
  // ──────────────────────────────────────

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
          if ($input.is(':checked') !== attenduCoche) {
            cy.wrap($input).click({ force: true });
          }
        } else {
          cy.wrap($root).click({ force: true });
        }
      });
    });
  }

  // ──────────────────────────────────────
  //  Suppression récursive (v1)
  // ──────────────────────────────────────

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
          cy.get(V1_BTN_SUPPRIMER, { timeout: 10000 }).first().click({ force: true });
        });

      cy.wait(DELAIS.RENDU_UI);
      TechnologiesPrimitives.supprimerToutesOccurrencesV1(nom);
    });
  }

  // ──────────────────────────────────────
  //  Actions principales (API publique)
  // ──────────────────────────────────────

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
    cy.log(`Ajout "${nom}" (${experience || 'sans exp.'}) dans "${categorie}"`);

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

      cy.wait(DELAIS.RENDU_UI_COURT);

      if (experience) {
        TechnologiesPrimitives.choisirExperienceDansLigneV1(experience);
      }

      TechnologiesPrimitives.attendreAutoSave();
      return;
    }

    // Version générique (v2+)
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
            TechnologiesPrimitives.selectionnerDansDropdown($el, experience);
          });
        }
      });

    TechnologiesPrimitives.attendreAutoSave();
  }

  static modifierExperience(
    version: Version,
    categorie: string,
    nom: string,
    nouvelleExperience: string
  ): void {
    cy.log(`Modification expérience "${nom}" → "${nouvelleExperience}"`);

    TechnologiesPrimitives.assurerCategorie(version, categorie);
    TechnologiesPrimitives.trouverLigneParNom(version, nom);

    if (version === 'v1') {
      TechnologiesPrimitives.choisirExperienceDansLigneV1(nouvelleExperience);
      TechnologiesPrimitives.attendreAutoSave();
      return;
    }

    const selectExperience = getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, version);

    cy.get('@ligneTechno').within(() => {
      cy.get(selectExperience).then($el => {
        TechnologiesPrimitives.selectionnerDansDropdown($el, nouvelleExperience);
      });
    });

    TechnologiesPrimitives.attendreAutoSave();
  }

  static supprimerTechnologie(version: Version, categorie: string, nom: string): void {
    cy.log(`Suppression "${nom}" dans "${categorie}"`);

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
    cy.log(`${activer ? 'Rendre visible' : 'Masquer'} "${nom}"`);

    TechnologiesPrimitives.assurerCategorie(version, categorie);
    TechnologiesPrimitives.trouverLigneParNom(version, nom);
    TechnologiesPrimitives.setCheckboxDansLigne(version, activer);
    TechnologiesPrimitives.attendreAutoSave();
  }

  // ──────────────────────────────────────
  //  Vérifications
  // ──────────────────────────────────────

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
      cy.wait(DELAIS.VERIFICATION);

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
    cy.wait(DELAIS.VERIFICATION);

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
    const experienceUI = experienceVersUI(experienceAttendue, version);
  
    cy.log(`Vérification expérience "${nom}" = "${experienceUI}"`);
  
    TechnologiesPrimitives.assurerCategorie(version, categorie);
    TechnologiesPrimitives.trouverLigneParNom(version, nom);
  
    const selector = version === 'v1'
      ? V1_SELECT_EXP
      : getSelector(SECTION_TECHNOLOGIES.SELECT_EXPERIENCE, version);
  
    cy.get('@ligneTechno').within(() => {
      cy.get(selector, { timeout: 10000 })
        .invoke('text')
        .then(text => {
          expect(
            TechnologiesPrimitives.normaliserTexte(text).toLowerCase()
          ).to.include(
            TechnologiesPrimitives.normaliserTexte(experienceUI).toLowerCase()
          );
        });
    });
  }
}