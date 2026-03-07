@carte-cv @enregistrer @prioritaire
Feature: Enregistrer les modifications d'un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir sauvegarder mes modifications
  Afin de conserver mon travail

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"

  @CARTE-008
  Scenario Outline: Sauvegarder les modifications d'un CV
    Given un CV a le statut "<statut>"
    When j'enregistre les modifications d'un CV avec le statut "<statut>"
    Then les modifications sont sauvegardées

    Examples:
      | statut       |
      | En cours     |
      | Non démarré  |
      | Complété     |
