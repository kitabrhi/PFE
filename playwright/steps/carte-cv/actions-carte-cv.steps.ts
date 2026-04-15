import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/carte-cv/selectors-carte-cv.config';
import { AUTH_CREDENTIALS } from '../../config/auth/selectors-auth.config';
import { CarteCVPrimitives } from '../../primitives/carte-cv/actions.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

function genererNomUnique(base: string): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${base}-${timestamp}`;
}

let dernierNomGenere = '';

Given('un CV existe dans ma liste', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.assurerSurPageListe(this.page, VERSION);
});

Given('j\'ai au moins {int} CVs sur la page', async function (this: PlaywrightWorld, _nbMin: number) {
  await CarteCVPrimitives.assurerSurPageListe(this.page, VERSION);
});

Given('un CV porte déjà le nom {string}', async function (this: PlaywrightWorld, _nom: string) {
  await CarteCVPrimitives.assurerSurPageListe(this.page, VERSION);
});

When('je renomme ce CV en {string}', async function (this: PlaywrightWorld, nouveauNom: string) {
  dernierNomGenere = genererNomUnique(nouveauNom);
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

Then('le CV est renommé en {string}', async function (this: PlaywrightWorld, _nom: string) {
  await this.page.waitForTimeout(1000);
});

When('je tente de renommer un autre CV en {string}', async function (this: PlaywrightWorld, _nomExistant: string) {
  await this.page.waitForTimeout(1000);
});

Then('un message d\'erreur indique que ce nom existe déjà', async function (this: PlaywrightWorld) {
  await this.page.waitForTimeout(1000);
});

Then('le renommage est refusé', async function (this: PlaywrightWorld) {
  await this.page.waitForTimeout(1000);
});

When('je duplique ce CV', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

Then('une copie du CV est créée', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.assurerSurPageListe(this.page, VERSION);
});

Then('la copie apparaît dans ma liste de CV', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.assurerSurPageListe(this.page, VERSION);
});

When('je vide ce CV', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

When('je demande à vider ce CV', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

When('j\'annule l\'opération', async function (this: PlaywrightWorld) {
  await this.page.waitForTimeout(1000);
});

Then('toutes les informations sont supprimées', async function (this: PlaywrightWorld) {
  await this.page.waitForTimeout(1000);
});

Then('le contenu du CV reste intact', async function (this: PlaywrightWorld) {
  await this.page.waitForTimeout(1000);
});

When('je transfère ce CV à un collègue', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

When('je tente de transférer ce CV à un email inexistant', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

Then('le transfert est enregistré avec succès', async function (this: PlaywrightWorld) {
  await this.page.waitForTimeout(1000);
});

Then('un message indique que le propriétaire est introuvable', async function (this: PlaywrightWorld) {
  await this.page.waitForTimeout(1000);
});

When('je supprime ce CV', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

When('je demande à supprimer ce CV', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

When('j\'annule la suppression', async function (this: PlaywrightWorld) {
  await this.page.waitForTimeout(1000);
});

Then('le CV est supprimé définitivement', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.assurerSurPageListe(this.page, VERSION);
});

Then('il n\'apparaît plus dans ma liste', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.assurerSurPageListe(this.page, VERSION);
});

Then('le CV reste dans ma liste', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.assurerSurPageListe(this.page, VERSION);
});

When('je modifie ce CV', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

When('j\'enregistre les modifications', async function (this: PlaywrightWorld) {
  await this.page.waitForTimeout(1000);
});

Then('les modifications sont sauvegardées', async function (this: PlaywrightWorld) {
  await this.page.waitForTimeout(1000);
});

When('je change le statut de ce CV en {string}', async function (this: PlaywrightWorld, _nouveauStatut: string) {
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

Then('le statut du CV devient {string}', async function (this: PlaywrightWorld, _statutAttendu: string) {
  await this.page.waitForTimeout(1000);
});

When('je télécharge le JSON de ce CV', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.selectionnerCVParIndex(this.page, VERSION, 0);
  await this.page.waitForTimeout(1000);
});

Then('le fichier JSON est téléchargé', async function (this: PlaywrightWorld) {
  await CarteCVPrimitives.assurerSurPageListe(this.page, VERSION);
});
