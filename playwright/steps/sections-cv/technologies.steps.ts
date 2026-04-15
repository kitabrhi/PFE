import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version, FIXTURES_TECHNOLOGIES } from '../../config/section/selectors-technologies.config';
import { TechnologiesPrimitives } from '../../primitives/sections-cv/technologies.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

async function assurerTechnologieExiste(page: any, nom: string, categorie: string): Promise<void> {
  await TechnologiesPrimitives.selectionnerCategorie(page, VERSION, categorie);
  await TechnologiesPrimitives.ajouterTechnologie(page, VERSION, categorie, nom);
}

When('j\'ajoute la technologie {string} avec une expérience dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.ajouterTechnologie(this.page, VERSION, categorie, nom, FIXTURES_TECHNOLOGIES.EXPERIENCE_PAR_DEFAUT);
});

When('j\'ajoute la technologie {string} dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.ajouterTechnologie(this.page, VERSION, categorie, nom);
});

When('je supprime la technologie {string} de la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.supprimerTechnologie(this.page, VERSION, categorie, nom);
});

When('je masque la technologie {string} de la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.toggleVisibilite(this.page, VERSION, categorie, nom, false);
});

When('je rends visible la technologie {string} dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.toggleVisibilite(this.page, VERSION, categorie, nom, true);
});

When('je modifie l\'expérience de {string} dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.modifierExperience(this.page, VERSION, categorie, nom, FIXTURES_TECHNOLOGIES.NOUVELLE_EXPERIENCE);
});

Given('la technologie {string} existe dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await assurerTechnologieExiste(this.page, nom, categorie);
});

Given('la technologie {string} existe et est visible dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await assurerTechnologieExiste(this.page, nom, categorie);
  await TechnologiesPrimitives.toggleVisibilite(this.page, VERSION, categorie, nom, true);
});

Given('la technologie {string} existe et est masquée dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await assurerTechnologieExiste(this.page, nom, categorie);
  await TechnologiesPrimitives.toggleVisibilite(this.page, VERSION, categorie, nom, false);
});

Then('la technologie {string} apparaît dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.verifierTechnologieExiste(this.page, VERSION, categorie, nom);
});

Then('la technologie {string} n\'apparaît plus dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.verifierTechnologieAbsente(this.page, VERSION, categorie, nom);
});

Then('la technologie {string} est masquée dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.verifierVisibilite(this.page, VERSION, categorie, nom, false);
});

Then('la technologie {string} est visible dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.verifierVisibilite(this.page, VERSION, categorie, nom, true);
});

Then('l\'expérience de {string} est mise à jour dans la catégorie {string}', async function (this: PlaywrightWorld, nom: string, categorie: string) {
  await TechnologiesPrimitives.verifierExperience(this.page, VERSION, categorie, nom, FIXTURES_TECHNOLOGIES.NOUVELLE_EXPERIENCE);
});
