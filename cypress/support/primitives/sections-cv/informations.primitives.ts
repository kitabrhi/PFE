import {
    Version, getSelector,
    SECTION_INFORMATIONS
  } from '../../config/section/selectors-informations.config';
  
  // Valeurs de test gardées côté primitives pour ne pas charger les fichiers feature.
  
  const FIXTURE_PRENOM        = 'Jean';
  const FIXTURE_NOM           = 'Dupont';
  const FIXTURE_DATE_NAISSANCE  = '15/06/1995';
  const FIXTURE_DEBUT_ACTIVITE  = '01/09/2018';
  const FIXTURE_PHOTO         = 'cypress/fixtures/photo-test.jpg';
  
  export class InformationsPrimitives {
  
    // Petit utilitaire commun aux champs de la section.
  
    private static attendreAutoSave(): void {
      cy.log('⏳ Attente sauvegarde automatique...');
      cy.wait(2500);
    }
  
    // Photo de profil.
    static uploaderPhoto(version: Version, cheminFichier: string = FIXTURE_PHOTO): void {
        cy.log(`📷 Upload photo : ${cheminFichier}`);
    
        cy.get(getSelector(SECTION_INFORMATIONS.PHOTO_UPLOAD_ZONE, version), {
          timeout: 10000
        }).selectFile(cheminFichier, { force: true });
    
        InformationsPrimitives.attendreAutoSave();
        cy.log('✅ Photo uploadée');
      }
    
      static verifierPhotoPresente(version: Version): void {
        cy.log('🔍 Vérification présence photo uploadée');
    
        if (version === 'v1') {
          // En v1, on confirme l'upload via l'aperçu image.
          cy.get('.image-preview img', { timeout: 10000 })
            .should('exist')
            .and('be.visible');
        } else {
          cy.get(getSelector(SECTION_INFORMATIONS.PHOTO_PREVIEW, version), {
            timeout: 10000
          }).should('exist').and('be.visible');
        }
      }
  
    // Email non modifiable.
  
    static verifierEmailAffiche(version: Version): void {
        cy.log('🔍 Vérification email affiché');
    
        cy.get(getSelector(SECTION_INFORMATIONS.EMAIL_DISPLAY, version), {
          timeout: 10000
        })
          .should('exist')
          .and('be.visible');
      }
  
    static verifierEmailNonEditable(version: Version): void {
      cy.log('🔍 Vérification email non éditable');
  
      cy.get(getSelector(SECTION_INFORMATIONS.EMAIL_DISPLAY, version), {
        timeout: 10000
      })
        .should('exist')
        .then($el => {
          // En v1, l'email est rendu comme texte simple.
          expect($el.is('input')).to.be.false;
          expect($el.attr('contenteditable')).to.not.equal('true');
        });
    }
  
    // Prénom.
  
    static modifierPrenom(version: Version, valeur: string = FIXTURE_PRENOM): void {
      cy.log(`✏️ Modification prénom → "${valeur}"`);
  
      if (version === 'v1') {
        // En v1, le sélecteur vise le conteneur ; il faut descendre sur l'input réel.
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_PRENOM, version), {
          timeout: 10000
        })
          .find('input')
          .clear()
          .type(valeur)
          .blur();
      } else {
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_PRENOM, version), {
          timeout: 10000
        })
          .clear()
          .type(valeur)
          .blur();
      }
  
      InformationsPrimitives.attendreAutoSave();
      cy.log('✅ Prénom modifié');
    }
  
    static verifierPrenom(version: Version, valeur: string = FIXTURE_PRENOM): void {
      cy.log(`🔍 Vérification prénom = "${valeur}"`);
  
      if (version === 'v1') {
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_PRENOM, version), {
          timeout: 10000
        })
          .find('input')
          .should('have.value', valeur);
      } else {
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_PRENOM, version), {
          timeout: 10000
        })
          .should('have.value', valeur);
      }
    }
  
    // Nom.
  
    static modifierNom(version: Version, valeur: string = FIXTURE_NOM): void {
      cy.log(`✏️ Modification nom → "${valeur}"`);
  
      if (version === 'v1') {
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_NOM, version), {
          timeout: 10000
        })
          .find('input')
          .clear()
          .type(valeur)
          .blur();
      } else {
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_NOM, version), {
          timeout: 10000
        })
          .clear()
          .type(valeur)
          .blur();
      }
  
      InformationsPrimitives.attendreAutoSave();
      cy.log('✅ Nom modifié');
    }
  
    static verifierNom(version: Version, valeur: string = FIXTURE_NOM): void {
      cy.log(`🔍 Vérification nom = "${valeur}"`);
  
      if (version === 'v1') {
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_NOM, version), {
          timeout: 10000
        })
          .find('input')
          .should('have.value', valeur);
      } else {
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_NOM, version), {
          timeout: 10000
        })
          .should('have.value', valeur);
      }
    }
  
    // Dates.
  
    static modifierDateNaissance(version: Version, valeur: string = FIXTURE_DATE_NAISSANCE): void {
        cy.log(`✏️ Modification date de naissance → "${valeur}"`);
    
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_DATE_NAISSANCE, version), {
          timeout: 10000
        })
          .click({ force: true })
          .clear()
          .type(valeur, { force: true })
          .blur();
    
        InformationsPrimitives.attendreAutoSave();
        cy.log('✅ Date de naissance modifiée');
      }
    
      static verifierDateNaissance(version: Version, valeur: string = FIXTURE_DATE_NAISSANCE): void {
        cy.log(`🔍 Vérification date de naissance = "${valeur}"`);
    
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_DATE_NAISSANCE, version), {
          timeout: 10000
        }).should('have.value', valeur);
      }
    
      static modifierDebutActivite(version: Version, valeur: string = FIXTURE_DEBUT_ACTIVITE): void {
        cy.log(`✏️ Modification début activité → "${valeur}"`);
    
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_DEBUT_ACTIVITE, version), {
          timeout: 10000
        })
          .click({ force: true })
          .clear()
          .type(valeur, { force: true })
          .blur();
    
        InformationsPrimitives.attendreAutoSave();
        cy.log('✅ Début activité modifié');
      }
    
      static verifierDebutActivite(version: Version, valeur: string = FIXTURE_DEBUT_ACTIVITE): void {
        cy.log(`🔍 Vérification début activité = "${valeur}"`);
    
        cy.get(getSelector(SECTION_INFORMATIONS.INPUT_DEBUT_ACTIVITE, version), {
          timeout: 10000
        }).should('have.value', valeur);
      }
  }
