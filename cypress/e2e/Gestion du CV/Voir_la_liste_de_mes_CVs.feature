Feature: Gestion des CVs

  Background: Authentification préalable
    Given Je suis sur la page d'accueil de Redsume
    When Je me connecte avec des identifiants valides
    Then Je suis authentifié et sur le dashboard

  Scenario: Voir la liste de mes CVs
    Given Je suis connecté à Redsume
    When Je clique sur "Mes CVS" dans le menu
    Then Je vois la liste de tous mes CVs
