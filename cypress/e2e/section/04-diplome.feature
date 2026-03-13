@section @diplomes
Feature: Gérer mes diplômes, certifications et formations
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir ajouter, modifier et supprimer mes diplômes
  Afin de tenir mon CV à jour

 Background:
  Given je suis connecté à mon compte
  And je suis sur la section "Diplômes" d'un CV existant

  @DIP-001
  Scenario: Ajouter un diplôme
    When j'ajoute un diplôme "Master Informatique" à "Université Hassan II" en "2024"
    Then le diplôme "Master Informatique" apparaît dans ma liste

  @DIP-002
  Scenario: Modifier un diplôme existant
    Given un diplôme "Master Informatique" existe dans ma liste
    When je modifie le diplôme "Master Informatique" en "Master Génie Logiciel" à "ENSIAS Rabat" en "2025"
    Then le diplôme "Master Génie Logiciel" apparaît dans ma liste

  @DIP-003
  Scenario: Supprimer un diplôme
    Given un diplôme "Master Informatique" existe dans ma liste
    When je supprime le diplôme "Master Informatique"
    Then le diplôme "Master Informatique" n'apparaît plus dans ma liste

  @DIP-004
  Scenario: Masquer un diplôme du CV
    Given un diplôme "Master Informatique" existe et est visible sur le CV
    When je masque le diplôme "Master Informatique" du CV
    Then le diplôme "Master Informatique" est masqué sur le CV

  @DIP-005
  Scenario: Rendre visible un diplôme masqué
    Given un diplôme "Master Informatique" existe et est masqué sur le CV
    When je rends visible le diplôme "Master Informatique" sur le CV
    Then le diplôme "Master Informatique" est visible sur le CV

 @DIP-006
  Scenario: Le diplôme est conservé après navigation
    Given un diplôme "Master Informatique" existe dans ma liste
    When je quitte la section "Diplômes"
    And je reviens sur la section "Diplômes"
    Then le diplôme "Master Informatique" apparaît dans ma liste
