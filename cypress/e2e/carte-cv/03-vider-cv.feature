@carte-cv @vider
Feature: Vider le contenu d'un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir vider le contenu de mon CV
  Afin de repartir sur une base vierge

  Background:
    Given je suis connecté à mon compte
    And je suis sur la page "Mes CVS"

  @CARTE-003
  Scenario: Vider le contenu d'un CV avec succès
    Given un CV existe dans ma liste
    When je vide ce CV
    Then toutes les informations sont supprimées

  @CARTE-004
  Scenario: Annuler le vidage d'un CV
    Given un CV existe dans ma liste
    When je demande à vider ce CV
    And j'annule l'opération
    Then le contenu du CV reste intact