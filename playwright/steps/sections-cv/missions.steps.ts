import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../world';
import { Version } from '../../config/section/selectors-missions.config';
import { MissionsPrimitives } from '../../primitives/sections-cv/missions.primitives';

const VERSION: Version = (process.env.APP_VERSION as Version) || 'v1';

let derniereMission = '';

Given('une mission {string} existe dans ma liste', async function (this: PlaywrightWorld, role: string) {
  derniereMission = role;
  await MissionsPrimitives.garantirMissionExiste(this.page, VERSION, role);
});

Given('une mission {string} existe dans ma liste et n\'est pas confidentielle', async function (this: PlaywrightWorld, role: string) {
  derniereMission = role;
  await MissionsPrimitives.garantirMissionExiste(this.page, VERSION, role);
  await MissionsPrimitives.toggleConfidentiel(this.page, VERSION, role, false);
});

Given('une mission {string} existe dans ma liste et est confidentielle', async function (this: PlaywrightWorld, role: string) {
  derniereMission = role;
  await MissionsPrimitives.garantirMissionExiste(this.page, VERSION, role);
  await MissionsPrimitives.toggleConfidentiel(this.page, VERSION, role, true);
});

Given('une mission {string} existe et est incluse dans le CV', async function (this: PlaywrightWorld, role: string) {
  derniereMission = role;
  await MissionsPrimitives.garantirMissionExiste(this.page, VERSION, role);
  await MissionsPrimitives.toggleInclusionCV(this.page, VERSION, role, true);
});

Given('une mission {string} existe et est exclue du CV', async function (this: PlaywrightWorld, role: string) {
  derniereMission = role;
  await MissionsPrimitives.garantirMissionExiste(this.page, VERSION, role);
  await MissionsPrimitives.toggleInclusionCV(this.page, VERSION, role, false);
});

Given('une expérience {string} existe dans mon parcours', async function (this: PlaywrightWorld, titreExperience: string) {
  await MissionsPrimitives.garantirExperienceExistePourMission(this.page, VERSION, titreExperience);
});

When('j\'ajoute la mission {string} chez {string} à {string} du {string} au {string}', async function (this: PlaywrightWorld, role: string, societe: string, lieu: string, debut: string, fin: string) {
  await MissionsPrimitives.ajouterMission(this.page, VERSION, { role, societe, lieu, debut, fin });
});

When('j\'ajoute la mission {string} chez {string} à {string} du {string} au {string} avec le contexte {string} et les tâches {string}', async function (this: PlaywrightWorld, role: string, societe: string, lieu: string, debut: string, fin: string, contexte: string, taches: string) {
  await MissionsPrimitives.ajouterMission(this.page, VERSION, { role, societe, lieu, debut, fin, contexte, taches });
});

When('j\'ajoute la mission {string} chez {string} à {string} à partir du {string}', async function (this: PlaywrightWorld, role: string, societe: string, lieu: string, debut: string) {
  await MissionsPrimitives.ajouterMission(this.page, VERSION, { role, societe, lieu, debut });
});

When('je modifie cette mission en {string} chez {string} à {string}', async function (this: PlaywrightWorld, nouveauRole: string, nouvelleSociete: string, nouveauLieu: string) {
  await MissionsPrimitives.modifierMission(this.page, VERSION, derniereMission, { role: nouveauRole, societe: nouvelleSociete, lieu: nouveauLieu });
});

When('je supprime cette mission', async function (this: PlaywrightWorld) {
  await MissionsPrimitives.supprimerMission(this.page, VERSION, derniereMission);
});

When('je copie cette mission', async function (this: PlaywrightWorld) {
  await MissionsPrimitives.copierMission(this.page, VERSION, derniereMission);
});

When('je marque cette mission comme confidentielle', async function (this: PlaywrightWorld) {
  await MissionsPrimitives.toggleConfidentiel(this.page, VERSION, derniereMission, true);
});

When('je retire le caractère confidentiel de cette mission', async function (this: PlaywrightWorld) {
  await MissionsPrimitives.toggleConfidentiel(this.page, VERSION, derniereMission, false);
});

When('j\'inclus cette mission dans le CV', async function (this: PlaywrightWorld) {
  await MissionsPrimitives.toggleInclusionCV(this.page, VERSION, derniereMission, true);
});

When('j\'exclus cette mission du CV', async function (this: PlaywrightWorld) {
  await MissionsPrimitives.toggleInclusionCV(this.page, VERSION, derniereMission, false);
});

When('j\'associe la mission {string} à l\'expérience {string}', async function (this: PlaywrightWorld, role: string, titreExperience: string) {
  await MissionsPrimitives.associerExperience(this.page, VERSION, role, titreExperience);
});

When('je renseigne le contexte {string}', async function (this: PlaywrightWorld, contenu: string) {
  await MissionsPrimitives.renseignerContenu(this.page, VERSION, derniereMission, 'contexte', contenu);
});

When('je renseigne les tâches {string}', async function (this: PlaywrightWorld, contenu: string) {
  await MissionsPrimitives.renseignerContenu(this.page, VERSION, derniereMission, 'taches', contenu);
});

When('je renseigne les actions {string}', async function (this: PlaywrightWorld, contenu: string) {
  await MissionsPrimitives.renseignerContenu(this.page, VERSION, derniereMission, 'actions', contenu);
});

When('je renseigne les résultats {string}', async function (this: PlaywrightWorld, contenu: string) {
  await MissionsPrimitives.renseignerContenu(this.page, VERSION, derniereMission, 'resultats', contenu);
});

When('je renseigne les technologies {string}', async function (this: PlaywrightWorld, contenu: string) {
  await MissionsPrimitives.renseignerContenu(this.page, VERSION, derniereMission, 'technologies', contenu);
});

Then('la mission {string} apparaît dans ma liste', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierExiste(this.page, VERSION, role);
});

Then('la mission {string} n\'apparaît plus dans ma liste', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierAbsente(this.page, VERSION, role);
});

Then('la mission {string} a pour société {string} et lieu {string}', async function (this: PlaywrightWorld, role: string, societe: string, lieu: string) {
  await MissionsPrimitives.verifierChamps(this.page, VERSION, role, societe, lieu);
});

Then('une nouvelle mission {string} apparaît dans ma liste', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierExiste(this.page, VERSION, role);
});

Then('la mission copiée contient les mêmes informations que la mission d\'origine', async function (this: PlaywrightWorld) {
  await MissionsPrimitives.verifierCopie(this.page, VERSION, derniereMission);
});

Then('la mission {string} est marquée comme confidentielle', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierConfidentiel(this.page, VERSION, role, true);
});

Then('la mission {string} n\'est plus marquée comme confidentielle', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierConfidentiel(this.page, VERSION, role, false);
});

Then('la mission {string} est incluse dans le CV', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierInclusionCV(this.page, VERSION, role, true);
});

Then('la mission {string} est exclue du CV', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierInclusionCV(this.page, VERSION, role, false);
});

Then('la mission {string} est liée à l\'expérience {string}', async function (this: PlaywrightWorld, role: string, titreExperience: string) {
  await MissionsPrimitives.verifierExperienceAssociee(this.page, VERSION, role, titreExperience);
});

Then('le contexte de la mission {string} est enregistré', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierContenuNonVide(this.page, VERSION, role, 'contexte');
});

Then('les tâches de la mission {string} sont enregistrées', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierContenuNonVide(this.page, VERSION, role, 'taches');
});

Then('les actions de la mission {string} sont enregistrées', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierContenuNonVide(this.page, VERSION, role, 'actions');
});

Then('les résultats de la mission {string} sont enregistrés', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierContenuNonVide(this.page, VERSION, role, 'resultats');
});

Then('les technologies de la mission {string} sont enregistrées', async function (this: PlaywrightWorld, role: string) {
  await MissionsPrimitives.verifierContenuNonVide(this.page, VERSION, role, 'technologies');
});
