// Steps pour la section Titres et la navigation entre sections.
// Les steps n'importent rien de la config — tout passe par les primitives.

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-titre-cv.config';
import { SectionsCVPrimitives } from '../../primitives/sections-cv/titre-cv.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

afterEach(() => {
  cy.log('🧹 Nettoyage après test');
});



// Préparation

Given('un titre {string} existe dans ma liste', (titre: string) => {
  SectionsCVPrimitives.garantirTitreExiste(VERSION, titre);
});

Given('un titre {string} existe et est visible sur le CV', (titre: string) => {
  SectionsCVPrimitives.garantirTitreExiste(VERSION, titre);
  SectionsCVPrimitives.toggleVisibilite(VERSION, titre, true);
});

Given('un titre {string} existe et est masqué sur le CV', (titre: string) => {
  SectionsCVPrimitives.garantirTitreExiste(VERSION, titre);
  SectionsCVPrimitives.toggleVisibilite(VERSION, titre, false);
});

Given('les titres suivants existent dans l\'ordre :', (dataTable: any) => {
  cy.log('🔧 PRÉPARATION: Créer les titres dans l\'ordre donné');

  const titres = dataTable.hashes();
  titres.forEach((row: { ordre: string; titre: string }) => {
    SectionsCVPrimitives.garantirTitreExiste(VERSION, row.titre);
  });
});

// Ajout

When('j\'ajoute le titre {string}', (titre: string) => {
  SectionsCVPrimitives.ajouterTitre(VERSION, titre);
});

// Modification

When('je modifie le titre {string} en {string}', (ancien: string, nouveau: string) => {
  SectionsCVPrimitives.modifierTitre(VERSION, ancien, nouveau);
});

// Suppression

When('je supprime le titre {string}', (titre: string) => {
  SectionsCVPrimitives.supprimerLigne(VERSION, titre);
});

// Visibilité

When('je masque le titre {string} du CV', (titre: string) => {
  SectionsCVPrimitives.toggleVisibilite(VERSION, titre, false);
});

When('je rends visible le titre {string} sur le CV', (titre: string) => {
  SectionsCVPrimitives.toggleVisibilite(VERSION, titre, true);
});

// Réorganisation

When('je place le titre {string} en position {int}', (titre: string, position: number) => {
  SectionsCVPrimitives.changerOrdre(VERSION, titre, position);
});

// Vérifications

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
