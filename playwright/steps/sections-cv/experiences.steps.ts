import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-experiences.config';
import { ExperiencesPrimitives } from '../../primitives/sections-cv/experiences.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

let derniereExperience = '';

Given('une expérience {string} existe dans ma liste', async function (this: PlaywrightWorld, titre: string) {
  derniereExperience = titre;
  await ExperiencesPrimitives.garantirExperienceExiste(this.page, VERSION, titre);
});

Given('une expérience {string} existe et est visible sur le CV', async function (this: PlaywrightWorld, titre: string) {
  derniereExperience = titre;
  await ExperiencesPrimitives.garantirExperienceExiste(this.page, VERSION, titre);
  await ExperiencesPrimitives.toggleVisibilite(this.page, VERSION, titre, true);
});

Given('une expérience {string} existe et est masquée sur le CV', async function (this: PlaywrightWorld, titre: string) {
  derniereExperience = titre;
  await ExperiencesPrimitives.garantirExperienceExiste(this.page, VERSION, titre);
  await ExperiencesPrimitives.toggleVisibilite(this.page, VERSION, titre, false);
});

When('j\'ajoute l\'expérience {string} chez {string} à {string} du {string} au {string}', async function (this: PlaywrightWorld, titre: string, societe: string, lieu: string, debut: string, fin: string) {
  await ExperiencesPrimitives.ajouterExperience(this.page, VERSION, { titre, societe, lieu, debut, fin });
});

When('je modifie cette expérience en {string} chez {string} à {string}', async function (this: PlaywrightWorld, nouveauTitre: string, nouvelleSociete: string, nouveauLieu: string) {
  await ExperiencesPrimitives.modifierExperience(this.page, VERSION, derniereExperience, { titre: nouveauTitre, societe: nouvelleSociete, lieu: nouveauLieu });
});

When('je supprime cette expérience', async function (this: PlaywrightWorld) {
  await ExperiencesPrimitives.supprimerExperience(this.page, VERSION, derniereExperience);
});

When('je masque cette expérience du CV', async function (this: PlaywrightWorld) {
  await ExperiencesPrimitives.toggleVisibilite(this.page, VERSION, derniereExperience, false);
});

When('je rends visible cette expérience sur le CV', async function (this: PlaywrightWorld) {
  await ExperiencesPrimitives.toggleVisibilite(this.page, VERSION, derniereExperience, true);
});

When('je change le tri de l\'expérience {string} à la position {string}', async function (this: PlaywrightWorld, titre: string, position: string) {
  await ExperiencesPrimitives.changerTri(this.page, VERSION, titre, position);
});

Then('l\'expérience {string} est en position {string} dans la liste', async function (this: PlaywrightWorld, titre: string, position: string) {
  await ExperiencesPrimitives.verifierPosition(this.page, VERSION, titre, position);
});

Then('l\'expérience {string} apparaît dans ma liste', async function (this: PlaywrightWorld, titre: string) {
  await ExperiencesPrimitives.verifierExiste(this.page, VERSION, titre);
});

Then('l\'expérience {string} n\'apparaît plus dans ma liste', async function (this: PlaywrightWorld, titre: string) {
  await ExperiencesPrimitives.verifierAbsente(this.page, VERSION, titre);
});

Then('l\'expérience {string} est masquée sur le CV', async function (this: PlaywrightWorld, titre: string) {
  await ExperiencesPrimitives.verifierVisibilite(this.page, VERSION, titre, false);
});

Then('l\'expérience {string} est visible sur le CV', async function (this: PlaywrightWorld, titre: string) {
  await ExperiencesPrimitives.verifierVisibilite(this.page, VERSION, titre, true);
});

Then('l\'expérience {string} a pour société {string} et lieu {string}', async function (this: PlaywrightWorld, titre: string, societe: string, lieu: string) {
  await ExperiencesPrimitives.verifierChamps(this.page, VERSION, titre, societe, lieu);
});
