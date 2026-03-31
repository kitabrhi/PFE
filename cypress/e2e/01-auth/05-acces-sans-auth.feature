@auth @securite
Feature: Protection des pages sans authentification
  en tant que système ReDsume
  Je veux empêcher l'accès non authentifié aux pages protégées
  Afin de garantir la sécurité des données utilisateurs

  @AUTH-005
  Scenario: Redirection automatique vers la connexion
    Given Je ne suis pas authentifié
    When Je tente d'accéder à une page protégée
    Then L'accès est refusé
    And Je suis redirigé vers la page de connexion
