import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-experiences.config';
import { ExperiencesPrimitives } from '../../primitives/sections-cv/experiences.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

let derniereExperience = '';

Given('une expérience {string} existe dans ma liste', (titre: string) => {
  derniereExperience = titre;
  ExperiencesPrimitives.garantirExperienceExiste(VERSION, titre);
});

Given('une expérience {string} existe et est visible sur le CV', (titre: string) => {
  derniereExperience = titre;
  ExperiencesPrimitives.garantirExperienceExiste(VERSION, titre);
  ExperiencesPrimitives.toggleVisibilite(VERSION, titre, true);
});

Given('une expérience {string} existe et est masquée sur le CV', (titre: string) => {
  derniereExperience = titre;
  ExperiencesPrimitives.garantirExperienceExiste(VERSION, titre);
  ExperiencesPrimitives.toggleVisibilite(VERSION, titre, false);
});

When(
  'j\'ajoute l\'expérience {string} chez {string} à {string} du {string} au {string}',
  (titre: string, societe: string, lieu: string, debut: string, fin: string) => {
    ExperiencesPrimitives.ajouterExperience(VERSION, { titre, societe, lieu, debut, fin });
  }
);

When(
  'je modifie cette expérience en {string} chez {string} à {string}',
  (nouveauTitre: string, nouvelleSociete: string, nouveauLieu: string) => {
    ExperiencesPrimitives.modifierExperience(VERSION, derniereExperience, {
      titre: nouveauTitre,
      societe: nouvelleSociete,
      lieu: nouveauLieu
    });
  }
);

When('je supprime cette expérience', () => {
  ExperiencesPrimitives.supprimerExperience(VERSION, derniereExperience);
});

When('je masque cette expérience du CV', () => {
  ExperiencesPrimitives.toggleVisibilite(VERSION, derniereExperience, false);
});

When('je rends visible cette expérience sur le CV', () => {
  ExperiencesPrimitives.toggleVisibilite(VERSION, derniereExperience, true);
});

When('je change le tri de l\'expérience {string} à la position {string}', (titre: string, position: string) => {
  ExperiencesPrimitives.changerTri(VERSION, titre, position);
});

Then('l\'expérience {string} est en position {string} dans la liste', (titre: string, position: string) => {
  ExperiencesPrimitives.verifierPosition(VERSION, titre, position);
});

Then('l\'expérience {string} apparaît dans ma liste', (titre: string) => {
  ExperiencesPrimitives.verifierExiste(VERSION, titre);
});

Then('l\'expérience {string} n\'apparaît plus dans ma liste', (titre: string) => {
  ExperiencesPrimitives.verifierAbsente(VERSION, titre);
});

Then('l\'expérience {string} est masquée sur le CV', (titre: string) => {
  ExperiencesPrimitives.verifierVisibilite(VERSION, titre, false);
});

Then('l\'expérience {string} est visible sur le CV', (titre: string) => {
  ExperiencesPrimitives.verifierVisibilite(VERSION, titre, true);
});

Then(
  'l\'expérience {string} a pour société {string} et lieu {string}',
  (titre: string, societe: string, lieu: string) => {
    ExperiencesPrimitives.verifierChamps(VERSION, titre, societe, lieu);
  }
);  