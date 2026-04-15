import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-diplomes.config';
import { DiplomesPrimitives } from '../../primitives/sections-cv/diplomes.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

let dernierDiplome = '';

Given('un diplôme {string} existe dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  dernierDiplome = nom;
  await DiplomesPrimitives.garantirDiplomeExiste(this.page, VERSION, nom);
});

Given('un diplôme {string} existe et est visible sur le CV', async function (this: PlaywrightWorld, nom: string) {
  dernierDiplome = nom;
  await DiplomesPrimitives.garantirDiplomeExiste(this.page, VERSION, nom);
  await DiplomesPrimitives.toggleVisibilite(this.page, VERSION, nom, true);
});

Given('un diplôme {string} existe et est masqué sur le CV', async function (this: PlaywrightWorld, nom: string) {
  dernierDiplome = nom;
  await DiplomesPrimitives.garantirDiplomeExiste(this.page, VERSION, nom);
  await DiplomesPrimitives.toggleVisibilite(this.page, VERSION, nom, false);
});

When('j\'ajoute un diplôme {string} à {string} en {string}', async function (this: PlaywrightWorld, nom: string, lieu: string, annee: string) {
  await DiplomesPrimitives.ajouterDiplome(this.page, VERSION, nom, lieu, annee);
});

When('je modifie ce diplôme en {string} à {string} en {string}', async function (this: PlaywrightWorld, nouveauNom: string, nouveauLieu: string, nouvelleAnnee: string) {
  await DiplomesPrimitives.modifierDiplome(this.page, VERSION, dernierDiplome, nouveauNom, nouveauLieu, nouvelleAnnee);
});

When('je supprime ce diplôme', async function (this: PlaywrightWorld) {
  await DiplomesPrimitives.supprimerDiplome(this.page, VERSION, dernierDiplome);
});

When('je masque ce diplôme du CV', async function (this: PlaywrightWorld) {
  await DiplomesPrimitives.toggleVisibilite(this.page, VERSION, dernierDiplome, false);
});

When('je rends visible ce diplôme sur le CV', async function (this: PlaywrightWorld) {
  await DiplomesPrimitives.toggleVisibilite(this.page, VERSION, dernierDiplome, true);
});

Then('le diplôme {string} apparaît dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  await DiplomesPrimitives.verifierDiplomeExiste(this.page, VERSION, nom);
});

Then('le diplôme {string} n\'apparaît plus dans ma liste', async function (this: PlaywrightWorld, nom: string) {
  await DiplomesPrimitives.verifierDiplomeAbsent(this.page, VERSION, nom);
});

Then('le diplôme {string} est masqué sur le CV', async function (this: PlaywrightWorld, nom: string) {
  await DiplomesPrimitives.verifierVisibilite(this.page, VERSION, nom, false);
});

Then('le diplôme {string} est visible sur le CV', async function (this: PlaywrightWorld, nom: string) {
  await DiplomesPrimitives.verifierVisibilite(this.page, VERSION, nom, true);
});
