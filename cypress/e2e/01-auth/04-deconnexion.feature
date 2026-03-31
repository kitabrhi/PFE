@auth @deconnexion
Feature: Déconnexion de l'application
  en tant qu'utilisateur authentifié de ReDsume
  Je veux pouvoir me déconnecter
  Afin de sécuriser mon compte après utilisation

  @AUTH-004
  Scenario: Déconnexion réussie depuis l'application
    Given Je suis authentifié dans l'application
    When Je me déconnecte
    Then Je suis redirigé vers la page de connexion
    And Ma session est terminée
