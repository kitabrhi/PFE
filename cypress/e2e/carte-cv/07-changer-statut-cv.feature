@carte-cv @changer-statut 
Feature: Changer le statut d'un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir changer le statut de mon CV
  Afin de suivre l'avancement de sa rédaction

  Background:
    Given je suis connecté à mon compte
    And je suis sur la page "Mes CVS"

  @CARTE-009
  Scenario Outline: Changer le statut d'un CV
    Given un CV existe dans ma liste
    When je change le statut de ce CV en "<nouveau_statut>"
    Then le statut du CV devient "<nouveau_statut>"

    Examples:
      | nouveau_statut |
      | En cours       |
      | Complété       |
      | Non démarré    |
