import {
  Version, getSelector,
  SECTION_DESCRIPTION
} from '../../config/section/selectors-description.config';

const FIXTURE_DESCRIPTION = 'Expert en gestion de projets digitaux avec plus de 5 ans d\'expérience.';

const FIXTURE_DESCRIPTION_LONGUE =
  'Professionnel passionné et polyvalent avec une solide expérience dans le domaine du développement logiciel et de la gestion de projets digitaux. ' +
  'Fort de plus de cinq années passées à concevoir, développer et déployer des applications web et mobiles complexes, je maîtrise un large éventail de technologies modernes. ' +
  'Mon expertise couvre les frameworks front-end tels que Angular, React et Vue.js, ainsi que les environnements back-end comme Node.js, Spring Boot et .NET Core. ' +
  'Je possède également une connaissance approfondie des architectures microservices, des pipelines CI/CD avec GitHub Actions et Azure DevOps, et des bonnes pratiques DevOps. ' +
  'Au cours de ma carrière, j\'ai dirigé des équipes pluridisciplinaires allant de trois à douze personnes, en appliquant les méthodologies agiles Scrum et Kanban. ' +
  'J\'ai contribué à la mise en place de stratégies de tests automatisés utilisant Cypress, Selenium et des approches BDD avec Cucumber pour garantir la qualité logicielle. ' +
  'Ma capacité à communiquer efficacement avec les parties prenantes techniques et métiers me permet de traduire les besoins fonctionnels en solutions techniques robustes et évolutives. ' +
  'Je suis constamment à la recherche de nouveaux défis qui me permettront de continuer à développer mes compétences et à apporter une valeur ajoutée significative aux projets.';

export class DescriptionPrimitives {

  private static attendreAutoSave(): void {
    cy.log('Attente sauvegarde automatique...');
    cy.wait(3000);
  }

  // Helpers CKEditor (v1 seulement)

  // essaie de récupérer l'instance CKEditor depuis l'élément éditable
  // on tente 3 façons différentes car l'instance peut être exposée à différents endroits
  private static obtenirInstanceCKEditor(editableEl: HTMLElement): any | null {
    // tentative 1 : propriété directe sur l'élément
    let editor = (editableEl as any).ckeditorInstance;

    // tentative 2 : composant Angular <ckeditor>
    if (!editor) {
      const tag = document.querySelector('ckeditor#editor') as any;
      editor = tag?.editorInstance;
    }

    // tentative 3 : wrapper parent .ck-editor
    if (!editor) {
      const wrapper = editableEl.closest('.ck-editor');
      editor = (wrapper as any)?.ckeditorInstance;
    }

    return editor?.model ? editor : null;
  }

  // écrit du texte dans CKEditor via l'API model (remplace tout le contenu existant)
  private static ecrireViaCKEditorAPI(editor: any, texte: string): boolean {
    if (!editor?.model) return false;

    editor.model.change((writer: any) => {
      const root = editor.model.document.getRoot();
      if (root.childCount > 0) {
        writer.remove(writer.createRangeIn(root));
      }
      const p = writer.createElement('paragraph');
      writer.insertText(texte, p);
      writer.insert(p, root, 0);
    });

    return true;
  }

  // vide le contenu CKEditor via l'API model
  private static viderViaCKEditorAPI(editor: any): boolean {
    if (!editor?.model) return false;

    editor.model.change((writer: any) => {
      const root = editor.model.document.getRoot();
      if (root.childCount > 0) {
        writer.remove(writer.createRangeIn(root));
      }
    });

    return true;
  }

  // Saisie

  static saisirDescription(version: Version, texte: string = FIXTURE_DESCRIPTION): void {
    cy.log(`Saisie description : "${texte.substring(0, 30)}..."`);

    const inputSelector = getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version);

    if (version === 'v1') {
      cy.get(inputSelector, { timeout: 15000 }).should('be.visible');

      cy.get(inputSelector).then(($el) => {
        const editor = DescriptionPrimitives.obtenirInstanceCKEditor($el[0]);

        if (editor) {
          cy.log('Instance CKEditor trouvée — écriture via API');
          DescriptionPrimitives.ecrireViaCKEditorAPI(editor, texte);
        } else {
          cy.log('Fallback .type()');
          cy.get(inputSelector)
            .click({ force: true })
            .type('{selectall}', { force: true })
            .type(texte, { force: true, delay: 10 });
        }
      });

      DescriptionPrimitives.attendreAutoSave();
    } else {
      cy.get(inputSelector, { timeout: 10000 })
        .clear()
        .type(texte);
      DescriptionPrimitives.attendreAutoSave();
    }

    cy.log('Description saisie');
  }

  static saisirDescriptionLongue(version: Version): void {
    cy.log(`Saisie description longue (${FIXTURE_DESCRIPTION_LONGUE.length} caractères)`);
    DescriptionPrimitives.saisirDescription(version, FIXTURE_DESCRIPTION_LONGUE);
  }

  // Effacement

  static effacerDescription(version: Version): void {
    cy.log('Effacement de la description');

    const inputSelector = getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version);

    if (version === 'v1') {
      cy.get('body').then(($body) => {
        if ($body.find(inputSelector).length === 0) {
          cy.log('Éditeur absent — nettoyage ignoré');
          return;
        }

        cy.get(inputSelector).then(($el) => {
          const editor = DescriptionPrimitives.obtenirInstanceCKEditor($el[0]);

          if (editor) {
            DescriptionPrimitives.viderViaCKEditorAPI(editor);
          } else {
            cy.get(inputSelector)
              .click({ force: true })
              .type('{selectall}{backspace}', { force: true });
          }
        });

        DescriptionPrimitives.attendreAutoSave();
      });
    } else {
      cy.get(inputSelector, { timeout: 10000 })
        .clear();
      DescriptionPrimitives.attendreAutoSave();
    }

    cy.log('Description effacée');
  }

  // Vérifications

  static verifierDescriptionPresente(version: Version, texte: string = FIXTURE_DESCRIPTION): void {
    cy.log('Vérification description présente');

    const inputSelector = getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version);

    if (version === 'v1') {
      cy.get(inputSelector, { timeout: 15000 })
        .should('contain.text', texte.substring(0, 30));
    } else {
      cy.get(inputSelector, { timeout: 10000 })
        .should('have.value', texte);
    }
  }

  static verifierDescriptionVide(version: Version): void {
    cy.log('Vérification description vide');

    const inputSelector = getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version);

    if (version === 'v1') {
      cy.get(inputSelector, { timeout: 15000 })
        .invoke('text')
        .should('satisfy', (txt: string) => txt.trim() === '');
    } else {
      cy.get(inputSelector, { timeout: 10000 })
        .should('have.value', '');
    }
  }

  static verifierCompteurCaracteres(version: Version, nombreAttendu: number): void {
    cy.log(`Vérification compteur = ${nombreAttendu}/1000`);

    cy.get(getSelector(SECTION_DESCRIPTION.COMPTEUR_CARACTERES, version), {
      timeout: 10000
    }).should('contain.text', `${nombreAttendu}/1000`);
  }

  static verifierLimiteCaracteresRespectee(version: Version): void {
    cy.log('Vérification limite 1000 caractères');

    const inputSelector = getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version);
    const conteneurSelector = getSelector(SECTION_DESCRIPTION.CONTENEUR, version);

    if (version === 'v1') {
      cy.get(conteneurSelector, { timeout: 10000 })
        .should('contain.text', 'Nombre de caractères autorisés');

      cy.get(inputSelector, { timeout: 10000 })
        .invoke('text')
        .then((val) => {
          cy.log(`Longueur saisie : ${val.length} caractères`);
          expect(val.length).to.be.greaterThan(1000);
        });
    } else {
      cy.get(inputSelector, { timeout: 10000 })
        .invoke('val')
        .then((val) => expect((val as string).length).to.be.at.most(1000));
    }
  }
}
