@section @langues
Feature: Gérer mes langues
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir ajouter, modifier et supprimer mes langues
  Afin de valoriser mes compétences linguistiques

  Background:
    Given je suis connecté à mon compte
    And je suis sur la section "Langues" d'un CV existant

  @LANG-001
  Scenario: Ajouter une langue avec son niveau
    When j'ajoute la langue "Français" avec le niveau "Langue maternelle"
    Then la langue "Français" apparaît dans ma liste

  @LANG-002
  Scenario: Modifier une langue existante
    Given une langue "Anglais" existe dans ma liste
    When je modifie cette langue en "Espagnol" avec le niveau "B2"
    Then la langue "Espagnol" apparaît dans ma liste

  @LANG-003
  Scenario: Supprimer une langue
    Given une langue "Anglais" existe dans ma liste
    When je supprime cette langue
    Then la langue "Anglais" n'apparaît plus dans ma liste

  @LANG-004
  Scenario: Masquer une langue du CV
    Given une langue "Français" existe et est visible sur le CV
    When je masque cette langue du CV
    Then la langue "Français" est masquée sur le CV

  @LANG-005
  Scenario: Rendre visible une langue masquée
    Given une langue "Français" existe et est masquée sur le CV
    When je rends visible cette langue sur le CV
    Then la langue "Français" est visible sur le CV

  @LANG-006
  Scenario: La langue est conservée après navigation
    Given une langue "Français" existe dans ma liste
    When je quitte la section "Langues"
    And je reviens sur la section "Langues"
    Then la langue "Français" apparaît dans ma liste
