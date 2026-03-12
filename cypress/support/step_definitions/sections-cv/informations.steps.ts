import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Version } from '../../config/section/selectors-informations.config';
import { InformationsPrimitives } from '../../primitives/sections-cv/informations.primitives';

const VERSION: Version = (Cypress.env('APP_VERSION') as Version) || 'v1';

// ─── Photo ──────────────────────────────────────────────────────────────────

When("j'ajoute une photo de profil", () => {
  InformationsPrimitives.uploaderPhoto(VERSION, 'cypress/fixtures/photo-test.jpg');
});

Then('ma photo de profil est visible sur mon CV', () => {
  InformationsPrimitives.verifierPhotoPresente(VERSION);
});

// ─── Email ──────────────────────────────────────────────────────────────────

Then('mon email est affiché sur ma page de profil', () => {
  InformationsPrimitives.verifierEmailAffiche(VERSION);
});

Then("je ne peux pas modifier mon email", () => {
  InformationsPrimitives.verifierEmailNonEditable(VERSION);
});

// ─── Prénom ─────────────────────────────────────────────────────────────────

When('je mets à jour mon prénom', () => {
  InformationsPrimitives.modifierPrenom(VERSION);
});

Then('mon nouveau prénom est affiché sur mon profil', () => {
  InformationsPrimitives.verifierPrenom(VERSION);
});

// ─── Nom ────────────────────────────────────────────────────────────────────

When('je mets à jour mon nom de famille', () => {
  InformationsPrimitives.modifierNom(VERSION);
});

Then('mon nouveau nom de famille est affiché sur mon profil', () => {
  InformationsPrimitives.verifierNom(VERSION);
});

// ─── Date de naissance ──────────────────────────────────────────────────────

When('je renseigne ma date de naissance', () => {
  InformationsPrimitives.modifierDateNaissance(VERSION);
});

Then('ma date de naissance est enregistrée sur mon profil', () => {
  InformationsPrimitives.verifierDateNaissance(VERSION);
});

// ─── Début activité ─────────────────────────────────────────────────────────

When("je renseigne mon début d'activité professionnelle", () => {
  InformationsPrimitives.modifierDebutActivite(VERSION);
});

Then("mon début d'activité professionnelle est enregistré sur mon profil", () => {
  InformationsPrimitives.verifierDebutActivite(VERSION);
});