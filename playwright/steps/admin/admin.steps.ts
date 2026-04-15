import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/admin/selectors-admin.config';
import { AdminPrimitives } from '../../primitives/admin/admin.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

When('j\'envoie une invitation à {string}', async function (this: PlaywrightWorld, email: string) {
  await AdminPrimitives.envoyerInvitation(this.page, VERSION, email);
});

When('je clique sur modifier mon CV', async function (this: PlaywrightWorld) {
  await AdminPrimitives.cliquerModifierMonCV(this.page, VERSION);
});

Then('un CV de {string} est présent dans les résultats', async function (this: PlaywrightWorld, nom: string) {
  await AdminPrimitives.verifierCVExistePourNom(this.page, nom);
});

When('je saisis l\'email invalide {string}', async function (this: PlaywrightWorld, email: string) {
  const input = this.page.locator('input.input-invit');
  await input.scrollIntoViewIfNeeded();
  await input.clear();
  await input.fill(email);
  await input.blur();
});

When('je clique sur "Envoyer" sans saisir d\'email', async function (this: PlaywrightWorld) {
  const btn = this.page.locator('red-user-invitation button[type="submit"]');
  await btn.scrollIntoViewIfNeeded();
  await btn.click({ force: true });
});

Then('l\'invitation est envoyée avec succès', async function (this: PlaywrightWorld) {
  await AdminPrimitives.verifierInvitationEnvoyee(this.page);
});

Then('le formulaire d\'invitation est invalide', async function (this: PlaywrightWorld) {
  await AdminPrimitives.verifierErreurEmailInvalide(this.page);
});

When('je recherche {string}', async function (this: PlaywrightWorld, terme: string) {
  await AdminPrimitives.rechercherCV(this.page, VERSION, terme);
});

Then('des résultats de recherche s\'affichent', async function (this: PlaywrightWorld) {
  await AdminPrimitives.verifierResultatsAffiches(this.page);
});

Then('les résultats contiennent {string}', async function (this: PlaywrightWorld, nom: string) {
  await AdminPrimitives.verifierResultatContient(this.page, nom);
});

Then('aucun résultat n\'est affiché', async function (this: PlaywrightWorld) {
  await AdminPrimitives.verifierAucunResultat(this.page);
});

Then('un CV de {string} a le statut {string}', async function (this: PlaywrightWorld, nom: string, statut: string) {
  await AdminPrimitives.verifierStatutCV(this.page, nom, statut);
});

When('je clique sur modifier le CV de {string}', async function (this: PlaywrightWorld, nom: string) {
  await AdminPrimitives.cliquerModifierCV(this.page, VERSION, nom);
});

When('je clique sur voir le CV de {string}', async function (this: PlaywrightWorld, nom: string) {
  await AdminPrimitives.cliquerVoirCV(this.page, VERSION, nom);
});

When('je clique sur supprimer le CV de {string}', async function (this: PlaywrightWorld, nom: string) {
  await AdminPrimitives.cliquerSupprimerCV(this.page, VERSION, nom);
});

Then('je suis redirigé vers l\'édition du CV', async function (this: PlaywrightWorld) {
  await this.page.waitForURL(/\/user\//, { timeout: 10_000 });
});
