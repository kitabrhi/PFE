@auth @connexion @erreur
Feature: Connexion avec identifiants incorrects
  en tant qu'utilisateur de ReDsume
  Je veux être informé si mes identifiants sont incorrects
  Afin de corriger ma saisie

  @AUTH-002
  Scenario: Connexion refusée avec mot de passe incorrect
    Given Je suis sur la page de connexion
    When Je tente de me connecter avec des identifiants incorrects
    Then L'authentification échoue
    And Je vois un message d'erreur indiquant que les identifiants sont invalides
    And Je reste sur la page de connexion
