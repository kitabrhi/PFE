@auth @connexion @erreur
Feature: Connexion avec email invalide
  en tant qu'utilisateur de ReDsume
  Je veux être informé si mon compte n'existe pas
  Afin de vérifier mon adresse email

  @AUTH-003
  Scenario: Connexion refusée avec un compte inexistant
    Given Je suis sur la page de connexion
    When Je tente de me connecter avec un email au format invalide
    Then L'authentification échoue
    And Je vois un message indiquant que le compte n'existe pas
