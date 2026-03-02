Feature: Authentification - Email invalide

  Scenario: Connexion avec email au format invalide
    Given Je suis sur la page de connexion
    When Je tente de me connecter avec un email au format invalide
    Then L'authentification échoue
    And Je vois un message indiquant que le compte n'existe pas