@section @informations
Feature: Gérer les informations personnelles de mon CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir gérer mes informations personnelles
  Afin que mon CV reflète mon identité et mon profil professionnel

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"
    And je sélectionne un CV existant
    And je suis sur la section "Informations"

  # ═══════════════════════════════════════════════════════════════
  # PHOTO DE PROFIL
  # ═══════════════════════════════════════════════════════════════

  @INFO-001
  Scenario: Ajouter une photo de profil à mon CV
    When j'ajoute une photo de profil
    Then ma photo de profil est visible sur mon CV

  # ═══════════════════════════════════════════════════════════════
  # EMAIL (NON ÉDITABLE)
  # ═══════════════════════════════════════════════════════════════

  @INFO-002
  Scenario: Vérifier que mon email ne peut pas être modifié
    Then mon email est affiché sur ma page de profil
    And je ne peux pas modifier mon email

  # ═══════════════════════════════════════════════════════════════
  # PRÉNOM ET NOM
  # ═══════════════════════════════════════════════════════════════

  @INFO-003
  Scenario: Modifier mon prénom
    When je mets à jour mon prénom
    Then mon nouveau prénom est affiché sur mon profil

  @INFO-004
  Scenario: Modifier mon nom de famille
    When je mets à jour mon nom de famille
    Then mon nouveau nom de famille est affiché sur mon profil

  # ═══════════════════════════════════════════════════════════════
  # DATES
  # ═══════════════════════════════════════════════════════════════

  @INFO-005
  Scenario: Renseigner ma date de naissance
    When je renseigne ma date de naissance
    Then ma date de naissance est enregistrée sur mon profil

  @INFO-006
  Scenario: Renseigner mon début d'activité professionnelle
    When je renseigne mon début d'activité professionnelle
    Then mon début d'activité professionnelle est enregistré sur mon profil

  # ═══════════════════════════════════════════════════════════════
  # PERSISTANCE
  # ═══════════════════════════════════════════════════════════════

  @INFO-007
  Scenario: Les modifications sont conservées après avoir navigué vers une autre section
    When je mets à jour mon prénom
    And je quitte la section "Informations"
    And je reviens sur la section "Informations"
    Then mon nouveau prénom est affiché sur mon profil