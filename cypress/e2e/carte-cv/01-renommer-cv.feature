@carte-cv @renommer @prioritaire
Feature: Renommer un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir renommer mon CV
  Afin de mieux organiser mes différentes versions

  Background:
    Given je suis connecté à mon compte
    And je suis sur la page "Mes CVS"

  @CARTE-001
  Scenario: Renommer un CV avec succès
    Given un CV existe dans ma liste
    When je renomme ce CV en "Mon CV Unique 2026"
    Then le CV est renommé en "Mon CV Unique 2026"

  @CARTE-001-bis
  Scenario: Impossibilité de renommer avec un nom existant
    Given un CV porte déjà le nom "CV Doublon Test"
    When je tente de renommer un autre CV en "CV Doublon Test"
    Then un message d'erreur indique que ce nom existe déjà
    And le renommage est refusé
