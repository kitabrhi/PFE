Feature: Authentification - Connexion incorrecte

  Scenario: Connexion avec identifiants incorrects
    Given Je suis sur la page de connexion
    When Je tente de me connecter avec des identifiants incorrects
    Then L'authentification échoue
    And Je vois un message d'erreur indiquant que les identifiants sont invalides
    And Je reste sur la page de connexion