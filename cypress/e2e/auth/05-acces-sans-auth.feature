Feature: Authentification - Accès sans authentification

  Scenario: Accès à une page protégée sans authentification
    Given Je ne suis pas authentifié
    When Je tente d'accéder à une page protégée
    Then L'accès est refusé
    And Je suis redirigé vers la page de connexion