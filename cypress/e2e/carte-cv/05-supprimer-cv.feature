@carte-cv @supprimer
Feature: Supprimer un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir supprimer définitivement un CV
  Afin de nettoyer mes anciennes versions

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"

  @CARTE-006
  Scenario Outline: Supprimer un CV avec succès
    Given un CV a le statut "<statut>"
    When je supprime un CV avec le statut "<statut>"
    Then le CV est supprimé définitivement
    And il n'apparaît plus dans ma liste

    Examples:
      | statut       |
      | En cours     |
      | Non démarré  |
      | Complété     |

  @CARTE-007
  Scenario: Annuler la suppression d'un CV
    When je demande à supprimer un CV avec le statut "En cours"
    And j'annule la suppression
    Then le CV reste dans ma liste
