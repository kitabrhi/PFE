/**
 * Étapes pour la section Missions.
 * Pattern : le Given mémorise l'élément, le When utilise "cette mission".
 * 
 * DÉPENDANCE : la section Missions dépend de la section Expériences.
 * Le scénario MIS-011 (associer une mission à une expérience) nécessite
 * qu'une expérience existe d'abord. Le step "une expérience ... existe dans mon parcours"
 * navigue vers Expériences, crée l'expérience si besoin, puis revient sur Missions.
 */

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-missions.config';
import { MissionsPrimitives } from '../../primitives/sections-cv/missions.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

let derniereMission = '';

// ── PRÉPARATION ──

Given('une mission {string} existe dans ma liste', (role: string) => {
  derniereMission = role;
  MissionsPrimitives.garantirMissionExiste(VERSION, role);
});

Given('une mission {string} existe dans ma liste et n\'est pas confidentielle', (role: string) => {
  derniereMission = role;
  MissionsPrimitives.garantirMissionExiste(VERSION, role);
  MissionsPrimitives.toggleConfidentiel(VERSION, role, false);
});

Given('une mission {string} existe dans ma liste et est confidentielle', (role: string) => {
  derniereMission = role;
  MissionsPrimitives.garantirMissionExiste(VERSION, role);
  MissionsPrimitives.toggleConfidentiel(VERSION, role, true);
});

Given('une mission {string} existe et est incluse dans le CV', (role: string) => {
  derniereMission = role;
  MissionsPrimitives.garantirMissionExiste(VERSION, role);
  MissionsPrimitives.toggleInclusionCV(VERSION, role, true);
});

Given('une mission {string} existe et est exclue du CV', (role: string) => {
  derniereMission = role;
  MissionsPrimitives.garantirMissionExiste(VERSION, role);
  MissionsPrimitives.toggleInclusionCV(VERSION, role, false);
});

// Dépendance avec la section Expériences :
// navigue vers Expériences, crée l'expérience si besoin, puis revient sur Missions
Given('une expérience {string} existe dans mon parcours', (titreExperience: string) => {
  cy.log(`Vérification/création expérience "${titreExperience}" pour association mission`);
  MissionsPrimitives.garantirExperienceExistePourMission(VERSION, titreExperience);
});

// ── AJOUT ──

// MIS-001 : ajout classique avec dates
When(
  'j\'ajoute la mission {string} chez {string} à {string} du {string} au {string}',
  (role: string, societe: string, lieu: string, debut: string, fin: string) => {
    MissionsPrimitives.ajouterMission(VERSION, { role, societe, lieu, debut, fin });
  }
);

// MIS-002 : ajout avec contexte et tâches
When(
  'j\'ajoute la mission {string} chez {string} à {string} du {string} au {string} avec le contexte {string} et les tâches {string}',
  (role: string, societe: string, lieu: string, debut: string, fin: string, contexte: string, taches: string) => {
    MissionsPrimitives.ajouterMission(VERSION, { role, societe, lieu, debut, fin, contexte, taches });
  }
);

// MIS-003 : ajout sans date de fin (mission en cours)
When(
  'j\'ajoute la mission {string} chez {string} à {string} à partir du {string}',
  (role: string, societe: string, lieu: string, debut: string) => {
    MissionsPrimitives.ajouterMission(VERSION, { role, societe, lieu, debut });
  }
);

// ── MODIFICATION ──

When(
  'je modifie cette mission en {string} chez {string} à {string}',
  (nouveauRole: string, nouvelleSociete: string, nouveauLieu: string) => {
    MissionsPrimitives.modifierMission(VERSION, derniereMission, {
      role: nouveauRole,
      societe: nouvelleSociete,
      lieu: nouveauLieu
    });
  }
);

// ── SUPPRESSION ──

When('je supprime cette mission', () => {
  MissionsPrimitives.supprimerMission(VERSION, derniereMission);
});

// ── COPIE ──

When('je copie cette mission', () => {
  MissionsPrimitives.copierMission(VERSION, derniereMission);
});

// ── CONFIDENTIALITÉ ──

When('je marque cette mission comme confidentielle', () => {
  MissionsPrimitives.toggleConfidentiel(VERSION, derniereMission, true);
});

When('je retire le caractère confidentiel de cette mission', () => {
  MissionsPrimitives.toggleConfidentiel(VERSION, derniereMission, false);
});

// ── INCLUSION/EXCLUSION CV ──

When('j\'inclus cette mission dans le CV', () => {
  MissionsPrimitives.toggleInclusionCV(VERSION, derniereMission, true);
});

When('j\'exclus cette mission du CV', () => {
  MissionsPrimitives.toggleInclusionCV(VERSION, derniereMission, false);
});

// ── ASSOCIATION EXPÉRIENCE ──

When(
  'j\'associe la mission {string} à l\'expérience {string}',
  (role: string, titreExperience: string) => {
    MissionsPrimitives.associerExperience(VERSION, role, titreExperience);
  }
);

// ── RENSEIGNER CONTENU (CKEditor) ──

When('je renseigne le contexte {string}', (contenu: string) => {
  MissionsPrimitives.renseignerContenu(VERSION, derniereMission, 'contexte', contenu);
});

When('je renseigne les tâches {string}', (contenu: string) => {
  MissionsPrimitives.renseignerContenu(VERSION, derniereMission, 'taches', contenu);
});

When('je renseigne les actions {string}', (contenu: string) => {
  MissionsPrimitives.renseignerContenu(VERSION, derniereMission, 'actions', contenu);
});

When('je renseigne les résultats {string}', (contenu: string) => {
  MissionsPrimitives.renseignerContenu(VERSION, derniereMission, 'resultats', contenu);
});

When('je renseigne les technologies {string}', (contenu: string) => {
  MissionsPrimitives.renseignerContenu(VERSION, derniereMission, 'technologies', contenu);
});

// ── VÉRIFICATIONS ──

Then('la mission {string} apparaît dans ma liste', (role: string) => {
  MissionsPrimitives.verifierExiste(VERSION, role);
});

Then('la mission {string} n\'apparaît plus dans ma liste', (role: string) => {
  MissionsPrimitives.verifierAbsente(VERSION, role);
});

Then(
  'la mission {string} a pour société {string} et lieu {string}',
  (role: string, societe: string, lieu: string) => {
    MissionsPrimitives.verifierChamps(VERSION, role, societe, lieu);
  }
);

Then('une nouvelle mission {string} apparaît dans ma liste', (role: string) => {
  MissionsPrimitives.verifierExiste(VERSION, role);
});

Then('la mission copiée contient les mêmes informations que la mission d\'origine', () => {
  MissionsPrimitives.verifierCopie(VERSION, derniereMission);
});

Then('la mission {string} est marquée comme confidentielle', (role: string) => {
  MissionsPrimitives.verifierConfidentiel(VERSION, role, true);
});

Then('la mission {string} n\'est plus marquée comme confidentielle', (role: string) => {
  MissionsPrimitives.verifierConfidentiel(VERSION, role, false);
});

Then('la mission {string} est incluse dans le CV', (role: string) => {
  MissionsPrimitives.verifierInclusionCV(VERSION, role, true);
});

Then('la mission {string} est exclue du CV', (role: string) => {
  MissionsPrimitives.verifierInclusionCV(VERSION, role, false);
});

Then(
  'la mission {string} est liée à l\'expérience {string}',
  (role: string, titreExperience: string) => {
    MissionsPrimitives.verifierExperienceAssociee(VERSION, role, titreExperience);
  }
);

Then('le contexte de la mission {string} est enregistré', (role: string) => {
  MissionsPrimitives.trouverMissionParRole(VERSION, role);
  cy.get('[data-cy="descriptionMission-input"] .ck-editor__editable', { timeout: 10000 })
    .invoke('text').should('not.be.empty');
});

Then('les tâches de la mission {string} sont enregistrées', (role: string) => {
  MissionsPrimitives.trouverMissionParRole(VERSION, role);
  cy.get('[data-cy="tasksMission-input"] .ck-editor__editable', { timeout: 10000 })
    .invoke('text').should('not.be.empty');
});

Then('les actions de la mission {string} sont enregistrées', (role: string) => {
  MissionsPrimitives.trouverMissionParRole(VERSION, role);
  cy.get('[data-cy="actionsMission-input"] .ck-editor__editable', { timeout: 10000 })
    .invoke('text').should('not.be.empty');
});

Then('les résultats de la mission {string} sont enregistrés', (role: string) => {
  MissionsPrimitives.trouverMissionParRole(VERSION, role);
  cy.get('[data-cy="resultsMission-input"] .ck-editor__editable', { timeout: 10000 })
    .invoke('text').should('not.be.empty');
});

Then('les technologies de la mission {string} sont enregistrées', (role: string) => {
  MissionsPrimitives.trouverMissionParRole(VERSION, role);
  cy.get('[data-cy="technologiesMission-input"] .ck-editor__editable', { timeout: 10000 })
    .invoke('text').should('not.be.empty');
});