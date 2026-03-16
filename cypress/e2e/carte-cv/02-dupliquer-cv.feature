@carte-cv @dupliquer @prioritaire
Feature: Dupliquer un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir dupliquer mon CV
  Afin de créer des variantes pour différentes candidatures

  Background:
    Given Je suis sur la page de connexion
    Given je suis connecté à mon compte
    And je suis sur la page "Mes CVS"

  @CARTE-002
  Scenario Outline: Dupliquer un CV avec succès
    Given un CV a le statut "<statut>"
    When je duplique un CV avec le statut "<statut>"
    Then une copie du CV est créée
    And la copie apparaît dans ma liste de CV

    Examples:
      | statut       |
      | En cours     |
      | Non démarré  |
      | Complété     |
