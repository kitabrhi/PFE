import {
  Version, getSelector,
  SECTION_INFORMATIONS
} from '../../config/section/selectors-informations.config';

const FIXTURE_PRENOM          = 'Jean';
const FIXTURE_NOM             = 'Dupont';
const FIXTURE_DATE_NAISSANCE  = '15/06/1995';
const FIXTURE_DEBUT_ACTIVITE  = '01/09/2018';
const FIXTURE_PHOTO           = 'cypress/fixtures/photo-test.jpg';

export class InformationsPrimitives {

  // Helpers

  private static attendreAutoSave(): void {
    cy.log('Attente sauvegarde automatique...');
    cy.wait(2500);
  }

  // en v1 les sélecteurs pointent sur mat-form-field, il faut descendre sur l'<input> réel
  private static saisirChampTexte(
    version: Version,
    selectorMap: { v1: string; v2: string },
    valeur: string
  ): void {
    const selector = getSelector(selectorMap, version);

    if (version === 'v1') {
      cy.get(selector, { timeout: 10000 })
        .find('input')
        .clear()
        .type(valeur)
        .blur();
    } else {
      cy.get(selector, { timeout: 10000 })
        .clear()
        .type(valeur)
        .blur();
    }

    InformationsPrimitives.attendreAutoSave();
  }

  // même logique v1/v2 que saisirChampTexte
  private static verifierChampTexte(
    version: Version,
    selectorMap: { v1: string; v2: string },
    valeur: string
  ): void {
    const selector = getSelector(selectorMap, version);

    if (version === 'v1') {
      cy.get(selector, { timeout: 10000 })
        .find('input')
        .should('have.value', valeur);
    } else {
      cy.get(selector, { timeout: 10000 })
        .should('have.value', valeur);
    }
  }

  // pour les datepickers : click + clear + type + blur
  private static saisirChampDate(
    version: Version,
    selectorMap: { v1: string; v2: string },
    valeur: string
  ): void {
    cy.get(getSelector(selectorMap, version), { timeout: 10000 })
      .click({ force: true })
      .clear()
      .type(valeur, { force: true })
      .blur();

    InformationsPrimitives.attendreAutoSave();
  }

  private static verifierChampDate(
    version: Version,
    selectorMap: { v1: string; v2: string },
    valeur: string
  ): void {
    cy.get(getSelector(selectorMap, version), { timeout: 10000 })
      .should('have.value', valeur);
  }

  // Photo de profil

  static uploaderPhoto(version: Version, cheminFichier: string = FIXTURE_PHOTO): void {
    cy.log(`Upload photo : ${cheminFichier}`);

    cy.get(getSelector(SECTION_INFORMATIONS.PHOTO_UPLOAD_ZONE, version), {
      timeout: 10000
    }).selectFile(cheminFichier, { force: true });

    InformationsPrimitives.attendreAutoSave();
    cy.log('Photo uploadée');
  }

  static verifierPhotoPresente(version: Version): void {
    cy.log('Vérification présence photo uploadée');

    const previewSelector = getSelector(SECTION_INFORMATIONS.PHOTO_PREVIEW, version);

    if (version === 'v1') {
      cy.get(previewSelector, { timeout: 10000 })
        .find('img')
        .should('exist')
        .and('be.visible');
    } else {
      cy.get(previewSelector, { timeout: 10000 })
        .should('exist')
        .and('be.visible');
    }
  }

  // Email (lecture seule)

  static verifierEmailAffiche(version: Version): void {
    cy.log('Vérification email affiché');

    cy.get(getSelector(SECTION_INFORMATIONS.EMAIL_DISPLAY, version), {
      timeout: 10000
    })
      .should('exist')
      .and('be.visible');
  }

  static verifierEmailNonEditable(version: Version): void {
    cy.log('Vérification email non éditable');

    cy.get(getSelector(SECTION_INFORMATIONS.EMAIL_DISPLAY, version), {
      timeout: 10000
    })
      .should('exist')
      .then($el => {
        expect($el.is('input')).to.be.false;
        expect($el.attr('contenteditable')).to.not.equal('true');
      });
  }

  // Prénom

  static modifierPrenom(version: Version, valeur: string = FIXTURE_PRENOM): void {
    cy.log(`Modification prénom → "${valeur}"`);
    InformationsPrimitives.saisirChampTexte(version, SECTION_INFORMATIONS.INPUT_PRENOM, valeur);
    cy.log('Prénom modifié');
  }

  static verifierPrenom(version: Version, valeur: string = FIXTURE_PRENOM): void {
    cy.log(`Vérification prénom = "${valeur}"`);
    InformationsPrimitives.verifierChampTexte(version, SECTION_INFORMATIONS.INPUT_PRENOM, valeur);
  }

  // Nom

  static modifierNom(version: Version, valeur: string = FIXTURE_NOM): void {
    cy.log(`Modification nom → "${valeur}"`);
    InformationsPrimitives.saisirChampTexte(version, SECTION_INFORMATIONS.INPUT_NOM, valeur);
    cy.log('Nom modifié');
  }

  static verifierNom(version: Version, valeur: string = FIXTURE_NOM): void {
    cy.log(`Vérification nom = "${valeur}"`);
    InformationsPrimitives.verifierChampTexte(version, SECTION_INFORMATIONS.INPUT_NOM, valeur);
  }

  // Date de naissance

  static modifierDateNaissance(version: Version, valeur: string = FIXTURE_DATE_NAISSANCE): void {
    cy.log(`Modification date de naissance → "${valeur}"`);
    InformationsPrimitives.saisirChampDate(version, SECTION_INFORMATIONS.INPUT_DATE_NAISSANCE, valeur);
    cy.log('Date de naissance modifiée');
  }

  static verifierDateNaissance(version: Version, valeur: string = FIXTURE_DATE_NAISSANCE): void {
    cy.log(`Vérification date de naissance = "${valeur}"`);
    InformationsPrimitives.verifierChampDate(version, SECTION_INFORMATIONS.INPUT_DATE_NAISSANCE, valeur);
  }

  // Début d'activité

  static modifierDebutActivite(version: Version, valeur: string = FIXTURE_DEBUT_ACTIVITE): void {
    cy.log(`Modification début activité → "${valeur}"`);
    InformationsPrimitives.saisirChampDate(version, SECTION_INFORMATIONS.INPUT_DEBUT_ACTIVITE, valeur);
    cy.log('Début activité modifié');
  }

  static verifierDebutActivite(version: Version, valeur: string = FIXTURE_DEBUT_ACTIVITE): void {
    cy.log(`Vérification début activité = "${valeur}"`);
    InformationsPrimitives.verifierChampDate(version, SECTION_INFORMATIONS.INPUT_DEBUT_ACTIVITE, valeur);
  }
}
