import { When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-description.config';
import { DescriptionPrimitives } from '../../primitives/sections-cv/description.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

When('je renseigne mon résumé de profil', async function (this: PlaywrightWorld) {
  await DescriptionPrimitives.saisirDescription(this.page, VERSION);
});

When('j\'efface mon résumé de profil', async function (this: PlaywrightWorld) {
  await DescriptionPrimitives.effacerDescription(this.page, VERSION);
});

Then('mon résumé de profil est enregistré', async function (this: PlaywrightWorld) {
  await DescriptionPrimitives.verifierDescriptionPresente(this.page, VERSION);
});

Then('mon résumé de profil est vide', async function (this: PlaywrightWorld) {
  await DescriptionPrimitives.verifierDescriptionVide(this.page, VERSION);
});

Then('le compteur indique {int} caractères sur 1000', async function (this: PlaywrightWorld, nombre: number) {
  await DescriptionPrimitives.verifierCompteurCaracteres(this.page, VERSION, nombre);
});

When('je renseigne une description dépassant {int} caractères', async function (this: PlaywrightWorld, _limite: number) {
  await DescriptionPrimitives.saisirDescriptionLongue(this.page, VERSION);
});

Then('la limite de {int} caractères est respectée', async function (this: PlaywrightWorld, _limite: number) {
  await DescriptionPrimitives.verifierLimiteCaracteresRespectee(this.page, VERSION);
});
