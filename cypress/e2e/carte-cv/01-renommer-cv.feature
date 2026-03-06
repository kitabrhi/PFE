@carte-cv @renommer @prioritaire
Feature: Renommer un CV
  en tant qu'utilisateur de ReDsume
  Je veux pouvoir renommer mon CV
  Afin de mieux organiser mes différentes versions

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"

  @CARTE-001
  Scenario: Renommer un CV en cours avec succès
    When je renomme un CV avec le statut "En cours" en "Mon CV Unique 2026"
    Then le CV est renommé en "Mon CV Unique 2026"

  @CARTE-001-bis
  Scenario: Impossibilité de renommer avec un nom existant
    When je tente de renommer un CV avec le statut "En cours" en "Mon CV Professionnel"
    Then le message d'erreur "Ce nom existe déjà." apparaît
    And le renommage est refusé
