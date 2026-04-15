import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-domaines-activite.config';
import { DomainesActivitePrimitives } from '../../primitives/sections-cv/domaines-activite.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

let dernierDomaine = '';

Given('un domaine d\'activité {string} existe dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  dernierDomaine = nom;
  await DomainesActivitePrimitives.garantirDomaineExiste(this.page, VERSION, nom);
});

Given('un domaine d\'activité {string} existe et est visible sur le CV', async function (this: PlaywrightWorld, nom: string) {
  dernierDomaine = nom;
  await DomainesActivitePrimitives.garantirDomaineExiste(this.page, VERSION, nom);
  await DomainesActivitePrimitives.toggleVisibilite(this.page, VERSION, nom, true);
});

Given('un domaine d\'activité {string} existe et est masqué sur le CV', async function (this: PlaywrightWorld, nom: string) {
  dernierDomaine = nom;
  await DomainesActivitePrimitives.garantirDomaineExiste(this.page, VERSION, nom);
  await DomainesActivitePrimitives.toggleVisibilite(this.page, VERSION, nom, false);
});

When('j\'ajoute le domaine d\'activité {string} avec {string} d\'expérience', async function (this: PlaywrightWorld, nom: string, exp: string) {
  await DomainesActivitePrimitives.ajouterDomaine(this.page, VERSION, nom, exp);
});

When('je modifie ce domaine d\'activité en {string} avec {string} d\'expérience', async function (this: PlaywrightWorld, nouveauNom: string, nouvelleExp: string) {
  await DomainesActivitePrimitives.modifierDomaine(this.page, VERSION, dernierDomaine, nouveauNom, nouvelleExp);
});

When('je supprime ce domaine d\'activité', async function (this: PlaywrightWorld) {
  await DomainesActivitePrimitives.supprimerDomaine(this.page, VERSION, dernierDomaine);
});

When('je masque ce domaine d\'activité du CV', async function (this: PlaywrightWorld) {
  await DomainesActivitePrimitives.toggleVisibilite(this.page, VERSION, dernierDomaine, false);
});

When('je rends visible ce domaine d\'activité sur le CV', async function (this: PlaywrightWorld) {
  await DomainesActivitePrimitives.toggleVisibilite(this.page, VERSION, dernierDomaine, true);
});

Then('le domaine d\'activité {string} apparaît dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  await DomainesActivitePrimitives.verifierExiste(this.page, VERSION, nom);
});

Then('le domaine d\'activité {string} n\'apparaît plus dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  await DomainesActivitePrimitives.verifierAbsent(this.page, VERSION, nom);
});

Then('le domaine d\'activité {string} est masqué sur le CV', async function (this: PlaywrightWorld, nom: string) {
  await DomainesActivitePrimitives.verifierVisibilite(this.page, VERSION, nom, false);
});

Then('le domaine d\'activité {string} est visible sur le CV', async function (this: PlaywrightWorld, nom: string) {
  await DomainesActivitePrimitives.verifierVisibilite(this.page, VERSION, nom, true);
});

When('je change le tri du domaine d\'activité {string} à la position {string}', async function (this: PlaywrightWorld, nom: string, position: string) {
  await DomainesActivitePrimitives.changerTri(this.page, VERSION, nom, position);
});

Then('le domaine d\'activité {string} est en position {string} dans la liste', async function (this: PlaywrightWorld, nom: string, position: string) {
  await DomainesActivitePrimitives.verifierPosition(this.page, VERSION, nom, position);
});
