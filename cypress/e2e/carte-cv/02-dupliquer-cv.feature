@carte-cv @dupliquer @prioritaire
Feature: Dupliquer un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir dupliquer mon CV
  Afin de créer des variantes pour différentes candidatures

  Background:
    Given je suis connecté à mon compte
    And je suis sur la page "Mes CVS"

  @CARTE-002
  Scenario: Dupliquer un CV avec succès
    Given un CV existe dans ma liste
    When je duplique ce CV
    Then une copie du CV est créée
    And la copie apparaît dans ma liste de CV
