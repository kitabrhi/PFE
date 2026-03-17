@section @titres
Feature: Gérer les titres de mon CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir gérer les titres de mon CV
  Afin de présenter mes différents intitulés professionnels

  Background:
    Given je suis connecté à mon compte
    And je suis sur la section "Titres" d'un CV existant

  @SECTION-TITRE-001
  Scenario: Ajouter un titre à mon CV
    When j'ajoute le titre "Consultant Senior"
    Then le titre "Consultant Senior" apparaît dans ma liste de titres
    And une nouvelle ligne vide est disponible

  @SECTION-TITRE-002
  Scenario: Ajouter plusieurs titres à mon CV
    When j'ajoute le titre "Chef de projet"
    And j'ajoute le titre "Consultant IT"
    Then le titre "Chef de projet" apparaît dans ma liste de titres
    And le titre "Consultant IT" apparaît dans ma liste de titres

  @SECTION-TITRE-003
  Scenario: Modifier un titre existant
    Given un titre "Ancien titre" existe dans ma liste
    When je modifie ce titre en "Nouveau titre"
    Then le titre "Nouveau titre" apparaît dans ma liste de titres
    And le titre "Ancien titre" n'apparaît plus dans ma liste de titres

  @SECTION-TITRE-004
  Scenario: Supprimer un titre de mon CV
    Given un titre "Titre à supprimer" existe dans ma liste
    When je supprime ce titre
    Then le titre "Titre à supprimer" n'apparaît plus dans ma liste de titres

  @SECTION-TITRE-005
  Scenario: Masquer un titre sur le CV généré
    Given un titre "Consultant Senior" existe et est visible sur le CV
    When je masque ce titre du CV
    Then le titre "Consultant Senior" est masqué sur le CV

  @SECTION-TITRE-006
  Scenario: Rendre visible un titre masqué sur le CV
    Given un titre "Consultant Senior" existe et est masqué sur le CV
    When je rends visible ce titre sur le CV
    Then le titre "Consultant Senior" est visible sur le CV

  @SECTION-TITRE-007
  Scenario: Changer l'ordre d'un titre
    Given les titres suivants existent dans l'ordre :
      | ordre | titre            |
      | 1     | Chef de projet   |
      | 2     | Consultant IT    |
    When je place le titre "Consultant IT" en position 1
    And je place le titre "Chef de projet" en position 2
    Then le titre "Consultant IT" est en position 1
    And le titre "Chef de projet" est en position 2

  @SECTION-TITRE-008
  Scenario: Les modifications sont sauvegardées automatiquement
    When j'ajoute le titre "Titre auto-sauvé"
    And je quitte la section "Titres"
    And je reviens sur la section "Titres"
    Then le titre "Titre auto-sauvé" apparaît dans ma liste de titres

  @SECTION-TITRE-009
  Scenario: La suppression est sauvegardée automatiquement
    Given un titre "Titre à supprimer" existe dans ma liste
    When je supprime ce titre
    And je quitte la section "Titres"
    And je reviens sur la section "Titres"
    Then le titre "Titre à supprimer" n'apparaît plus dans ma liste de titres
