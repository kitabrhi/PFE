import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-competences.config';
import { CompetencesPrimitives } from '../../primitives/sections-cv/competences.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

let derniereCompetence = '';

Given('une compétence {string} existe dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  derniereCompetence = nom;
  await CompetencesPrimitives.garantirCompetenceExiste(this.page, VERSION, nom);
});

Given('une compétence {string} existe et est visible sur le CV', async function (this: PlaywrightWorld, nom: string) {
  derniereCompetence = nom;
  await CompetencesPrimitives.garantirCompetenceExiste(this.page, VERSION, nom);
  await CompetencesPrimitives.toggleVisibilite(this.page, VERSION, nom, true);
});

Given('une compétence {string} existe et est masquée sur le CV', async function (this: PlaywrightWorld, nom: string) {
  derniereCompetence = nom;
  await CompetencesPrimitives.garantirCompetenceExiste(this.page, VERSION, nom);
  await CompetencesPrimitives.toggleVisibilite(this.page, VERSION, nom, false);
});

When('j\'ajoute la compétence {string} avec {string} d\'expérience', async function (this: PlaywrightWorld, nom: string, exp: string) {
  await CompetencesPrimitives.ajouterCompetence(this.page, VERSION, nom, exp);
});

When('je modifie cette compétence en {string} avec {string} d\'expérience', async function (this: PlaywrightWorld, nouveauNom: string, nouvelleExp: string) {
  await CompetencesPrimitives.modifierCompetence(this.page, VERSION, derniereCompetence, nouveauNom, nouvelleExp);
});

When('je supprime cette compétence', async function (this: PlaywrightWorld) {
  await CompetencesPrimitives.supprimerCompetence(this.page, VERSION, derniereCompetence);
});

When('je masque cette compétence du CV', async function (this: PlaywrightWorld) {
  await CompetencesPrimitives.toggleVisibilite(this.page, VERSION, derniereCompetence, false);
});

When('je rends visible cette compétence sur le CV', async function (this: PlaywrightWorld) {
  await CompetencesPrimitives.toggleVisibilite(this.page, VERSION, derniereCompetence, true);
});

When('je change le tri de la compétence {string} à la position {string}', async function (this: PlaywrightWorld, nom: string, position: string) {
  await CompetencesPrimitives.changerTri(this.page, VERSION, nom, position);
});

Then('la compétence {string} est en position {string} dans la liste', async function (this: PlaywrightWorld, nom: string, position: string) {
  await CompetencesPrimitives.verifierPosition(this.page, VERSION, nom, position);
});

Then('la compétence {string} apparaît dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  await CompetencesPrimitives.verifierExiste(this.page, VERSION, nom);
});

Then('la compétence {string} n\'apparaît plus dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  await CompetencesPrimitives.verifierAbsente(this.page, VERSION, nom);
});

Then('la compétence {string} est masquée sur le CV', async function (this: PlaywrightWorld, nom: string) {
  await CompetencesPrimitives.verifierVisibilite(this.page, VERSION, nom, false);
});

Then('la compétence {string} est visible sur le CV', async function (this: PlaywrightWorld, nom: string) {
  await CompetencesPrimitives.verifierVisibilite(this.page, VERSION, nom, true);
});
