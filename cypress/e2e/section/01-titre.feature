@section @titres
Feature: Gérer les titres de mon CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir gérer les titres de mon CV
  Afin de présenter mes différents intitulés professionnels

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"
    And je sélectionne un CV existant
    And je suis sur la section "Titres"

  # ═══════════════════════════════════════════════════════════════
  # AJOUTER UN TITRE
  # ═══════════════════════════════════════════════════════════════

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

  # ═══════════════════════════════════════════════════════════════
  # MODIFIER UN TITRE
  # ═══════════════════════════════════════════════════════════════

  @SECTION-TITRE-003
  Scenario: Modifier un titre existant
    Given un titre "Ancien titre" existe dans ma liste
    When je modifie le titre "Ancien titre" en "Nouveau titre"
    Then le titre "Nouveau titre" apparaît dans ma liste de titres
    And le titre "Ancien titre" n'apparaît plus dans ma liste de titres

  # ═══════════════════════════════════════════════════════════════
  # SUPPRIMER UN TITRE
  # ═══════════════════════════════════════════════════════════════

  @SECTION-TITRE-004
  Scenario: Supprimer un titre de mon CV
    Given un titre "Titre à supprimer" existe dans ma liste
    When je supprime le titre "Titre à supprimer"
    Then le titre "Titre à supprimer" n'apparaît plus dans ma liste de titres

  # ═══════════════════════════════════════════════════════════════
  # AFFICHER / MASQUER UN TITRE SUR LE CV
  # ═══════════════════════════════════════════════════════════════

  @SECTION-TITRE-005
  Scenario: Masquer un titre sur le CV généré
    Given un titre "Consultant Senior" existe et est visible sur le CV
    When je masque le titre "Consultant Senior" du CV
    Then le titre "Consultant Senior" est masqué sur le CV

  @SECTION-TITRE-006
  Scenario: Rendre visible un titre masqué sur le CV
    Given un titre "Consultant Senior" existe et est masqué sur le CV
    When je rends visible le titre "Consultant Senior" sur le CV
    Then le titre "Consultant Senior" est visible sur le CV

  # ═══════════════════════════════════════════════════════════════
  # RÉORDONNER LES TITRES
  # ═══════════════════════════════════════════════════════════════
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

  # ═══════════════════════════════════════════════════════════════
  # PERSISTANCE DES DONNÉES
  # ═══════════════════════════════════════════════════════════════

  @SECTION-TITRE-008
  Scenario: Les modifications sont sauvegardées automatiquement
    When j'ajoute le titre "Titre auto-sauvé"
    And je quitte la section "Titres"
    And je reviens sur la section "Titres"
    Then le titre "Titre auto-sauvé" apparaît dans ma liste de titres

  @SECTION-TITRE-009
  Scenario: La suppression est sauvegardée automatiquement
    Given un titre "Titre à supprimer" existe dans ma liste
    When je supprime le titre "Titre à supprimer"
    And je quitte la section "Titres"
    And je reviens sur la section "Titres"
    Then le titre "Titre à supprimer" n'apparaît plus dans ma liste de titres
