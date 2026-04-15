import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/configuration/selectors-configuration.config';
import { ConfigurationPrimitives } from '../../primitives/configuration/configuration.primitives';
import { CarteCVPrimitives } from '../../primitives/carte-cv/actions.primitives';
import { NavigationPrimitives } from '../../primitives/navigaation/navigation.primitives';
import { SectionsCVPrimitives } from '../../primitives/sections-cv/titre-cv.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

Given('je suis sur un CV existant', async function (this: PlaywrightWorld) {
  await NavigationPrimitives.naviguerVersPageMesCVs(this.page, VERSION);
  await NavigationPrimitives.selectionnerPremierCV(this.page, VERSION);
});

Given('le mode sombre est désactivé', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.desactiverModeSombre(this.page, VERSION);
});

Given('le mode sombre est activé', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.activerModeSombre(this.page, VERSION);
});

When('je clique sur "Download profil" dans la configuration', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.telechargerProfil(this.page, VERSION);
});

Then('un fichier JSON est téléchargé', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.verifierDownloadDeclenche(this.page);
});

When('j\'uploade le fichier {string} dans la configuration', async function (this: PlaywrightWorld, cheminFichier: string) {
  await ConfigurationPrimitives.uploaderProfil(this.page, VERSION, cheminFichier);
});

Then('le profil est importé avec succès', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.verifierUploadReussi(this.page);
});

When('j\'active le mode sombre', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.activerModeSombre(this.page, VERSION);
});

When('je désactive le mode sombre', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.desactiverModeSombre(this.page, VERSION);
});

Then('l\'application est en mode sombre', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.verifierModeSombreActif(this.page);
});

Then('l\'application est en mode clair', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.verifierModeSombreInactif(this.page);
});

When('je clique sur "Générer CV"', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.naviguerVersGenererCV(this.page, VERSION);
});

When('je clique sur "Télécharger le CV"', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.telechargerCV(this.page, VERSION);
});

Then('la page de génération du CV s\'affiche', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.verifierPageGenererCV(this.page);
});

Then('l\'aperçu du CV est visible', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.verifierApercuCV(this.page);
});

Then('le CV est téléchargé', async function (this: PlaywrightWorld) {
  const loc = this.page.getByText('Télécharger le CV');
  await loc.waitFor({ timeout: 10_000 });
});

When('je navigue vers la section {string}', async function (this: PlaywrightWorld, section: string) {
  await SectionsCVPrimitives.naviguerVersSection(this.page, VERSION, section);
});

When('je reviens sur la configuration', async function (this: PlaywrightWorld) {
  await ConfigurationPrimitives.ouvrirMenuConfiguration(this.page, VERSION);
});
