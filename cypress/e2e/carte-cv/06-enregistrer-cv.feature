@carte-cv @enregistrer @prioritaire
Feature: Enregistrer les modifications d'un CV
  en tant qu'utilisateur de ReDsume
  Je veux pouvoir sauvegarder mes modifications
  Afin de conserver mon travail

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"

  @CARTE-008
  Scenario: Sauvegarder les modifications d'un CV en cours
    When j'enregistre les modifications d'un CV avec le statut "En cours"
    Then les modifications sont sauvegardées