import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-hashtags.config';
import { HashtagsPrimitives } from '../../primitives/sections-cv/hashtags.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

let dernierHashtag = '';

Given('un hashtag {string} existe dans ma liste', (nom: string) => {
  dernierHashtag = nom;
  HashtagsPrimitives.garantirHashtagExiste(VERSION, nom);
});

Given('un hashtag {string} existe et est visible sur le CV', (nom: string) => {
  dernierHashtag = nom;
  HashtagsPrimitives.garantirHashtagExiste(VERSION, nom);
  HashtagsPrimitives.toggleVisibilite(VERSION, nom, true);
});

Given('un hashtag {string} existe et est masqué sur le CV', (nom: string) => {
  dernierHashtag = nom;
  HashtagsPrimitives.garantirHashtagExiste(VERSION, nom);
  HashtagsPrimitives.toggleVisibilite(VERSION, nom, false);
});

When('j\'ajoute le hashtag {string}', (nom: string) => {
  HashtagsPrimitives.ajouterHashtag(VERSION, nom);
});

When('je modifie ce hashtag en {string}', (nouveauNom: string) => {
  HashtagsPrimitives.modifierHashtag(VERSION, dernierHashtag, nouveauNom);
});

When('je supprime ce hashtag', () => {
  HashtagsPrimitives.supprimerHashtag(VERSION, dernierHashtag);
});

When('je masque ce hashtag du CV', () => {
  HashtagsPrimitives.toggleVisibilite(VERSION, dernierHashtag, false);
});

When('je rends visible ce hashtag sur le CV', () => {
  HashtagsPrimitives.toggleVisibilite(VERSION, dernierHashtag, true);
});

When('je change le tri du hashtag {string} à la position {string}', (nom: string, position: string) => {
  HashtagsPrimitives.changerTri(VERSION, nom, position);
});

Then('le hashtag {string} est en position {string} dans la liste', (nom: string, position: string) => {
  HashtagsPrimitives.verifierPosition(VERSION, nom, position);
});

Then('le hashtag {string} apparaît dans ma liste', (nom: string) => {
  HashtagsPrimitives.verifierExiste(VERSION, nom);
});

Then('le hashtag {string} n\'apparaît plus dans ma liste', (nom: string) => {
  HashtagsPrimitives.verifierAbsent(VERSION, nom);
});

Then('le hashtag {string} est masqué sur le CV', (nom: string) => {
  HashtagsPrimitives.verifierVisibilite(VERSION, nom, false);
});

Then('le hashtag {string} est visible sur le CV', (nom: string) => {
  HashtagsPrimitives.verifierVisibilite(VERSION, nom, true);
});