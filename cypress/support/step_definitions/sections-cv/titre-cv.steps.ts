

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version, getSelector, SECTION_ROW } from '../../config/section/selectors-titre-cv.config';
import { SectionsCVPrimitives } from '../../primitives/sections-cv/titre-cv.primitives';
import { CarteCVPrimitives } from '@support/primitives/carte-cv/actions.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// Navigation entre la liste et les sections du CV.

Given('je sélectionne un CV existant', () => {
  cy.log('🔍 Sélection d\'un CV existant');

  if (VERSION === 'v1') {
    cy.get('tr.mat-mdc-row', { timeout: 10000 }).then($rows => {
      if ($rows.length === 0) {
        throw new Error(
          '❌ Aucun CV trouvé dans la liste. ' +
          'Veuillez créer au moins un CV avant de lancer les tests de section.'
        );
      }
      cy.wrap($rows).first().click();
      cy.wait(1500);
    });
  } else {
    cy.get('[data-testid="cv-row"]', { timeout: 10000 }).then($rows => {
      if ($rows.length === 0) {
        throw new Error(
          '❌ Aucun CV trouvé dans la liste. ' +
          'Veuillez créer au moins un CV avant de lancer les tests de section.'
        );
      }
      cy.wrap($rows).first().click();
      cy.wait(1500);
      CarteCVPrimitives.verifierNavigationPageDetail(VERSION);
    });
  }

  cy.log('✅ CV sélectionné');
});

Given('je suis sur la section {string}', (nomSection: string) => {
  SectionsCVPrimitives.naviguerVersSection(VERSION, nomSection);
});

When('je quitte la section {string}', (nomSection: string) => {
  cy.log(`🚪 Quitter la section "${nomSection}"`);
  const autreSection = nomSection === 'Informations' ? 'Titres' : 'Informations';
  SectionsCVPrimitives.naviguerVersSection(VERSION, autreSection);
});

When('je reviens sur la section {string}', (nomSection: string) => {
  cy.log(`🔙 Retour sur la section "${nomSection}"`);
  SectionsCVPrimitives.naviguerVersSection(VERSION, nomSection);
});

// Crochet laissé en place si un nettoyage devient utile.

afterEach(() => {
  cy.log('🧹 Nettoyage après test');
});

// Ajout.

When('j\'ajoute le titre {string}', (titre: string) => {
  SectionsCVPrimitives.ajouterTitre(VERSION, titre);
});

// Modification.

When('je modifie le titre {string} en {string}', (ancien: string, nouveau: string) => {
  SectionsCVPrimitives.modifierTitre(VERSION, ancien, nouveau);
});

// Suppression.

When('je supprime le titre {string}', (titre: string) => {
  SectionsCVPrimitives.supprimerLigne(VERSION, titre);
});

// Visibilité.

When('je masque le titre {string} du CV', (titre: string) => {
  SectionsCVPrimitives.toggleVisibilite(VERSION, titre, false);
});

When('je rends visible le titre {string} sur le CV', (titre: string) => {
  SectionsCVPrimitives.toggleVisibilite(VERSION, titre, true);
});

// Réorganisation.

When('je place le titre {string} en position {int}', (titre: string, position: number) => {
  SectionsCVPrimitives.changerOrdre(VERSION, titre, position);
});

// Préparation des données.

Given('un titre {string} existe dans ma liste', (titre: string) => {
  cy.log(`🔧 PRÉPARATION: S'assurer que le titre "${titre}" existe`);

  const rowSelector = getSelector(SECTION_ROW.ROW, VERSION);

  cy.get('body').then($body => {
    const found = $body.find(rowSelector).filter(`:contains("${titre}")`);

    if (found.length === 0) {
      cy.log(`➕ Titre "${titre}" inexistant → création`);
      SectionsCVPrimitives.ajouterTitre(VERSION, titre);
      // Rien de plus à faire ici, l'écran sauvegarde tout seul.
    } else {
      cy.log(`✅ Titre "${titre}" déjà présent`);
    }
  });
});

Given('un titre {string} existe et est visible sur le CV', (titre: string) => {
  cy.log(`🔧 PRÉPARATION: Titre "${titre}" existe et visible`);

  const rowSelector = getSelector(SECTION_ROW.ROW, VERSION);

  cy.get('body').then($body => {
    const found = $body.find(rowSelector).filter(`:contains("${titre}")`);
    if (found.length === 0) {
      SectionsCVPrimitives.ajouterTitre(VERSION, titre);
    }
  });

  // On remet explicitement la ligne en visible pour éviter un état hérité.
  SectionsCVPrimitives.toggleVisibilite(VERSION, titre, true);
});

Given('un titre {string} existe et est masqué sur le CV', (titre: string) => {
  cy.log(`🔧 PRÉPARATION: Titre "${titre}" existe et masqué`);

  const rowSelector = getSelector(SECTION_ROW.ROW, VERSION);

  cy.get('body').then($body => {
    const found = $body.find(rowSelector).filter(`:contains("${titre}")`);
    if (found.length === 0) {
      SectionsCVPrimitives.ajouterTitre(VERSION, titre);
    }
  });

  // Même idée ici, mais en version masquée.
  SectionsCVPrimitives.toggleVisibilite(VERSION, titre, false);
});

Given('les titres suivants existent dans l\'ordre :', (dataTable: any) => {
  cy.log('🔧 PRÉPARATION: Créer les titres dans l\'ordre donné');

  const titres = dataTable.hashes();
  const rowSelector = getSelector(SECTION_ROW.ROW, VERSION);

  titres.forEach((row: { ordre: string; titre: string }) => {
    cy.get('body').then($body => {
      const found = $body.find(rowSelector).filter(`:contains("${row.titre}")`);
      if (found.length === 0) {
        SectionsCVPrimitives.ajouterTitre(VERSION, row.titre);
      }
    });
  });
  // L'ordre final est persisté par l'auto-save.
});

// Vérifications.

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
