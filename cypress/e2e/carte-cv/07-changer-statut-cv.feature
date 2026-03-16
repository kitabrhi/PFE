@carte-cv @changer-statut @prioritaire
Feature: Changer le statut d'un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir changer le statut de mon CV
  Afin de suivre l'avancement de sa rédaction

  Background:
    Given je suis connecté à mon compte
    And je suis sur la page "Mes CVS"

  @CARTE-009
  Scenario Outline: Changer le statut d'un CV
    Given un CV a le statut "<statut_initial>"
    When je change le statut d'un CV "<statut_initial>" en "<nouveau_statut>"
    Then le statut du CV devient "<nouveau_statut>"

    Examples:
      | statut_initial | nouveau_statut |
      | Non démarré    | En cours       |
      | En cours       | Complété       |
      | Complété       | Non démarré    |
