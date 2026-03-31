@section @points-forts
Feature: Gérer mes points forts
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir ajouter, modifier et supprimer mes points forts
  Afin de mettre en avant mes atouts professionnels

  Background:
    Given je suis connecté à mon compte
    And je suis sur la section "Points forts" d'un CV existant

  @PF-001
  Scenario: Ajouter un point fort
    When j'ajoute le point fort "Cadrage stratégique"
    Then le point fort "Cadrage stratégique" apparaît dans ma liste

  @PF-002
  Scenario: Modifier un point fort
    Given un point fort "Cadrage stratégique" existe dans ma liste
    When je modifie ce point fort en "Gestion de projet Agile"
    Then le point fort "Gestion de projet Agile" apparaît dans ma liste

  @PF-003
  Scenario: Supprimer un point fort
    Given un point fort "Cadrage stratégique" existe dans ma liste
    When je supprime ce point fort
    Then le point fort "Cadrage stratégique" n'apparaît plus dans ma liste

  @PF-004
  Scenario: Masquer un point fort du CV
    Given un point fort "Cadrage stratégique" existe et est visible sur le CV
    When je masque ce point fort du CV
    Then le point fort "Cadrage stratégique" est masqué sur le CV

  @PF-005
  Scenario: Rendre visible un point fort masqué
    Given un point fort "Cadrage stratégique" existe et est masqué sur le CV
    When je rends visible ce point fort sur le CV
    Then le point fort "Cadrage stratégique" est visible sur le CV

  @PF-006
  Scenario: Le point fort est conservé après navigation
    Given un point fort "Cadrage stratégique" existe dans ma liste
    When je quitte la section "Points forts"
    And je reviens sur la section "Points forts"
    Then le point fort "Cadrage stratégique" apparaît dans ma liste