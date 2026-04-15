import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/auth/selectors-auth.config';
import { AuthPrimitives } from '../../primitives/auth/auth.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

Given('Je suis sur la page de connexion', async function (this: PlaywrightWorld) {
  await AuthPrimitives.naviguerPageConnexion(this.page, VERSION);
});

Given('Je ne suis pas authentifié', async function (this: PlaywrightWorld) {
  // Session nettoyée par le hook Before (nouveau contexte à chaque scénario)
});

Given('Je suis authentifié dans l\'application', async function (this: PlaywrightWorld) {
  await AuthPrimitives.authentifierComplet(this.page, VERSION);
  await AuthPrimitives.verifierAuthentificationReussie(this.page, VERSION);
});

When('Je me connecte avec un compte valide', async function (this: PlaywrightWorld) {
  await AuthPrimitives.seConnecterCompteValide(this.page, VERSION);
});

When('Je tente de me connecter avec des identifiants incorrects', async function (this: PlaywrightWorld) {
  await AuthPrimitives.seConnecterIdentifiantsIncorrects(this.page, VERSION);
});

When('Je tente de me connecter avec un email au format invalide', async function (this: PlaywrightWorld) {
  await AuthPrimitives.seConnecterEmailInexistant(this.page, VERSION);
});

When('Je me déconnecte', async function (this: PlaywrightWorld) {
  await AuthPrimitives.seDeconnecter(this.page, VERSION);
});

When('Je tente d\'accéder à une page protégée', async function (this: PlaywrightWorld) {
  await AuthPrimitives.tenterAccesPageProtegee(this.page, VERSION);
});

Then('Je suis authentifié avec succès', async function (this: PlaywrightWorld) {
  await AuthPrimitives.verifierAuthentificationReussie(this.page, VERSION);
});

Then('Je vois mon espace personnel', async function (this: PlaywrightWorld) {
  await AuthPrimitives.verifierEspacePersonnel(this.page, VERSION);
});

Then('L\'authentification échoue', async function (this: PlaywrightWorld) {
  await AuthPrimitives.verifierSurPageConnexion(this.page, VERSION);
});

Then('Je vois un message d\'erreur indiquant que les identifiants sont invalides', async function (this: PlaywrightWorld) {
  await AuthPrimitives.verifierErreurIdentifiants(this.page, VERSION);
});

Then('Je vois un message indiquant que le compte n\'existe pas', async function (this: PlaywrightWorld) {
  await AuthPrimitives.verifierErreurCompteInexistant(this.page, VERSION);
});

Then('Je reste sur la page de connexion', async function (this: PlaywrightWorld) {
  await AuthPrimitives.verifierSurPageConnexion(this.page, VERSION);
});

Then('Je suis redirigé vers la page de connexion', async function (this: PlaywrightWorld) {
  await AuthPrimitives.verifierSurPageConnexion(this.page, VERSION);
});

Then('Ma session est terminée', async function (this: PlaywrightWorld) {
  await AuthPrimitives.verifierSurPageConnexion(this.page, VERSION);
});

Then('L\'accès est refusé', async function (this: PlaywrightWorld) {
  await AuthPrimitives.verifierSurPageConnexion(this.page, VERSION);
});
