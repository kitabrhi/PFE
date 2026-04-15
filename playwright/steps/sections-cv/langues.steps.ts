import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-langues.config';
import { LanguesPrimitives } from '../../primitives/sections-cv/langues.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

let derniereLangue = '';

Given('une langue {string} existe dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  derniereLangue = nom;
  await LanguesPrimitives.garantirLangueExiste(this.page, VERSION, nom);
});

Given('une langue {string} existe et est visible sur le CV', async function (this: PlaywrightWorld, nom: string) {
  derniereLangue = nom;
  await LanguesPrimitives.garantirLangueExiste(this.page, VERSION, nom);
  await LanguesPrimitives.toggleVisibilite(this.page, VERSION, nom, true);
});

Given('une langue {string} existe et est masquée sur le CV', async function (this: PlaywrightWorld, nom: string) {
  derniereLangue = nom;
  await LanguesPrimitives.garantirLangueExiste(this.page, VERSION, nom);
  await LanguesPrimitives.toggleVisibilite(this.page, VERSION, nom, false);
});

When('j\'ajoute la langue {string} avec le niveau {string}', async function (this: PlaywrightWorld, nom: string, niveau: string) {
  await LanguesPrimitives.ajouterLangue(this.page, VERSION, nom, niveau);
});

When('je modifie cette langue en {string} avec le niveau {string}', async function (this: PlaywrightWorld, nouveauNom: string, nouveauNiveau: string) {
  await LanguesPrimitives.modifierLangue(this.page, VERSION, derniereLangue, nouveauNom, nouveauNiveau);
});

When('je supprime cette langue', async function (this: PlaywrightWorld) {
  await LanguesPrimitives.supprimerLangue(this.page, VERSION, derniereLangue);
});

When('je masque cette langue du CV', async function (this: PlaywrightWorld) {
  await LanguesPrimitives.toggleVisibilite(this.page, VERSION, derniereLangue, false);
});

When('je rends visible cette langue sur le CV', async function (this: PlaywrightWorld) {
  await LanguesPrimitives.toggleVisibilite(this.page, VERSION, derniereLangue, true);
});

Then('la langue {string} apparaît dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  await LanguesPrimitives.verifierLangueExiste(this.page, VERSION, nom);
});

Then('la langue {string} n\'apparaît plus dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  await LanguesPrimitives.verifierLangueAbsente(this.page, VERSION, nom);
});

Then('la langue {string} est masquée sur le CV', async function (this: PlaywrightWorld, nom: string) {
  await LanguesPrimitives.verifierVisibilite(this.page, VERSION, nom, false);
});

Then('la langue {string} est visible sur le CV', async function (this: PlaywrightWorld, nom: string) {
  await LanguesPrimitives.verifierVisibilite(this.page, VERSION, nom, true);
});
