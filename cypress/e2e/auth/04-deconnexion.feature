Feature: Authentification - Déconnexion

  Scenario: Déconnexion de l'application
    Given Je suis authentifié dans l'application
    When Je me déconnecte
    Then Je suis redirigé vers la page de connexion
    And Ma session est terminée