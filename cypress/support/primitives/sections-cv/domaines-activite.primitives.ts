import {
    Version, getSelector,
    SECTION_DOMAINES_ACTIVITE
  } from '../../config/section/selectors-domaines-activite.config';
  
  const FIXTURE_DOMAINE = { nom: 'Santé', experience: '3 ANS' };
  const FIXTURE_DOMAINE_MODIFIE = { nom: 'Finance', experience: '> 5 ANS' };
  
  export class DomainesActivitePrimitives {
// Utilitaires
    private static attendreAutoSave(): void {
      cy.log('Attente sauvegarde automatique...');
      cy.wait(2500);
    }
  
    // en v1 le select est un mat-select overlay, il faut cliquer puis choisir dans le panneau
    private static selectionnerExperienceV1(nom: string, experience: string): void {
      const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, 'v1');
      const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, 'v1');
      const selectExp = getSelector(SECTION_DOMAINES_ACTIVITE.SELECT_EXPERIENCE, 'v1');
  
      cy.get(`${rowSelector} ${inputDomaine}`)
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
      cy.log(`Recherche ligne domaine d'activité "${nom}"`);
  
      const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
      const inputSelector = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === nom)
          .first()
          .closest(rowSelector)
          .first()
          .scrollIntoView()
          .as('ligneDomaine');
      } else {
        cy.contains(rowSelector, nom).scrollIntoView().as('ligneDomaine');
      }
    }
  
    // retourne vrai via callback si le domaine existe déjà, sans lever d'assertion Cypress
    private static domaineExiste(version: Version, nom: string, callback: (existe: boolean) => void): void {
      const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
      const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputDomaine}`).then($inputs => {
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
  
    // ajoute le domaine s'il n'est pas déjà là
    static garantirDomaineExiste(
      version: Version,
      nom: string,
      experience: string = '3 ANS'
    ): void {
      cy.log(`PRÉPARATION: Garantir domaine d'activité "${nom}"`);
  
      DomainesActivitePrimitives.domaineExiste(version, nom, (existe) => {
        if (!existe) {
          DomainesActivitePrimitives.ajouterDomaine(version, nom, experience);
        } else {
          cy.log(`Domaine "${nom}" déjà présent`);
        }
      });
    }
  
    // Ajout
  
    static ajouterDomaine(
      version: Version,
      nom: string = FIXTURE_DOMAINE.nom,
      experience: string = FIXTURE_DOMAINE.experience
    ): void {
      cy.log(`Ajout domaine d'activité "${nom}" — ${experience}`);
  
      const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
      const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
      const selectExp = getSelector(SECTION_DOMAINES_ACTIVITE.SELECT_EXPERIENCE, version);
  
      if (version === 'v1') {
        // on prend la première ligne vide et on tape le nom
        cy.get(`${rowSelector} ${inputDomaine}`)
          .filter((_i, el) => (el as HTMLInputElement).value === '')
          .first()
          .scrollIntoView()
          .clear()
          .type(nom)
          .blur();
  
        DomainesActivitePrimitives.selectionnerExperienceV1(nom, experience);
        DomainesActivitePrimitives.attendreAutoSave();
  
        // on vérifie que la ligne est bien là après sauvegarde
        cy.get(`${rowSelector} ${inputDomaine}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === nom)
          .should('have.length.greaterThan', 0);
  
      } else {
        cy.get(rowSelector).last().scrollIntoView().within(() => {
          cy.get(inputDomaine).clear().type(nom).blur();
          cy.get(selectExp).select(experience);
        });
        DomainesActivitePrimitives.attendreAutoSave();
      }
  
      cy.log(`Domaine "${nom}" ajouté`);
    }
  
    // Modification
  
    static modifierDomaine(
      version: Version,
      ancienNom: string,
      nouveauNom: string = FIXTURE_DOMAINE_MODIFIE.nom,
      nouvelleExp: string = FIXTURE_DOMAINE_MODIFIE.experience
    ): void {
      cy.log(`Modification "${ancienNom}" → "${nouveauNom}" (${nouvelleExp})`);
  
      const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
      const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
      const selectExp = getSelector(SECTION_DOMAINES_ACTIVITE.SELECT_EXPERIENCE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputDomaine}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === ancienNom)
          .first()
          .scrollIntoView()
          .clear()
          .type(nouveauNom)
          .blur();
  
        DomainesActivitePrimitives.selectionnerExperienceV1(nouveauNom, nouvelleExp);
        DomainesActivitePrimitives.attendreAutoSave();
  
      } else {
        DomainesActivitePrimitives.trouverLigneParNom(version, ancienNom);
        cy.get('@ligneDomaine').scrollIntoView().within(() => {
          cy.get(inputDomaine).clear().type(nouveauNom).blur();
          cy.get(selectExp).select(nouvelleExp);
        });
        DomainesActivitePrimitives.attendreAutoSave();
      }
  
      cy.log(`Domaine modifié`);
    }
  
    // Suppression
  
    static supprimerDomaine(version: Version, nom: string): void {
      cy.log(`Suppression domaine d'activité "${nom}"`);
  
      const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
      const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
  
      if (version === 'v1') {
        const supprimerSiExiste = () => {
          cy.get(`${rowSelector} ${inputDomaine}`).then($inputs => {
            const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
            if (found.length > 0) {
              cy.wrap(found.first()).closest(rowSelector).first().scrollIntoView().within(() => {
                cy.get(getSelector(SECTION_DOMAINES_ACTIVITE.BTN_MENU_CONTEXTUEL, version)).click({ force: true });
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
        DomainesActivitePrimitives.trouverLigneParNom(version, nom);
        cy.get('@ligneDomaine').scrollIntoView().within(() => {
          cy.get(getSelector(SECTION_DOMAINES_ACTIVITE.BTN_SUPPRIMER, version)).click();
        });
        DomainesActivitePrimitives.attendreAutoSave();
      }
    }
  
    // Visibilité
  
    static toggleVisibilite(version: Version, nom: string, activer: boolean): void {
      cy.log(`${activer ? 'Rendre visible' : 'Masquer'} "${nom}"`);
  
      DomainesActivitePrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneDomaine').scrollIntoView().within(() => {
        const sel = getSelector(SECTION_DOMAINES_ACTIVITE.COL_AFFICHER, version);
        cy.get(sel).find('input[type="checkbox"]').then($input => {
          const isChecked = $input.is(':checked');
          if ((activer && !isChecked) || (!activer && isChecked)) {
            cy.get(sel).find('input[type="checkbox"]').click({ force: true });
          }
        });
      });
  
      DomainesActivitePrimitives.attendreAutoSave();
    }
  
    // Vérifications
  
    static verifierExiste(version: Version, nom: string): void {
      const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
      const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputDomaine}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === nom)
          .should('have.length.greaterThan', 0);
      } else {
        cy.contains(rowSelector, nom).scrollIntoView().should('exist');
      }
    }
  
    static verifierAbsent(version: Version, nom: string): void {
      const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
      const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
  
      if (version === 'v1') {
        cy.wait(3000);
        cy.get(`${rowSelector} ${inputDomaine}`).then($inputs => {
          const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
          expect(found.length).to.equal(0);
        });
      } else {
        cy.contains(rowSelector, nom).should('not.exist');
      }
    }
  
    static verifierVisibilite(version: Version, nom: string, attenduVisible: boolean): void {
      DomainesActivitePrimitives.trouverLigneParNom(version, nom);
      cy.get('@ligneDomaine').scrollIntoView().within(() => {
        cy.get(getSelector(SECTION_DOMAINES_ACTIVITE.COL_AFFICHER, version))
          .find('input[type="checkbox"]')
          .then($input => expect($input.is(':checked')).to.equal(attenduVisible));
      });
    }
  
    // Tri / Ordre
  
    static changerTri(version: Version, nom: string, position: string): void {
      cy.log(`Changer tri de "${nom}" → position ${position}`);
  
      const ordreSelector = getSelector(SECTION_DOMAINES_ACTIVITE.COL_ORDRE, version);
  
      DomainesActivitePrimitives.trouverLigneParNom(version, nom);
  
      if (version === 'v1') {
        // en v1 on lit d'abord la valeur actuelle du tri pour éviter de re-sélectionner la même
        cy.get('@ligneDomaine').scrollIntoView().within(() => {
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
  
            DomainesActivitePrimitives.attendreAutoSave();
          }
        });
  
      } else {
        cy.get('@ligneDomaine').scrollIntoView().within(() => {
          cy.get(ordreSelector).select(position);
        });
        DomainesActivitePrimitives.attendreAutoSave();
      }
    }
  
    static verifierPosition(version: Version, nom: string, positionAttendue: string): void {
      cy.log(`Vérifier que "${nom}" est en position ${positionAttendue}`);
  
      const rowSelector = getSelector(SECTION_DOMAINES_ACTIVITE.ROW, version);
      const inputDomaine = getSelector(SECTION_DOMAINES_ACTIVITE.INPUT_DOMAINE, version);
      const posIndex = parseInt(positionAttendue, 10) - 1;
  
      if (version === 'v1') {
        // après le changement de tri, la page se réorganise
        // on vérifie que la ligne à l'index attendu contient le bon nom
        cy.get(`${rowSelector}`, { timeout: 10000 })
          .eq(posIndex)
          .find(inputDomaine)
          .should(($input) => {
            expect(($input[0] as HTMLInputElement).value).to.equal(nom);
          });
      } else {
        cy.get(rowSelector)
          .eq(posIndex)
          .should('contain', nom);
      }
    }
  }