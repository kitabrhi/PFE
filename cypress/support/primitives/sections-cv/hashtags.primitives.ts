import {
    Version, getSelector,
    SECTION_HASHTAGS
  } from '../../config/section/selectors-hashtags.config';
  
  const FIXTURE_HASHTAG = { nom: 'Chef de projet' };
  const FIXTURE_HASHTAG_MODIFIE = { nom: 'Scrum Master' };
  
  export class HashtagsPrimitives {
// Utilitaires
    private static attendreAutoSave(): void {
      cy.log('Attente sauvegarde automatique...');
      cy.wait(2500);
    }
  
    // Recherche
  
    static trouverLigneParNom(version: Version, nom: string): void {
      cy.log(`Recherche ligne hashtag "${nom}"`);
  
      const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
      const inputSelector = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputSelector}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === nom)
          .first()
          .closest(rowSelector)
          .first()
          .scrollIntoView()
          .as('ligneHashtag');
      } else {
        cy.contains(rowSelector, nom).scrollIntoView().as('ligneHashtag');
      }
    }
  
    // retourne vrai via callback si le hashtag existe déjà
    private static hashtagExiste(version: Version, nom: string, callback: (existe: boolean) => void): void {
      const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
      const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputHashtag}`).then($inputs => {
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
  
    static garantirHashtagExiste(version: Version, nom: string): void {
      cy.log(`PRÉPARATION: Garantir hashtag "${nom}"`);
  
      HashtagsPrimitives.hashtagExiste(version, nom, (existe) => {
        if (!existe) {
          HashtagsPrimitives.ajouterHashtag(version, nom);
        } else {
          cy.log(`Hashtag "${nom}" déjà présent`);
        }
      });
    }
  
    // Ajout
  
    static ajouterHashtag(
      version: Version,
      nom: string = FIXTURE_HASHTAG.nom
    ): void {
      cy.log(`Ajout hashtag "${nom}"`);
  
      const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
      const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);
  
      if (version === 'v1') {
        // on prend la première ligne vide et on tape le nom
        cy.get(`${rowSelector} ${inputHashtag}`)
          .filter((_i, el) => (el as HTMLInputElement).value === '')
          .first()
          .scrollIntoView()
          .clear()
          .type(nom)
          .blur();
  
        HashtagsPrimitives.attendreAutoSave();
  
        // on vérifie que la ligne est bien là après sauvegarde
        cy.get(`${rowSelector} ${inputHashtag}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === nom)
          .should('have.length.greaterThan', 0);
  
      } else {
        cy.get(rowSelector).last().scrollIntoView().within(() => {
          cy.get(inputHashtag).clear().type(nom).blur();
        });
        HashtagsPrimitives.attendreAutoSave();
      }
  
      cy.log(`Hashtag "${nom}" ajouté`);
    }
  
    // Modification
  
    static modifierHashtag(
      version: Version,
      ancienNom: string,
      nouveauNom: string = FIXTURE_HASHTAG_MODIFIE.nom
    ): void {
      cy.log(`Modification "${ancienNom}" → "${nouveauNom}"`);
  
      const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
      const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputHashtag}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === ancienNom)
          .first()
          .scrollIntoView()
          .clear()
          .type(nouveauNom)
          .blur();
  
        HashtagsPrimitives.attendreAutoSave();
  
      } else {
        HashtagsPrimitives.trouverLigneParNom(version, ancienNom);
        cy.get('@ligneHashtag').scrollIntoView().within(() => {
          cy.get(inputHashtag).clear().type(nouveauNom).blur();
        });
        HashtagsPrimitives.attendreAutoSave();
      }
  
      cy.log(`Hashtag modifié`);
    }
  
    // Suppression
  
    static supprimerHashtag(version: Version, nom: string): void {
      cy.log(`Suppression hashtag "${nom}"`);
  
      const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
      const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);
  
      if (version === 'v1') {
        const supprimerSiExiste = () => {
          cy.get(`${rowSelector} ${inputHashtag}`).then($inputs => {
            const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
            if (found.length > 0) {
              cy.wrap(found.first()).closest(rowSelector).first().scrollIntoView().within(() => {
                cy.get(getSelector(SECTION_HASHTAGS.BTN_MENU_CONTEXTUEL, version)).click({ force: true });
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
        HashtagsPrimitives.trouverLigneParNom(version, nom);
        cy.get('@ligneHashtag').scrollIntoView().within(() => {
          cy.get(getSelector(SECTION_HASHTAGS.BTN_SUPPRIMER, version)).click();
        });
        HashtagsPrimitives.attendreAutoSave();
      }
    }
  
    // Visibilité
  
    static toggleVisibilite(version: Version, nom: string, activer: boolean): void {
      cy.log(`${activer ? 'Rendre visible' : 'Masquer'} "${nom}"`);
  
      HashtagsPrimitives.trouverLigneParNom(version, nom);
  
      cy.get('@ligneHashtag').scrollIntoView().within(() => {
        const sel = getSelector(SECTION_HASHTAGS.COL_AFFICHER, version);
        cy.get(sel).find('input[type="checkbox"]').then($input => {
          const isChecked = $input.is(':checked');
          if ((activer && !isChecked) || (!activer && isChecked)) {
            cy.get(sel).find('input[type="checkbox"]').click({ force: true });
          }
        });
      });
  
      HashtagsPrimitives.attendreAutoSave();
    }
  
    // Tri / Ordre
  
    static changerTri(version: Version, nom: string, position: string): void {
      cy.log(`Changer tri de "${nom}" → position ${position}`);
  
      const ordreSelector = getSelector(SECTION_HASHTAGS.COL_ORDRE, version);
  
      HashtagsPrimitives.trouverLigneParNom(version, nom);
  
      if (version === 'v1') {
        cy.get('@ligneHashtag').scrollIntoView().within(() => {
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
  
        cy.get('body').then($body => {
          if ($body.find('.cdk-overlay-container mat-option').length > 0) {
            cy.get('.cdk-overlay-container mat-option', { timeout: 10000 })
              .contains(new RegExp(`^\\s*${position}\\s*$`))
              .click({ force: true });
  
            HashtagsPrimitives.attendreAutoSave();
          }
        });
  
      } else {
        cy.get('@ligneHashtag').scrollIntoView().within(() => {
          cy.get(ordreSelector).select(position);
        });
        HashtagsPrimitives.attendreAutoSave();
      }
    }
  
    static verifierPosition(version: Version, nom: string, positionAttendue: string): void {
      cy.log(`Vérifier que "${nom}" est en position ${positionAttendue}`);
  
      const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
      const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);
      const posIndex = parseInt(positionAttendue, 10) - 1;
  
      if (version === 'v1') {
        cy.get(`${rowSelector}`, { timeout: 10000 })
          .eq(posIndex)
          .find(inputHashtag)
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
      const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
      const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputHashtag}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === nom)
          .should('have.length.greaterThan', 0);
      } else {
        cy.contains(rowSelector, nom).scrollIntoView().should('exist');
      }
    }
  
    static verifierAbsent(version: Version, nom: string): void {
      const rowSelector = getSelector(SECTION_HASHTAGS.ROW, version);
      const inputHashtag = getSelector(SECTION_HASHTAGS.INPUT_HASHTAG, version);
  
      if (version === 'v1') {
        cy.wait(3000);
        cy.get(`${rowSelector} ${inputHashtag}`).then($inputs => {
          const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === nom);
          expect(found.length).to.equal(0);
        });
      } else {
        cy.contains(rowSelector, nom).should('not.exist');
      }
    }
  
    static verifierVisibilite(version: Version, nom: string, attenduVisible: boolean): void {
      HashtagsPrimitives.trouverLigneParNom(version, nom);
      cy.get('@ligneHashtag').scrollIntoView().within(() => {
        cy.get(getSelector(SECTION_HASHTAGS.COL_AFFICHER, version))
          .find('input[type="checkbox"]')
          .then($input => expect($input.is(':checked')).to.equal(attenduVisible));
      });
    }
  }