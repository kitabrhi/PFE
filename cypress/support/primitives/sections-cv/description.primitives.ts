import {
  Version, getSelector,
  SECTION_DESCRIPTION
} from '../../config/section/selectors-description.config';

const FIXTURE_DESCRIPTION = 'Expert en gestion de projets digitaux avec plus de 5 ans d\'expérience.';

// Texte volontairement trop long pour déclencher la limite des 1000 caractères.
const FIXTURE_DESCRIPTION_LONGUE =
  'Professionnel passionné et polyvalent avec une solide expérience dans le domaine du développement logiciel et de la gestion de projets digitaux. ' +
  'Fort de plus de cinq années passées à concevoir, développer et déployer des applications web et mobiles complexes, je maîtrise un large éventail de technologies modernes. ' +
  'Mon expertise couvre les frameworks front-end tels que Angular, React et Vue.js, ainsi que les environnements back-end comme Node.js, Spring Boot et .NET Core. ' +
  'Je possède également une connaissance approfondie des architectures microservices, des pipelines CI/CD avec GitHub Actions et Azure DevOps, et des bonnes pratiques DevOps. ' +
  'Au cours de ma carrière, j\'ai dirigé des équipes pluridisciplinaires allant de trois à douze personnes, en appliquant les méthodologies agiles Scrum et Kanban. ' +
  'J\'ai contribué à la mise en place de stratégies de tests automatisés utilisant Cypress, Selenium et des approches BDD avec Cucumber pour garantir la qualité logicielle. ' +
  'Ma capacité à communiquer efficacement avec les parties prenantes techniques et métiers me permet de traduire les besoins fonctionnels en solutions techniques robustes et évolutives. ' +
  'Je suis constamment à la recherche de nouveaux défis qui me permettront de continuer à développer mes compétences et à apporter une valeur ajoutée significative aux projets.';

const CK_EDITABLE = '[data-cy="summaryProfil-input"] .ck-editor__editable[contenteditable="true"]';

export class DescriptionPrimitives {

  private static attendreAutoSave(): void {
    cy.log('⏳ Attente sauvegarde automatique...');
    cy.wait(3000);
  }

  // Saisie.

  static saisirDescription(version: Version, texte: string = FIXTURE_DESCRIPTION): void {
    cy.log(`✏️ Saisie description : "${texte.substring(0, 30)}..."`);

    if (version === 'v1') {
      cy.get(CK_EDITABLE, { timeout: 15000 }).should('be.visible');

      cy.get(CK_EDITABLE).then(($el) => {
        const editableEl = $el[0] as any;

        // On tente d'abord l'instance exposée directement par CKEditor.
        let editor = editableEl.ckeditorInstance;

        // Si besoin, on passe par le composant `ckeditor`.
        if (!editor) {
          const tag = document.querySelector('ckeditor#editor') as any;
          editor = tag?.editorInstance;
        }

        // Dernier essai via le wrapper `.ck-editor`.
        if (!editor) {
          const wrapper = editableEl.closest('.ck-editor');
          editor = (wrapper as any)?.ckeditorInstance;
        }

        if (editor?.model) {
          cy.log('✅ Instance CKEditor trouvée — écriture via API');
          editor.model.change((writer: any) => {
            const root = editor.model.document.getRoot();
            if (root.childCount > 0) {
              writer.remove(writer.createRangeIn(root));
            }
            const p = writer.createElement('paragraph');
            writer.insertText(texte, p);
            writer.insert(p, root, 0);
          });
        } else {
          // En repli, on tape dans l'éditeur comme un utilisateur.
          cy.log('⚠️ Fallback .type()');
          cy.get(CK_EDITABLE)
            .click({ force: true })
            .type('{selectall}', { force: true })
            .type(texte, { force: true, delay: 10 });
        }
      });

      DescriptionPrimitives.attendreAutoSave();
    } else {
      cy.get(getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version), { timeout: 10000 })
        .clear()
        .type(texte);
      DescriptionPrimitives.attendreAutoSave();
    }

    cy.log('✅ Description saisie');
  }

  // Saisie longue.

  static saisirDescriptionLongue(version: Version): void {
    cy.log(`✏️ Saisie description longue (${FIXTURE_DESCRIPTION_LONGUE.length} caractères)`);
    DescriptionPrimitives.saisirDescription(version, FIXTURE_DESCRIPTION_LONGUE);
  }

  // Effacement.

  static effacerDescription(version: Version): void {
    cy.log('🗑️ Effacement de la description');

    if (version === 'v1') {
      cy.get('body').then(($body) => {
        if ($body.find(CK_EDITABLE).length === 0) {
          cy.log('⚠️ Éditeur absent — nettoyage ignoré');
          return;
        }

        cy.get(CK_EDITABLE).then(($el) => {
          const editor = ($el[0] as any).ckeditorInstance;

          if (editor?.model) {
            editor.model.change((writer: any) => {
              const root = editor.model.document.getRoot();
              if (root.childCount > 0) {
                writer.remove(writer.createRangeIn(root));
              }
            });
          } else {
            cy.get(CK_EDITABLE)
              .click({ force: true })
              .type('{selectall}{backspace}', { force: true });
          }
        });

        DescriptionPrimitives.attendreAutoSave();
      });
    } else {
      cy.get(getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version), { timeout: 10000 })
        .clear();
      DescriptionPrimitives.attendreAutoSave();
    }

    cy.log('✅ Description effacée');
  }

  // Vérification du contenu.

  static verifierDescriptionPresente(version: Version, texte: string = FIXTURE_DESCRIPTION): void {
    cy.log('🔍 Vérification description présente');

    if (version === 'v1') {
      cy.get(CK_EDITABLE, { timeout: 15000 })
        .should('contain.text', texte.substring(0, 30));
    } else {
      cy.get(getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version), { timeout: 10000 })
        .should('have.value', texte);
    }
  }

  // Vérification du vide.

  static verifierDescriptionVide(version: Version): void {
    cy.log('🔍 Vérification description vide');

    if (version === 'v1') {
      cy.get(CK_EDITABLE, { timeout: 15000 })
        .invoke('text')
        .should('satisfy', (txt: string) => txt.trim() === '');
    } else {
      cy.get(getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version), { timeout: 10000 })
        .should('have.value', '');
    }
  }

  // Vérification du compteur.

  static verifierCompteurCaracteres(version: Version, nombreAttendu: number): void {
    cy.log(`🔍 Vérification compteur = ${nombreAttendu}/1000`);

    cy.get(getSelector(SECTION_DESCRIPTION.COMPTEUR_CARACTERES, version), {
      timeout: 10000
    }).should('contain.text', `${nombreAttendu}/1000`);
  }

  // Vérification de la limite.

  static verifierLimiteCaracteresRespectee(version: Version): void {
    cy.log('🔍 Vérification limite 1000 caractères');
  
    if (version === 'v1') {
      // On vérifie d'abord que le message d'erreur est visible.
      cy.get('[data-cy="summaryProfil-input"]', { timeout: 10000 })
        .should('contain.text', 'Nombre de caractères autorisés');
  
      // Puis on confirme que le contenu dépasse réellement la limite.
      cy.get(CK_EDITABLE, { timeout: 10000 })
        .invoke('text')
        .then((val) => {
          cy.log(`📏 Longueur saisie : ${val.length} caractères`);
          expect(val.length).to.be.greaterThan(1000);
        });
    } else {
      cy.get(getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version), { timeout: 10000 })
        .invoke('val')
        .then((val) => expect((val as string).length).to.be.at.most(1000));
    }
  }
}
