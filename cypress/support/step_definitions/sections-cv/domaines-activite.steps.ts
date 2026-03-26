import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-domaines-activite.config';
import { DomainesActivitePrimitives } from '../../primitives/sections-cv/domaines-activite.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

let dernierDomaine = '';

Given('un domaine d\'activité {string} existe dans ma liste', (nom: string) => {
  dernierDomaine = nom;
  DomainesActivitePrimitives.garantirDomaineExiste(VERSION, nom);
});

Given('un domaine d\'activité {string} existe et est visible sur le CV', (nom: string) => {
  dernierDomaine = nom;
  DomainesActivitePrimitives.garantirDomaineExiste(VERSION, nom);
  DomainesActivitePrimitives.toggleVisibilite(VERSION, nom, true);
});

Given('un domaine d\'activité {string} existe et est masqué sur le CV', (nom: string) => {
  dernierDomaine = nom;
  DomainesActivitePrimitives.garantirDomaineExiste(VERSION, nom);
  DomainesActivitePrimitives.toggleVisibilite(VERSION, nom, false);
});

When('j\'ajoute le domaine d\'activité {string} avec {string} d\'expérience', (nom: string, exp: string) => {
  DomainesActivitePrimitives.ajouterDomaine(VERSION, nom, exp);
});

When('je modifie ce domaine d\'activité en {string} avec {string} d\'expérience', (nouveauNom: string, nouvelleExp: string) => {
  DomainesActivitePrimitives.modifierDomaine(VERSION, dernierDomaine, nouveauNom, nouvelleExp);
});

When('je supprime ce domaine d\'activité', () => {
  DomainesActivitePrimitives.supprimerDomaine(VERSION, dernierDomaine);
});

When('je masque ce domaine d\'activité du CV', () => {
  DomainesActivitePrimitives.toggleVisibilite(VERSION, dernierDomaine, false);
});

When('je rends visible ce domaine d\'activité sur le CV', () => {
  DomainesActivitePrimitives.toggleVisibilite(VERSION, dernierDomaine, true);
});

Then('le domaine d\'activité {string} apparaît dans ma liste', (nom: string) => {
  DomainesActivitePrimitives.verifierExiste(VERSION, nom);
});

Then('le domaine d\'activité {string} n\'apparaît plus dans ma liste', (nom: string) => {
  DomainesActivitePrimitives.verifierAbsent(VERSION, nom);
});

Then('le domaine d\'activité {string} est masqué sur le CV', (nom: string) => {
  DomainesActivitePrimitives.verifierVisibilite(VERSION, nom, false);
});

Then('le domaine d\'activité {string} est visible sur le CV', (nom: string) => {
  DomainesActivitePrimitives.verifierVisibilite(VERSION, nom, true);
});

When('je change le tri du domaine d\'activité {string} à la position {string}', (nom: string, position: string) => {
  DomainesActivitePrimitives.changerTri(VERSION, nom, position);
});

Then('le domaine d\'activité {string} est en position {string} dans la liste', (nom: string, position: string) => {
  DomainesActivitePrimitives.verifierPosition(VERSION, nom, position);
});