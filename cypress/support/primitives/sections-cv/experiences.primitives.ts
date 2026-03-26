import {
    Version, getSelector,
    SECTION_EXPERIENCES
  } from '../../config/section/selectors-experiences.config';
  
  interface ExperienceData {
    titre: string;
    societe: string;
    lieu: string;
    debut: string;
    fin?: string;
  }
  
  const FIXTURE_EXPERIENCE: ExperienceData = {
    titre: 'Développeur Angular',
    societe: 'REDSEN',
    lieu: 'Genève',
    debut: '01/2024',
    fin: '06/2024'
  };
  
  const FIXTURE_EXPERIENCE_MODIFIEE: ExperienceData = {
    titre: 'Lead Developer',
    societe: 'Anthropic',
    lieu: 'Paris',
    debut: '07/2024',
    fin: '12/2024'
  };
  
  export class ExperiencesPrimitives {
// Utilitaires
    private static attendreAutoSave(): void {
      cy.log('Attente sauvegarde automatique...');
      cy.wait(2500);
    }
  
    private static remplirChamp(selector: string, valeur: string): void {
      cy.get(selector).clear().type(valeur).blur();
    }
  
    // Recherche
  
    static trouverLigneParTitre(version: Version, titre: string): void {
      cy.log(`Recherche ligne expérience "${titre}"`);
  
      const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
      const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputTitre}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === titre)
          .first()
          .closest(rowSelector)
          .first()
          .scrollIntoView()
          .as('ligneExperience');
      } else {
        cy.contains(rowSelector, titre).scrollIntoView().as('ligneExperience');
      }
    }
  
    // retourne vrai via callback si l'expérience existe déjà
    private static experienceExiste(version: Version, titre: string, callback: (existe: boolean) => void): void {
      const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
      const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputTitre}`).then($inputs => {
          const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === titre);
          callback(found.length > 0);
        });
      } else {
        cy.get('body').then($body => {
          callback($body.find(`${rowSelector}:contains("${titre}")`).length > 0);
        });
      }
    }
  
    // Préparation
  
    static garantirExperienceExiste(
      version: Version,
      titre: string,
      societe: string = FIXTURE_EXPERIENCE.societe,
      lieu: string = FIXTURE_EXPERIENCE.lieu,
      debut: string = FIXTURE_EXPERIENCE.debut,
      fin?: string
    ): void {
      cy.log(`PRÉPARATION: Garantir expérience "${titre}"`);
  
      ExperiencesPrimitives.experienceExiste(version, titre, (existe) => {
        if (!existe) {
          ExperiencesPrimitives.ajouterExperience(version, { titre, societe, lieu, debut, fin });
        } else {
          cy.log(`Expérience "${titre}" déjà présente`);
        }
      });
    }
  
    // Ajout
  
    static ajouterExperience(
      version: Version,
      data: ExperienceData = FIXTURE_EXPERIENCE
    ): void {
      cy.log(`Ajout expérience "${data.titre}" — ${data.societe}`);
  
      const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
      const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
      const inputSociete = getSelector(SECTION_EXPERIENCES.INPUT_SOCIETE, version);
      const inputLieu = getSelector(SECTION_EXPERIENCES.INPUT_LIEU, version);
      const inputDebut = getSelector(SECTION_EXPERIENCES.INPUT_DEBUT, version);
      const inputFin = getSelector(SECTION_EXPERIENCES.INPUT_FIN, version);
  
      if (version === 'v1') {
        // on prend la dernière ligne (vide) et on remplit les champs
        cy.get(`${rowSelector} ${inputTitre}`)
          .filter((_i, el) => (el as HTMLInputElement).value === '')
          .first()
          .closest(rowSelector)
          .first()
          .scrollIntoView()
          .within(() => {
            ExperiencesPrimitives.remplirChamp(inputTitre, data.titre);
            ExperiencesPrimitives.remplirChamp(inputSociete, data.societe);
            ExperiencesPrimitives.remplirChamp(inputLieu, data.lieu);
            ExperiencesPrimitives.remplirChamp(inputDebut, data.debut);
            if (data.fin) {
              ExperiencesPrimitives.remplirChamp(inputFin, data.fin);
            }
          });
  
        ExperiencesPrimitives.attendreAutoSave();
  
        // vérification après sauvegarde
        cy.get(`${rowSelector} ${inputTitre}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === data.titre)
          .should('have.length.greaterThan', 0);
  
      } else {
        cy.get(rowSelector).last().scrollIntoView().within(() => {
          ExperiencesPrimitives.remplirChamp(inputTitre, data.titre);
          ExperiencesPrimitives.remplirChamp(inputSociete, data.societe);
          ExperiencesPrimitives.remplirChamp(inputLieu, data.lieu);
          ExperiencesPrimitives.remplirChamp(inputDebut, data.debut);
          if (data.fin) {
            ExperiencesPrimitives.remplirChamp(inputFin, data.fin);
          }
        });
        ExperiencesPrimitives.attendreAutoSave();
      }
  
      cy.log(`Expérience "${data.titre}" ajoutée`);
    }
  
    // Modification
  
    static modifierExperience(
      version: Version,
      ancienTitre: string,
      nouvelleData: Partial<ExperienceData> = FIXTURE_EXPERIENCE_MODIFIEE
    ): void {
      cy.log(`Modification "${ancienTitre}" → "${nouvelleData.titre || ancienTitre}"`);
  
      const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
      const inputSociete = getSelector(SECTION_EXPERIENCES.INPUT_SOCIETE, version);
      const inputLieu = getSelector(SECTION_EXPERIENCES.INPUT_LIEU, version);
      const inputDebut = getSelector(SECTION_EXPERIENCES.INPUT_DEBUT, version);
      const inputFin = getSelector(SECTION_EXPERIENCES.INPUT_FIN, version);
  
      ExperiencesPrimitives.trouverLigneParTitre(version, ancienTitre);
  
      cy.get('@ligneExperience').scrollIntoView().within(() => {
        if (nouvelleData.titre) {
          ExperiencesPrimitives.remplirChamp(inputTitre, nouvelleData.titre);
        }
        if (nouvelleData.societe) {
          ExperiencesPrimitives.remplirChamp(inputSociete, nouvelleData.societe);
        }
        if (nouvelleData.lieu) {
          ExperiencesPrimitives.remplirChamp(inputLieu, nouvelleData.lieu);
        }
        if (nouvelleData.debut) {
          ExperiencesPrimitives.remplirChamp(inputDebut, nouvelleData.debut);
        }
        if (nouvelleData.fin) {
          ExperiencesPrimitives.remplirChamp(inputFin, nouvelleData.fin);
        }
      });
  
      ExperiencesPrimitives.attendreAutoSave();
      cy.log(`Expérience modifiée`);
    }
  
    // Suppression
  
    static supprimerExperience(version: Version, titre: string): void {
      cy.log(`Suppression expérience "${titre}"`);
  
      const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
      const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
  
      if (version === 'v1') {
        const supprimerSiExiste = () => {
          cy.get(`${rowSelector} ${inputTitre}`).then($inputs => {
            const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === titre);
            if (found.length > 0) {
              cy.wrap(found.first()).closest(rowSelector).first().scrollIntoView().within(() => {
                cy.get(getSelector(SECTION_EXPERIENCES.BTN_MENU_CONTEXTUEL, version)).click({ force: true });
              });
              cy.get('.mat-mdc-menu-panel').should('be.visible').contains('button', 'Supprimer').click();
              cy.wait(2500).then(() => supprimerSiExiste());
            } else {
              cy.log(`"${titre}" supprimé`);
            }
          });
        };
        supprimerSiExiste();
      } else {
        ExperiencesPrimitives.trouverLigneParTitre(version, titre);
        cy.get('@ligneExperience').scrollIntoView().within(() => {
          cy.get(getSelector(SECTION_EXPERIENCES.BTN_SUPPRIMER, version)).click();
        });
        ExperiencesPrimitives.attendreAutoSave();
      }
    }
  
    // Visibilité
  
    static toggleVisibilite(version: Version, titre: string, activer: boolean): void {
      cy.log(`${activer ? 'Rendre visible' : 'Masquer'} "${titre}"`);
  
      ExperiencesPrimitives.trouverLigneParTitre(version, titre);
  
      cy.get('@ligneExperience').scrollIntoView().within(() => {
        const sel = getSelector(SECTION_EXPERIENCES.COL_AFFICHER, version);
        cy.get(sel).find('input[type="checkbox"]').then($input => {
          const isChecked = $input.is(':checked');
          if ((activer && !isChecked) || (!activer && isChecked)) {
            cy.get(sel).find('input[type="checkbox"]').click({ force: true });
          }
        });
      });
  
      ExperiencesPrimitives.attendreAutoSave();
    }
  
    // Tri / Ordre
  
    static changerTri(version: Version, titre: string, position: string): void {
      cy.log(`Changer tri de "${titre}" → position ${position}`);
  
      const ordreSelector = getSelector(SECTION_EXPERIENCES.COL_ORDRE, version);
  
      ExperiencesPrimitives.trouverLigneParTitre(version, titre);
  
      if (version === 'v1') {
        cy.get('@ligneExperience').scrollIntoView().within(() => {
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
  
            ExperiencesPrimitives.attendreAutoSave();
          }
        });
  
      } else {
        cy.get('@ligneExperience').scrollIntoView().within(() => {
          cy.get(ordreSelector).select(position);
        });
        ExperiencesPrimitives.attendreAutoSave();
      }
    }
  
    static verifierPosition(version: Version, titre: string, positionAttendue: string): void {
      cy.log(`Vérifier que "${titre}" est en position ${positionAttendue}`);
  
      const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
      const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
      const posIndex = parseInt(positionAttendue, 10) - 1;
  
      if (version === 'v1') {
        cy.get(`${rowSelector}`, { timeout: 10000 })
          .eq(posIndex)
          .find(inputTitre)
          .should(($input) => {
            expect(($input[0] as HTMLInputElement).value).to.equal(titre);
          });
      } else {
        cy.get(rowSelector)
          .eq(posIndex)
          .should('contain', titre);
      }
    }
  
    // Vérifications
  
    static verifierExiste(version: Version, titre: string): void {
      const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
      const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
  
      if (version === 'v1') {
        cy.get(`${rowSelector} ${inputTitre}`, { timeout: 10000 })
          .filter((_i, el) => (el as HTMLInputElement).value === titre)
          .should('have.length.greaterThan', 0);
      } else {
        cy.contains(rowSelector, titre).scrollIntoView().should('exist');
      }
    }
  
    static verifierAbsente(version: Version, titre: string): void {
      const rowSelector = getSelector(SECTION_EXPERIENCES.ROW, version);
      const inputTitre = getSelector(SECTION_EXPERIENCES.INPUT_TITRE, version);
  
      if (version === 'v1') {
        cy.wait(3000);
        cy.get(`${rowSelector} ${inputTitre}`).then($inputs => {
          const found = $inputs.filter((_i, el) => (el as HTMLInputElement).value === titre);
          expect(found.length).to.equal(0);
        });
      } else {
        cy.contains(rowSelector, titre).should('not.exist');
      }
    }
  
    static verifierVisibilite(version: Version, titre: string, attenduVisible: boolean): void {
      ExperiencesPrimitives.trouverLigneParTitre(version, titre);
      cy.get('@ligneExperience').scrollIntoView().within(() => {
        cy.get(getSelector(SECTION_EXPERIENCES.COL_AFFICHER, version))
          .find('input[type="checkbox"]')
          .then($input => expect($input.is(':checked')).to.equal(attenduVisible));
      });
    }
  
    static verifierChamps(version: Version, titre: string, societe: string, lieu: string): void {
      ExperiencesPrimitives.trouverLigneParTitre(version, titre);
      cy.get('@ligneExperience').scrollIntoView().within(() => {
        const inputSociete = getSelector(SECTION_EXPERIENCES.INPUT_SOCIETE, version);
        const inputLieu = getSelector(SECTION_EXPERIENCES.INPUT_LIEU, version);
  
        if (version === 'v1') {
          cy.get(inputSociete).should(($el) => {
            expect(($el[0] as HTMLInputElement).value).to.equal(societe);
          });
          cy.get(inputLieu).should(($el) => {
            expect(($el[0] as HTMLInputElement).value).to.equal(lieu);
          });
        } else {
          cy.get(inputSociete).should('have.value', societe);
          cy.get(inputLieu).should('have.value', lieu);
        }
      });
    }
  }