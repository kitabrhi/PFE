import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-hashtags.config';
import { HashtagsPrimitives } from '../../primitives/sections-cv/hashtags.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

let dernierHashtag = '';

Given('un hashtag {string} existe dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  dernierHashtag = nom;
  await HashtagsPrimitives.garantirHashtagExiste(this.page, VERSION, nom);
});

Given('un hashtag {string} existe et est visible sur le CV', async function (this: PlaywrightWorld, nom: string) {
  dernierHashtag = nom;
  await HashtagsPrimitives.garantirHashtagExiste(this.page, VERSION, nom);
  await HashtagsPrimitives.toggleVisibilite(this.page, VERSION, nom, true);
});

Given('un hashtag {string} existe et est masqué sur le CV', async function (this: PlaywrightWorld, nom: string) {
  dernierHashtag = nom;
  await HashtagsPrimitives.garantirHashtagExiste(this.page, VERSION, nom);
  await HashtagsPrimitives.toggleVisibilite(this.page, VERSION, nom, false);
});

When('j\'ajoute le hashtag {string}', async function (this: PlaywrightWorld, nom: string) {
  await HashtagsPrimitives.ajouterHashtag(this.page, VERSION, nom);
});

When('je modifie ce hashtag en {string}', async function (this: PlaywrightWorld, nouveauNom: string) {
  await HashtagsPrimitives.modifierHashtag(this.page, VERSION, dernierHashtag, nouveauNom);
});

When('je supprime ce hashtag', async function (this: PlaywrightWorld) {
  await HashtagsPrimitives.supprimerHashtag(this.page, VERSION, dernierHashtag);
});

When('je masque ce hashtag du CV', async function (this: PlaywrightWorld) {
  await HashtagsPrimitives.toggleVisibilite(this.page, VERSION, dernierHashtag, false);
});

When('je rends visible ce hashtag sur le CV', async function (this: PlaywrightWorld) {
  await HashtagsPrimitives.toggleVisibilite(this.page, VERSION, dernierHashtag, true);
});

When('je change le tri du hashtag {string} à la position {string}', async function (this: PlaywrightWorld, nom: string, position: string) {
  await HashtagsPrimitives.changerTri(this.page, VERSION, nom, position);
});

Then('le hashtag {string} est en position {string} dans la liste', async function (this: PlaywrightWorld, nom: string, position: string) {
  await HashtagsPrimitives.verifierPosition(this.page, VERSION, nom, position);
});

Then('le hashtag {string} apparaît dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  await HashtagsPrimitives.verifierExiste(this.page, VERSION, nom);
});

Then('le hashtag {string} n\'apparaît plus dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  await HashtagsPrimitives.verifierAbsent(this.page, VERSION, nom);
});

Then('le hashtag {string} est masqué sur le CV', async function (this: PlaywrightWorld, nom: string) {
  await HashtagsPrimitives.verifierVisibilite(this.page, VERSION, nom, false);
});

Then('le hashtag {string} est visible sur le CV', async function (this: PlaywrightWorld, nom: string) {
  await HashtagsPrimitives.verifierVisibilite(this.page, VERSION, nom, true);
});
