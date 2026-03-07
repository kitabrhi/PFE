@carte-cv @renommer @prioritaire
Feature: Renommer un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir renommer mon CV
  Afin de mieux organiser mes différentes versions

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"

  @CARTE-001
  Scenario Outline: Renommer un CV avec succès
    Given un CV a le statut "<statut>"
    When je renomme un CV avec le statut "<statut>" en "Mon CV Unique 2026"
    Then le CV est renommé en "Mon CV Unique 2026"

    Examples:
      | statut       |
      | En cours     |
      | Non démarré  |
      | Complété     |

 @CARTE-001-bis
  Scenario: Impossibilité de renommer avec un nom existant
    Given un CV porte déjà le nom "CV Doublon Test"
    When je tente de renommer un autre CV en "CV Doublon Test"
    Then le message d'erreur "Ce nom existe déjà." apparaît
    And le renommage est refusé

    