Feature: Authentification - Connexion valide

  Scenario: Connexion avec identifiants valides
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And Je vois mon espace personnelnpx tsc --version
