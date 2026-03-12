import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-description.config';
import { DescriptionPrimitives } from '../../primitives/sections-cv/description.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// ─── Saisir ─────────────────────────────────────────────────────────────────

When('je renseigne mon résumé de profil', () => {
  DescriptionPrimitives.saisirDescription(VERSION);
});

When('j\'efface mon résumé de profil', () => {
  DescriptionPrimitives.effacerDescription(VERSION);
});

// ─── Vérifications ──────────────────────────────────────────────────────────

Then('mon résumé de profil est enregistré', () => {
  DescriptionPrimitives.verifierDescriptionPresente(VERSION);
});

Then('mon résumé de profil est vide', () => {
  DescriptionPrimitives.verifierDescriptionVide(VERSION);
});

Then('le compteur indique {int} caractères sur 1000', (nombre: number) => {
  DescriptionPrimitives.verifierCompteurCaracteres(VERSION, nombre);
});

When('je renseigne une description dépassant {int} caractères', (limite: number) => {
  DescriptionPrimitives.saisirDescriptionLongue(VERSION);
});

Then('la limite de {int} caractères est respectée', (limite: number) => {
  DescriptionPrimitives.verifierLimiteCaracteresRespectee(VERSION);
});

// ─── Navigation ─────────────────────────────────────────────────────────────
// Given 'je suis sur la section {string}'     → défini dans sections-titre-cv.steps.ts
// When  'je quitte la section {string}'        → défini dans sections-titre-cv.steps.ts
// When  'je reviens sur la section {string}'   → défini dans sections-titre-cv.steps.ts