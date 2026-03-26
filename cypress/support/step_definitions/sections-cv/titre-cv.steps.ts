import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-titre-cv.config';
import { SectionsCVPrimitives } from '../../primitives/sections-cv/titre-cv.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

let dernierTitre = '';

afterEach(() => {
  cy.log('Nettoyage après test');
});

//  PRÉPARATION

Given('un titre {string} existe dans ma liste', (titre: string) => {
  dernierTitre = titre;
  SectionsCVPrimitives.garantirTitreExiste(VERSION, titre);
});

Given('un titre {string} existe et est visible sur le CV', (titre: string) => {
  dernierTitre = titre;
  SectionsCVPrimitives.garantirTitreExiste(VERSION, titre);
  SectionsCVPrimitives.toggleVisibilite(VERSION, titre, true);
});

Given('un titre {string} existe et est masqué sur le CV', (titre: string) => {
  dernierTitre = titre;
  SectionsCVPrimitives.garantirTitreExiste(VERSION, titre);
  SectionsCVPrimitives.toggleVisibilite(VERSION, titre, false);
});

Given('les titres suivants existent dans l\'ordre :', (dataTable: any) => {
  cy.log('PRÉPARATION: Créer les titres dans l\'ordre donné');

  const titres = dataTable.hashes();
  titres.forEach((row: { ordre: string; titre: string }) => {
    SectionsCVPrimitives.garantirTitreExiste(VERSION, row.titre);
  });
});
// Ajout
When('j\'ajoute le titre {string}', (titre: string) => {
  SectionsCVPrimitives.ajouterTitre(VERSION, titre);
});
// Modification, suppression et visibilite

When('je modifie ce titre en {string}', (nouveauTitre: string) => {
  SectionsCVPrimitives.modifierTitre(VERSION, dernierTitre, nouveauTitre);
});

When('je supprime ce titre', () => {
  SectionsCVPrimitives.supprimerLigne(VERSION, dernierTitre);
});

When('je masque ce titre du CV', () => {
  SectionsCVPrimitives.toggleVisibilite(VERSION, dernierTitre, false);
});

When('je rends visible ce titre sur le CV', () => {
  SectionsCVPrimitives.toggleVisibilite(VERSION, dernierTitre, true);
});

When('je place le titre {string} en position {int}', (titre: string, position: number) => {
  SectionsCVPrimitives.changerOrdre(VERSION, titre, position);
});

//  VÉRIFICATIONS

Then('le titre {string} apparaît dans ma liste de titres', (titre: string) => {
  SectionsCVPrimitives.verifierTitreExiste(VERSION, titre);
});

Then('le titre {string} n\'apparaît plus dans ma liste de titres', (titre: string) => {
  SectionsCVPrimitives.verifierTitreAbsent(VERSION, titre);
});

Then('le titre {string} n\'apparaît pas dans ma liste de titres', (titre: string) => {
  SectionsCVPrimitives.verifierTitreAbsent(VERSION, titre);
});

Then('le titre {string} est masqué sur le CV', (titre: string) => {
  SectionsCVPrimitives.verifierVisibilite(VERSION, titre, false);
});

Then('le titre {string} est visible sur le CV', (titre: string) => {
  SectionsCVPrimitives.verifierVisibilite(VERSION, titre, true);
});

Then('le titre {string} est en position {int}', (titre: string, position: number) => {
  SectionsCVPrimitives.verifierOrdre(VERSION, titre, position);
});

Then('une nouvelle ligne vide est disponible', () => {
  SectionsCVPrimitives.verifierNouvelleLigneVide(VERSION);
});