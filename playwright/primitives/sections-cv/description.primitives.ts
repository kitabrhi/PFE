import { Page, expect } from '@playwright/test';
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

  private static async attendreAutoSave(page: Page): Promise<void> {
    await page.waitForTimeout(3000);
  }

  // Saisie

  static async saisirDescription(page: Page, version: Version, texte: string = FIXTURE_DESCRIPTION): Promise<void> {
    const inputSelector = getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version);

    if (version === 'v1') {
      const editor = page.locator(inputSelector);
      await editor.waitFor({ state: 'visible', timeout: 15_000 });

      // Tenter l'écriture via l'API CKEditor en JS dans le navigateur
      const wrote = await page.evaluate((sel: string) => {
        const el = document.querySelector(sel) as any;
        if (!el) return false;
        let editor = el.ckeditorInstance;
        if (!editor) {
          const tag = document.querySelector('ckeditor#editor') as any;
          editor = tag?.editorInstance;
        }
        if (!editor) {
          const wrapper = el.closest('.ck-editor');
          editor = (wrapper as any)?.ckeditorInstance;
        }
        return !!editor?.model;
      }, inputSelector);

      if (wrote) {
        await page.evaluate(({ sel, txt }: { sel: string; txt: string }) => {
          const el = document.querySelector(sel) as any;
          let editor = el?.ckeditorInstance;
          if (!editor) {
            const tag = document.querySelector('ckeditor#editor') as any;
            editor = tag?.editorInstance;
          }
          if (!editor) {
            const wrapper = el?.closest('.ck-editor');
            editor = (wrapper as any)?.ckeditorInstance;
          }
          if (editor?.model) {
            editor.model.change((writer: any) => {
              const root = editor.model.document.getRoot();
              if (root.childCount > 0) {
                writer.remove(writer.createRangeIn(root));
              }
              const p = writer.createElement('paragraph');
              writer.insertText(txt, p);
              writer.insert(p, root, 0);
            });
          }
        }, { sel: inputSelector, txt: texte });
      } else {
        // Fallback : cliquer + taper
        await editor.click({ force: true });
        await page.keyboard.press('Control+A');
        await page.keyboard.type(texte, { delay: 10 });
      }

      await DescriptionPrimitives.attendreAutoSave(page);
    } else {
      const input = page.locator(inputSelector);
      await input.waitFor({ state: 'visible', timeout: 10_000 });
      await input.clear();
      await input.fill(texte);
      await DescriptionPrimitives.attendreAutoSave(page);
    }
  }

  static async saisirDescriptionLongue(page: Page, version: Version): Promise<void> {
    await DescriptionPrimitives.saisirDescription(page, version, FIXTURE_DESCRIPTION_LONGUE);
  }

  // Effacement

  static async effacerDescription(page: Page, version: Version): Promise<void> {
    const inputSelector = getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version);

    if (version === 'v1') {
      const count = await page.locator(inputSelector).count();
      if (count === 0) return;

      // Tenter de vider via CKEditor API
      await page.evaluate((sel: string) => {
        const el = document.querySelector(sel) as any;
        let editor = el?.ckeditorInstance;
        if (!editor) {
          const tag = document.querySelector('ckeditor#editor') as any;
          editor = tag?.editorInstance;
        }
        if (!editor) {
          const wrapper = el?.closest('.ck-editor');
          editor = (wrapper as any)?.ckeditorInstance;
        }
        if (editor?.model) {
          editor.model.change((writer: any) => {
            const root = editor.model.document.getRoot();
            if (root.childCount > 0) {
              writer.remove(writer.createRangeIn(root));
            }
          });
        }
      }, inputSelector);

      await DescriptionPrimitives.attendreAutoSave(page);
    } else {
      const input = page.locator(inputSelector);
      await input.waitFor({ state: 'visible', timeout: 10_000 });
      await input.clear();
      await DescriptionPrimitives.attendreAutoSave(page);
    }
  }

  // Vérifications

  static async verifierDescriptionPresente(page: Page, version: Version, texte: string = FIXTURE_DESCRIPTION): Promise<void> {
    const inputSelector = getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version);

    if (version === 'v1') {
      await expect(page.locator(inputSelector)).toContainText(texte.substring(0, 30), { timeout: 15_000 });
    } else {
      await expect(page.locator(inputSelector)).toHaveValue(texte, { timeout: 10_000 });
    }
  }

  static async verifierDescriptionVide(page: Page, version: Version): Promise<void> {
    const inputSelector = getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version);

    if (version === 'v1') {
      const text = await page.locator(inputSelector).innerText({ timeout: 15_000 });
      expect(text.trim()).toBe('');
    } else {
      await expect(page.locator(inputSelector)).toHaveValue('', { timeout: 10_000 });
    }
  }

  static async verifierCompteurCaracteres(page: Page, version: Version, nombreAttendu: number): Promise<void> {
    await expect(
      page.locator(getSelector(SECTION_DESCRIPTION.COMPTEUR_CARACTERES, version))
    ).toContainText(`${nombreAttendu}/1000`, { timeout: 10_000 });
  }

  static async verifierLimiteCaracteresRespectee(page: Page, version: Version): Promise<void> {
    const inputSelector = getSelector(SECTION_DESCRIPTION.INPUT_DESCRIPTION, version);
    const conteneurSelector = getSelector(SECTION_DESCRIPTION.CONTENEUR, version);

    if (version === 'v1') {
      await expect(page.locator(conteneurSelector)).toContainText('Nombre de caractères autorisés', { timeout: 10_000 });
      const text = await page.locator(inputSelector).innerText();
      expect(text.length).toBeGreaterThan(1000);
    } else {
      const value = await page.locator(inputSelector).inputValue();
      expect(value.length).toBeLessThanOrEqual(1000);
    }
  }
}
