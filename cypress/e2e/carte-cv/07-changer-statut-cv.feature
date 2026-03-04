@carte-cv @changer-statut @prioritaire
Feature: Changer le statut d'un CV
  en tant qu'utilisateur de ReDsume
  Je veux pouvoir changer le statut de mon CV
  Afin de suivre l'avancement de sa rédaction

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"

  @CARTE-009
  Scenario: Passer un CV en statut "En cours"
    When je change le statut d'un CV "Non démarré" en "En cours"
    Then le statut du CV devient "En cours"

  @CARTE-010
  Scenario: Marquer un CV comme "Complété"
    When je change le statut d'un CV "En cours" en "Complété"
    Then le statut du CV devient "Complété"

  @CARTE-011
  Scenario: Remettre un CV en "Non démarré"
    When je change le statut d'un CV "Complété" en "Non démarré"
    Then le statut du CV devient "Non démarré"