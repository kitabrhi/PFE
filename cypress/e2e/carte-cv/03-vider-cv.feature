@carte-cv @vider
Feature: Vider le contenu d'un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir vider le contenu de mon CV
  Afin de repartir sur une base vierge

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"

  @CARTE-003
  Scenario Outline: Vider le contenu d'un CV avec succès
    Given un CV a le statut "<statut>"
    When je vide un CV avec le statut "<statut>"
    Then toutes les informations sont supprimées

    Examples:
      | statut       |
      | En cours     |
      | Non démarré  |
      | Complété     |

  @CARTE-004
  Scenario: Annuler le vidage d'un CV
    When je demande à vider un CV avec le statut "En cours"
    And j'annule l'opération
    Then le contenu du CV reste intact
