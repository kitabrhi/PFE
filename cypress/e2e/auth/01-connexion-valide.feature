@auth @connexion @prioritaire
Feature: Connexion avec identifiants valides
  en tant qu'utilisateur invité de ReDsume
  Je veux pouvoir me connecter avec mes identifiants
  Afin d'accéder à mon espace de gestion de CV

  @AUTH-001
  Scenario: Connexion réussie avec email et mot de passe
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And Je vois mon espace personnel
