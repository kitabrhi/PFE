import {
  Version,
  getSelector,
  SECTION_DIPLOMES,
} from '../../config/section/selectors-diplomes.config';

// données de test

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

export class DiplomesPrimitives {

  // Helpers

  private static attendreAutoSave(): void {
    cy.log('⏳ Attente sauvegarde automatique...');
    cy.wait(2500);
  }

  // vérifie si le diplôme est déjà dans la liste, sans lever d'assertion Cypress
  private static diplomeExiste(version: Version, nom: string, callback: (existe: boolean) => void): void {
    const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
    const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);

    if (version === 'v1') {
      cy.get(`${rowSelector} ${inputDiplome}`).then($inputs => {
        const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
        callback(found.length > 0);
      });
    } else {
      cy.get('body').then($body => {
        callback($body.find(`${rowSelector}:contains("${nom}")`).length > 0);
      });
    }
  }

  // remplit lieu et année dans la ligne du diplôme donné (v1 uniquement)
  private static remplirLieuEtAnneeV1(nom: string, lieu: string, annee: string): void {
    const rowSelector = getSelector(SECTION_DIPLOMES.ROW, 'v1');
    const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, 'v1');
    const inputLieu = getSelector(SECTION_DIPLOMES.INPUT_LIEU, 'v1');
    const inputAnnee = getSelector(SECTION_DIPLOMES.INPUT_ANNEE, 'v1');

    cy.get(`${rowSelector} ${inputDiplome}`)
      .filter((_i, el) => (el as HTMLInputElement).value === nom)
      .first()
      .closest(rowSelector)
      .within(() => {
        cy.get(inputLieu).clear().type(lieu).blur();
        cy.get(inputAnnee).clear().type(annee).blur();
      });
  }

  // Recherche

  // stocke la ligne du diplôme dans l'alias @ligneDiplome
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

  // cherche la dernière ligne vide pour un nouvel ajout
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

  // Préparation

  // crée le diplôme s'il n'est pas encore là
  static garantirDiplomeExiste(
    version: Version,
    nom: string,
    lieu: string = 'Université Hassan II',
    annee: string = '2024'
  ): void {
    cy.log(`🔧 PRÉPARATION: Garantir diplôme "${nom}"`);

    DiplomesPrimitives.diplomeExiste(version, nom, (existe) => {
      if (!existe) {
        cy.log(`➕ Diplôme "${nom}" inexistant → création`);
        DiplomesPrimitives.ajouterDiplome(version, nom, lieu, annee);
      } else {
        cy.log(`✅ Diplôme "${nom}" déjà présent`);
      }
    });
  }

  // Ajout

  static ajouterDiplome(
    version: Version,
    nom: string = FIXTURE_DIPLOME.nom,
    lieu: string = FIXTURE_DIPLOME.lieu,
    annee: string = FIXTURE_DIPLOME.annee
  ): void {
    cy.log(`➕ Ajout diplôme "${nom}" — ${lieu} (${annee})`);

    const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
    const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);

    if (version === 'v1') {
      // on prend la première ligne vide et on saisit le nom
      cy.get(`${rowSelector} ${inputDiplome}`)
        .filter((_index, el) => (el as HTMLInputElement).value === '')
        .first()
        .scrollIntoView()
        .clear()
        .type(nom)
        .blur();

      DiplomesPrimitives.remplirLieuEtAnneeV1(nom, lieu, annee);
      DiplomesPrimitives.attendreAutoSave();

      // on vérifie que c'est bien enregistré
      cy.get(`${rowSelector} ${inputDiplome}`, { timeout: 10000 })
        .filter((_index, el) => (el as HTMLInputElement).value === nom)
        .should('have.length.greaterThan', 0);

    } else {
      DiplomesPrimitives.trouverDerniereLigneVide(version);
      cy.get('@ligneDiplomeVide').scrollIntoView().within(() => {
        cy.get(inputDiplome).clear().type(nom).blur();
        cy.get(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).clear().type(lieu).blur();
        cy.get(getSelector(SECTION_DIPLOMES.INPUT_ANNEE, version)).select(annee);
      });
      DiplomesPrimitives.attendreAutoSave();
    }

    cy.log(`✅ Diplôme "${nom}" ajouté`);
  }

  // Modification

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

    if (version === 'v1') {
      // on change le nom
      cy.get(`${rowSelector} ${inputDiplome}`, { timeout: 10000 })
        .filter((_index, el) => (el as HTMLInputElement).value === ancienNom)
        .first()
        .scrollIntoView()
        .clear()
        .type(nouveauNom)
        .blur();

      // on met à jour lieu et année
      DiplomesPrimitives.remplirLieuEtAnneeV1(nouveauNom, nouveauLieu, nouvelleAnnee);
      DiplomesPrimitives.attendreAutoSave();

    } else {
      DiplomesPrimitives.trouverLigneParNom(version, ancienNom);
      cy.get('@ligneDiplome').scrollIntoView().within(() => {
        cy.get(inputDiplome).clear().type(nouveauNom).blur();
        cy.get(getSelector(SECTION_DIPLOMES.INPUT_LIEU, version)).clear().type(nouveauLieu).blur();
        cy.get(getSelector(SECTION_DIPLOMES.INPUT_ANNEE, version)).select(nouvelleAnnee);
      });
      DiplomesPrimitives.attendreAutoSave();
    }

    cy.log(`✅ Diplôme modifié`);
  }

  // Suppression

  static supprimerDiplome(version: Version, nom: string): void {
    cy.log(`🗑️ Suppression diplôme "${nom}"`);

    const rowSelector = getSelector(SECTION_DIPLOMES.ROW, version);
    const inputDiplome = getSelector(SECTION_DIPLOMES.INPUT_DIPLOME, version);

    if (version === 'v1') {
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
                cy.get(getSelector(SECTION_DIPLOMES.BTN_MENU_CONTEXTUEL, version))
                  .last()
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
      DiplomesPrimitives.trouverLigneParNom(version, nom);
      cy.get('@ligneDiplome').scrollIntoView().within(() => {
        cy.get(getSelector(SECTION_DIPLOMES.BTN_SUPPRIMER, version)).click();
      });
      DiplomesPrimitives.attendreAutoSave();
    }
  }

  // Visibilité

  static toggleVisibilite(version: Version, nom: string, activer: boolean): void {
    const action = activer ? 'Rendre visible' : 'Masquer';
    cy.log(`${activer ? '✅' : '⬜'} ${action} diplôme "${nom}"`);

    DiplomesPrimitives.trouverLigneParNom(version, nom);

    cy.get('@ligneDiplome').scrollIntoView().within(() => {
      const checkboxSelector = getSelector(SECTION_DIPLOMES.COL_AFFICHER, version);

      cy.get(checkboxSelector).then($cb => {
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

  // Ordre

  static changerOrdre(version: Version, nom: string, nouvelOrdre: number): void {
    cy.log(`🔢 Changer ordre diplôme "${nom}" → position ${nouvelOrdre}`);

    DiplomesPrimitives.trouverLigneParNom(version, nom);

    cy.get('@ligneDiplome').scrollIntoView().within(() => {
      cy.get(getSelector(SECTION_DIPLOMES.COL_ORDRE, version)).click();
    });

    if (version === 'v1') {
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

  // Vérifications

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
      cy.get(getSelector(SECTION_DIPLOMES.COL_AFFICHER, version))
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
