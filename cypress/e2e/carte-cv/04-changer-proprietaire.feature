@carte-cv @proprietaire
Feature: Transférer la propriété d'un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir transférer mon CV à un collègue
  Afin de déléguer sa gestion

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"

  @CARTE-005
  Scenario Outline: Transférer un CV à un collègue
    Given un CV a le statut "<statut>"
    When je transfère un CV avec le statut "<statut>" à "nouveau.proprietaire@redsen.com"
    Then le propriétaire du CV devient "nouveau.proprietaire@redsen.com"

    Examples:
      | statut       |
      | En cours     |
      | Non démarré  |
      | Complété     |
