import { Given, When } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/carte-cv/selectors-carte-cv.config';
import { NavigationPrimitives } from '../../primitives/navigaation/navigation.primitives';
import { SectionsCVPrimitives } from '../../primitives/sections-cv/titre-cv.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

// Connexion

Given('je suis connecté à mon compte', async function (this: PlaywrightWorld) {
  await NavigationPrimitives.seConnecterEtVerifier(this.page, VERSION);
});

// Aller sur une section d'un CV existant

Given('je suis sur la section {string} d\'un CV existant', async function (this: PlaywrightWorld, nomSection: string) {
  await NavigationPrimitives.naviguerVersSectionCVExistant(this.page, VERSION, nomSection);
});

// Aller sur une page de navigation

Given('je suis sur la page {string}', async function (this: PlaywrightWorld, pageName: string) {
  await NavigationPrimitives.naviguerVersPage(this.page, VERSION, pageName);
});

// Passer d'une section à une autre

Given('je suis sur la section {string}', async function (this: PlaywrightWorld, nomSection: string) {
  await SectionsCVPrimitives.naviguerVersSection(this.page, VERSION, nomSection);
});

When('je quitte la section {string}', async function (this: PlaywrightWorld, nomSection: string) {
  const autreSection = nomSection === 'Informations' ? 'Titres' : 'Informations';
  await SectionsCVPrimitives.naviguerVersSection(this.page, VERSION, autreSection);
});

When('je reviens sur la section {string}', async function (this: PlaywrightWorld, nomSection: string) {
  await SectionsCVPrimitives.naviguerVersSection(this.page, VERSION, nomSection);
});
