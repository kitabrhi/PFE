@carte-cv @enregistrer @prioritaire
Feature: Enregistrer les modifications d'un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir sauvegarder mes modifications
  Afin de conserver mon travail

  Background:
    Given je suis connecté à mon compte
    And je suis sur la page "Mes CVS"

  @CARTE-008
  Scenario: Sauvegarder les modifications d'un CV
    Given un CV existe dans ma liste
    When je modifie ce CV
    And j'enregistre les modifications
    Then les modifications sont sauvegardées