@section @competences
Feature: Gérer mes compétences
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir ajouter, modifier et supprimer mes compétences
  Afin de valoriser mon expertise technique

  Background:
    Given je suis connecté à mon compte
    And je suis sur la section "Compétences" d'un CV existant

  @COMP-001
  Scenario: Ajouter une compétence avec son expérience
    When j'ajoute la compétence "Angular" avec "3 ANS" d'expérience
    Then la compétence "Angular" apparaît dans ma liste

  @COMP-002
  Scenario: Modifier une compétence existante
    Given une compétence "Angular" existe dans ma liste
    When je modifie la compétence "Angular" en "React" avec "> 5 ANS" d'expérience
    Then la compétence "React" apparaît dans ma liste

  @COMP-003
  Scenario: Supprimer une compétence
    Given une compétence "Angular" existe dans ma liste
    When je supprime la compétence "Angular"
    Then la compétence "Angular" n'apparaît plus dans ma liste

  @COMP-004
  Scenario: Masquer une compétence du CV
    Given une compétence "Angular" existe et est visible sur le CV
    When je masque la compétence "Angular" du CV
    Then la compétence "Angular" est masquée sur le CV

  @COMP-005
  Scenario: Rendre visible une compétence masquée
    Given une compétence "Angular" existe et est masquée sur le CV
    When je rends visible la compétence "Angular" sur le CV
    Then la compétence "Angular" est visible sur le CV

  @COMP-006
  Scenario: La compétence est conservée après navigation
    Given une compétence "Angular" existe dans ma liste
    When je quitte la section "Compétences"
    And je reviens sur la section "Compétences"
    Then la compétence "Angular" apparaît dans ma liste
