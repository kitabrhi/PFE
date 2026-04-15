import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-titre-cv.config';
import { SectionsCVPrimitives } from '../../primitives/sections-cv/titre-cv.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

let dernierTitre = '';

Given('un titre {string} existe dans ma liste', async function (this: PlaywrightWorld, titre: string) {
  dernierTitre = titre;
  await SectionsCVPrimitives.garantirTitreExiste(this.page, VERSION, titre);
});

Given('un titre {string} existe et est visible sur le CV', async function (this: PlaywrightWorld, titre: string) {
  dernierTitre = titre;
  await SectionsCVPrimitives.garantirTitreExiste(this.page, VERSION, titre);
  await SectionsCVPrimitives.toggleVisibilite(this.page, VERSION, titre, true);
});

Given('un titre {string} existe et est masqué sur le CV', async function (this: PlaywrightWorld, titre: string) {
  dernierTitre = titre;
  await SectionsCVPrimitives.garantirTitreExiste(this.page, VERSION, titre);
  await SectionsCVPrimitives.toggleVisibilite(this.page, VERSION, titre, false);
});

Given('les titres suivants existent dans l\'ordre :', async function (this: PlaywrightWorld, dataTable: any) {
  const titres = dataTable.hashes();
  for (const row of titres) {
    await SectionsCVPrimitives.garantirTitreExiste(this.page, VERSION, row.titre);
  }
});

When('j\'ajoute le titre {string}', async function (this: PlaywrightWorld, titre: string) {
  await SectionsCVPrimitives.ajouterTitre(this.page, VERSION, titre);
});

When('je modifie ce titre en {string}', async function (this: PlaywrightWorld, nouveauTitre: string) {
  await SectionsCVPrimitives.modifierTitre(this.page, VERSION, dernierTitre, nouveauTitre);
});

When('je supprime ce titre', async function (this: PlaywrightWorld) {
  await SectionsCVPrimitives.supprimerLigne(this.page, VERSION, dernierTitre);
});

When('je masque ce titre du CV', async function (this: PlaywrightWorld) {
  await SectionsCVPrimitives.toggleVisibilite(this.page, VERSION, dernierTitre, false);
});

When('je rends visible ce titre sur le CV', async function (this: PlaywrightWorld) {
  await SectionsCVPrimitives.toggleVisibilite(this.page, VERSION, dernierTitre, true);
});

When('je place le titre {string} en position {int}', async function (this: PlaywrightWorld, titre: string, position: number) {
  await SectionsCVPrimitives.changerOrdre(this.page, VERSION, titre, position);
});

Then('le titre {string} apparaît dans ma liste de titres', async function (this: PlaywrightWorld, titre: string) {
  await SectionsCVPrimitives.verifierTitreExiste(this.page, VERSION, titre);
});

Then('le titre {string} n\'apparaît plus dans ma liste de titres', async function (this: PlaywrightWorld, titre: string) {
  await SectionsCVPrimitives.verifierTitreAbsent(this.page, VERSION, titre);
});

Then('le titre {string} n\'apparaît pas dans ma liste de titres', async function (this: PlaywrightWorld, titre: string) {
  await SectionsCVPrimitives.verifierTitreAbsent(this.page, VERSION, titre);
});

Then('le titre {string} est masqué sur le CV', async function (this: PlaywrightWorld, titre: string) {
  await SectionsCVPrimitives.verifierVisibilite(this.page, VERSION, titre, false);
});

Then('le titre {string} est visible sur le CV', async function (this: PlaywrightWorld, titre: string) {
  await SectionsCVPrimitives.verifierVisibilite(this.page, VERSION, titre, true);
});

Then('le titre {string} est en position {int}', async function (this: PlaywrightWorld, titre: string, position: number) {
  await SectionsCVPrimitives.verifierOrdre(this.page, VERSION, titre, position);
});

Then('une nouvelle ligne vide est disponible', async function (this: PlaywrightWorld) {
  await SectionsCVPrimitives.verifierNouvelleLigneVide(this.page, VERSION);
});
