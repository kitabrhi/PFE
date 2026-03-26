import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-points-forts.config';
import { PointsFortsPrimitives } from '../../primitives/sections-cv/points-forts.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

let dernierPointFort = '';

//  PRÉPARATION

Given('un point fort {string} existe dans ma liste', (texte: string) => {
  dernierPointFort = texte;
  PointsFortsPrimitives.garantirPointFortExiste(VERSION, texte);
});

Given('un point fort {string} existe et est visible sur le CV', (texte: string) => {
  dernierPointFort = texte;
  PointsFortsPrimitives.garantirPointFortExiste(VERSION, texte);
  PointsFortsPrimitives.toggleVisibilite(VERSION, texte, true);
});

Given('un point fort {string} existe et est masqué sur le CV', (texte: string) => {
  dernierPointFort = texte;
  PointsFortsPrimitives.garantirPointFortExiste(VERSION, texte);
  PointsFortsPrimitives.toggleVisibilite(VERSION, texte, false);
});
// Ajout
When('j\'ajoute le point fort {string}', (texte: string) => {
  PointsFortsPrimitives.ajouterPointFort(VERSION, texte);
});
// Modification, suppression et visibilite

When('je modifie ce point fort en {string}', (nouveau: string) => {
  PointsFortsPrimitives.modifierPointFort(VERSION, dernierPointFort, nouveau);
});

When('je supprime ce point fort', () => {
  PointsFortsPrimitives.supprimerPointFort(VERSION, dernierPointFort);
});

When('je masque ce point fort du CV', () => {
  PointsFortsPrimitives.toggleVisibilite(VERSION, dernierPointFort, false);
});

When('je rends visible ce point fort sur le CV', () => {
  PointsFortsPrimitives.toggleVisibilite(VERSION, dernierPointFort, true);
});

//  VÉRIFICATIONS

Then('le point fort {string} apparaît dans ma liste', (texte: string) => {
  PointsFortsPrimitives.verifierExiste(VERSION, texte);
});

Then('le point fort {string} n\'apparaît plus dans ma liste', (texte: string) => {
  PointsFortsPrimitives.verifierAbsent(VERSION, texte);
});

Then('le point fort {string} est masqué sur le CV', (texte: string) => {
  PointsFortsPrimitives.verifierVisibilite(VERSION, texte, false);
});

Then('le point fort {string} est visible sur le CV', (texte: string) => {
  PointsFortsPrimitives.verifierVisibilite(VERSION, texte, true);
});