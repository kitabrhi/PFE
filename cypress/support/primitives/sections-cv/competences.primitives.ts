import {
  Version, getSelector,
  SECTION_COMPETENCES
} from '../../config/section/selectors-competences.config';

const FIXTURE_COMPETENCE = { nom: 'Angular', experience: '3 ANS' };
const FIXTURE_COMPETENCE_MODIFIE = { nom: 'React', experience: '> 5 ANS' };

export class CompetencesPrimitives {
// Utilitaires
  private static attendreAutoSave(): void {
    cy.log('Attente sauvegarde automatique...');
    cy.wait(2500);
  }

  // en v1 le select est un mat-select overlay, il faut cliquer puis choisir dans le panneau
  private static selectionnerExperienceV1(nom: string, experience: string): void {
    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, 'v1');
    const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, 'v1');
    const selectExp = getSelector(SECTION_COMPETENCES.SELECT_EXPERIENCE, 'v1');
  
    cy.get(`${rowSelector} ${inputComp}`)
      .filter((_i, el) => (el as HTMLInputElement).value === nom)
      .first()
      .closest(rowSelector)
      .scrollIntoView()
      .within(() => {
        cy.get(selectExp).click({ force: true });
      });
  
    cy.get('.cdk-overlay-container mat-option', { timeout: 10000 })
      .contains(experience)
      .click({ force: true });
  }

  // Recherche

  static trouverLigneParNom(version: Version, nom: string): void {
    cy.log(`Recherche ligne compétence "${nom}"`);

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

  // retourne vrai via callback si la compétence existe déjà, sans lever d'assertion Cypress
  private static competenceExiste(version: Version, nom: string, callback: (existe: boolean) => void): void {
    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
    const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);

    if (version === 'v1') {
      cy.get(`${rowSelector} ${inputComp}`).then($inputs => {
        const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
        callback(found.length > 0);
      });
    } else {
      cy.get('body').then($body => {
        callback($body.find(`${rowSelector}:contains("${nom}")`).length > 0);
      });
    }
  }

  // Préparation

  // ajoute la compétence si elle n'est pas déjà là
  static garantirCompetenceExiste(
    version: Version,
    nom: string,
    experience: string = '3 ANS'
  ): void {
    cy.log(`PRÉPARATION: Garantir compétence "${nom}"`);

    CompetencesPrimitives.competenceExiste(version, nom, (existe) => {
      if (!existe) {
        CompetencesPrimitives.ajouterCompetence(version, nom, experience);
      } else {
        cy.log(`Compétence "${nom}" déjà présente`);
      }
    });
  }

  // Ajout

  static ajouterCompetence(
    version: Version,
    nom: string = FIXTURE_COMPETENCE.nom,
    experience: string = FIXTURE_COMPETENCE.experience
  ): void {
    cy.log(`Ajout compétence "${nom}" — ${experience}`);

    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
    const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
    const selectExp = getSelector(SECTION_COMPETENCES.SELECT_EXPERIENCE, version);

    if (version === 'v1') {
      // on prend la première ligne vide et on tape le nom
      cy.get(`${rowSelector} ${inputComp}`)
        .filter((_i, el) => (el as HTMLInputElement).value === '')
        .first()
        .scrollIntoView()
        .clear()
        .type(nom)
        .blur();

      CompetencesPrimitives.selectionnerExperienceV1(nom, experience);
      CompetencesPrimitives.attendreAutoSave();

      // on vérifie que la ligne est bien là après sauvegarde
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

    cy.log(`Compétence "${nom}" ajoutée`);
  }

  // Modification

  static modifierCompetence(
    version: Version,
    ancienNom: string,
    nouveauNom: string = FIXTURE_COMPETENCE_MODIFIE.nom,
    nouvelleExp: string = FIXTURE_COMPETENCE_MODIFIE.experience
  ): void {
    cy.log(`Modification "${ancienNom}" → "${nouveauNom}" (${nouvelleExp})`);

    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
    const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
    const selectExp = getSelector(SECTION_COMPETENCES.SELECT_EXPERIENCE, version);

    if (version === 'v1') {
      // on efface l'ancien nom et on tape le nouveau
      cy.get(`${rowSelector} ${inputComp}`, { timeout: 10000 })
        .filter((_i, el) => (el as HTMLInputElement).value === ancienNom)
        .first()
        .scrollIntoView()
        .clear()
        .type(nouveauNom)
        .blur();

      // mise à jour du niveau d'expérience
      CompetencesPrimitives.selectionnerExperienceV1(nouveauNom, nouvelleExp);
      CompetencesPrimitives.attendreAutoSave();

    } else {
      CompetencesPrimitives.trouverLigneParNom(version, ancienNom);
      cy.get('@ligneCompetence').scrollIntoView().within(() => {
        cy.get(inputComp).clear().type(nouveauNom).blur();
        cy.get(selectExp).select(nouvelleExp);
      });
      CompetencesPrimitives.attendreAutoSave();
    }

    cy.log(`Compétence modifiée`);
  }

  // Suppression

  static supprimerCompetence(version: Version, nom: string): void {
    cy.log(`Suppression compétence "${nom}"`);

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
            cy.log(`"${nom}" supprimé`);
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

  // Visibilité

  static toggleVisibilite(version: Version, nom: string, activer: boolean): void {
    cy.log(`${activer ? 'Rendre visible' : 'Masquer'} "${nom}"`);

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

  // Tri / Ordre

  static changerTri(version: Version, nom: string, position: string): void {
    cy.log(`Changer tri de "${nom}" → position ${position}`);

    const ordreSelector = getSelector(SECTION_COMPETENCES.COL_ORDRE, version);

    CompetencesPrimitives.trouverLigneParNom(version, nom);

    if (version === 'v1') {
      // en v1 on lit d'abord la valeur actuelle du tri pour éviter de re-sélectionner la même
      cy.get('@ligneCompetence').scrollIntoView().within(() => {
        cy.get(ordreSelector).find('.mat-mdc-select-value-text, .mat-select-value-text')
          .invoke('text')
          .then((triActuel) => {
            const triNettoye = triActuel.trim();
            if (triNettoye === position) {
              cy.log(`Tri déjà à la position ${position}, pas de changement nécessaire`);
            } else {
              cy.get(ordreSelector).click({ force: true });
            }
          });
      });

      // on sélectionne la nouvelle position seulement si l'overlay est ouvert
      cy.get('body').then($body => {
        if ($body.find('.cdk-overlay-container mat-option').length > 0) {
          cy.get('.cdk-overlay-container mat-option', { timeout: 10000 })
            .contains(new RegExp(`^\\s*${position}\\s*$`))
            .click({ force: true });

          CompetencesPrimitives.attendreAutoSave();
        }
      });

    } else {
      cy.get('@ligneCompetence').scrollIntoView().within(() => {
        cy.get(ordreSelector).select(position);
      });
      CompetencesPrimitives.attendreAutoSave();
    }
  }

  static verifierPosition(version: Version, nom: string, positionAttendue: string): void {
    cy.log(`Vérifier que "${nom}" est en position ${positionAttendue}`);

    const rowSelector = getSelector(SECTION_COMPETENCES.ROW, version);
    const inputComp = getSelector(SECTION_COMPETENCES.INPUT_COMPETENCE, version);
    const posIndex = parseInt(positionAttendue, 10) - 1;

    if (version === 'v1') {
      cy.get(`${rowSelector}`, { timeout: 10000 })
        .eq(posIndex)
        .find(inputComp)
        .should(($input) => {
          expect(($input[0] as HTMLInputElement).value).to.equal(nom);
        });
    } else {
      cy.get(rowSelector)
        .eq(posIndex)
        .should('contain', nom);
    }
  }

  // Vérifications

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