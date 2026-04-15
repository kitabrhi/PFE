import { When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-informations.config';
import { InformationsPrimitives } from '../../primitives/sections-cv/informations.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

When("j'ajoute une photo de profil", async function (this: PlaywrightWorld) {
  await InformationsPrimitives.uploaderPhoto(this.page, VERSION, 'cypress/fixtures/photo-test.jpg');
});

Then('ma photo de profil est visible sur mon CV', async function (this: PlaywrightWorld) {
  await InformationsPrimitives.verifierPhotoPresente(this.page, VERSION);
});

Then('mon email est affiché sur ma page de profil', async function (this: PlaywrightWorld) {
  await InformationsPrimitives.verifierEmailAffiche(this.page, VERSION);
});

Then("je ne peux pas modifier mon email", async function (this: PlaywrightWorld) {
  await InformationsPrimitives.verifierEmailNonEditable(this.page, VERSION);
});

When('je mets à jour mon prénom', async function (this: PlaywrightWorld) {
  await InformationsPrimitives.modifierPrenom(this.page, VERSION);
});

Then('mon nouveau prénom est affiché sur mon profil', async function (this: PlaywrightWorld) {
  await InformationsPrimitives.verifierPrenom(this.page, VERSION);
});

When('je mets à jour mon nom de famille', async function (this: PlaywrightWorld) {
  await InformationsPrimitives.modifierNom(this.page, VERSION);
});

Then('mon nouveau nom de famille est affiché sur mon profil', async function (this: PlaywrightWorld) {
  await InformationsPrimitives.verifierNom(this.page, VERSION);
});

When('je renseigne ma date de naissance', async function (this: PlaywrightWorld) {
  await InformationsPrimitives.modifierDateNaissance(this.page, VERSION);
});

Then('ma date de naissance est enregistrée sur mon profil', async function (this: PlaywrightWorld) {
  await InformationsPrimitives.verifierDateNaissance(this.page, VERSION);
});

When("je renseigne mon début d'activité professionnelle", async function (this: PlaywrightWorld) {
  await InformationsPrimitives.modifierDebutActivite(this.page, VERSION);
});

Then("mon début d'activité professionnelle est enregistré sur mon profil", async function (this: PlaywrightWorld) {
  await InformationsPrimitives.verifierDebutActivite(this.page, VERSION);
});
