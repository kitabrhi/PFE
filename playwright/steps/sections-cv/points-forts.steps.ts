import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-points-forts.config';
import { PointsFortsPrimitives } from '../../primitives/sections-cv/points-forts.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

let dernierPointFort = '';

Given('un point fort {string} existe dans ma liste', async function (this: PlaywrightWorld, texte: string) {
  dernierPointFort = texte;
  await PointsFortsPrimitives.garantirPointFortExiste(this.page, VERSION, texte);
});

Given('un point fort {string} existe et est visible sur le CV', async function (this: PlaywrightWorld, texte: string) {
  dernierPointFort = texte;
  await PointsFortsPrimitives.garantirPointFortExiste(this.page, VERSION, texte);
  await PointsFortsPrimitives.toggleVisibilite(this.page, VERSION, texte, true);
});

Given('un point fort {string} existe et est masqué sur le CV', async function (this: PlaywrightWorld, texte: string) {
  dernierPointFort = texte;
  await PointsFortsPrimitives.garantirPointFortExiste(this.page, VERSION, texte);
  await PointsFortsPrimitives.toggleVisibilite(this.page, VERSION, texte, false);
});

When('j\'ajoute le point fort {string}', async function (this: PlaywrightWorld, texte: string) {
  await PointsFortsPrimitives.ajouterPointFort(this.page, VERSION, texte);
});

When('je modifie ce point fort en {string}', async function (this: PlaywrightWorld, nouveau: string) {
  await PointsFortsPrimitives.modifierPointFort(this.page, VERSION, dernierPointFort, nouveau);
});

When('je supprime ce point fort', async function (this: PlaywrightWorld) {
  await PointsFortsPrimitives.supprimerPointFort(this.page, VERSION, dernierPointFort);
});

When('je masque ce point fort du CV', async function (this: PlaywrightWorld) {
  await PointsFortsPrimitives.toggleVisibilite(this.page, VERSION, dernierPointFort, false);
});

When('je rends visible ce point fort sur le CV', async function (this: PlaywrightWorld) {
  await PointsFortsPrimitives.toggleVisibilite(this.page, VERSION, dernierPointFort, true);
});

Then('le point fort {string} apparaît dans ma liste', async function (this: PlaywrightWorld, texte: string) {
  await PointsFortsPrimitives.verifierExiste(this.page, VERSION, texte);
});

Then('le point fort {string} n\'apparaît plus dans ma liste', async function (this: PlaywrightWorld, texte: string) {
  await PointsFortsPrimitives.verifierAbsent(this.page, VERSION, texte);
});

Then('le point fort {string} est masqué sur le CV', async function (this: PlaywrightWorld, texte: string) {
  await PointsFortsPrimitives.verifierVisibilite(this.page, VERSION, texte, false);
});

Then('le point fort {string} est visible sur le CV', async function (this: PlaywrightWorld, texte: string) {
  await PointsFortsPrimitives.verifierVisibilite(this.page, VERSION, texte, true);
});
