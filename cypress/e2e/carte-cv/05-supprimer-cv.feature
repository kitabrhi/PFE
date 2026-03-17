@carte-cv @supprimer
Feature: Supprimer un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir supprimer définitivement un CV
  Afin de nettoyer mes anciennes versions

  Background:
    Given je suis connecté à mon compte
    And je suis sur la page "Mes CVS"
    And j'ai au moins 2 CVs sur la page

  @CARTE-006
  Scenario: Supprimer un CV avec succès
    Given un CV existe dans ma liste
    When je supprime ce CV
    Then le CV est supprimé définitivement
    And il n'apparaît plus dans ma liste

  @CARTE-007
  Scenario: Annuler la suppression d'un CV
    Given un CV existe dans ma liste
    When je demande à supprimer ce CV
    And j'annule la suppression
    Then le CV reste dans ma liste