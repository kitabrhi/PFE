@section @description
Feature: Gérer le résumé de profil de mon CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir rédiger un résumé de mon profil professionnel
  Afin de présenter synthétiquement mon parcours sur mon CV

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"
    And je sélectionne un CV existant
    And je suis sur la section "Description"

  # ═══════════════════════════════════════════════════════════════
  # SAISIR UNE DESCRIPTION
  # ═══════════════════════════════════════════════════════════════

  @DESC-001
  Scenario: Renseigner mon résumé de profil
    When je renseigne mon résumé de profil
    Then mon résumé de profil est enregistré

  # ═══════════════════════════════════════════════════════════════
  # EFFACER LA DESCRIPTION
  # ═══════════════════════════════════════════════════════════════

  @DESC-002
  Scenario: Effacer mon résumé de profil
    When je renseigne mon résumé de profil
    And j'efface mon résumé de profil
    Then mon résumé de profil est vide

  # ═══════════════════════════════════════════════════════════════
  # LIMITE DE CARACTÈRES
  # ═══════════════════════════════════════════════════════════════

@DESC-003
Scenario: La limite de 1000 caractères est respectée
  When je renseigne une description dépassant 1000 caractères
  Then la limite de 1000 caractères est respectée

  # ═══════════════════════════════════════════════════════════════
  # PERSISTANCE
  # ═══════════════════════════════════════════════════════════════

  @DESC-004
  Scenario: Le résumé de profil est conservé après navigation
    When je renseigne mon résumé de profil
    And je quitte la section "Description"
    And je reviens sur la section "Description"
    Then mon résumé de profil est enregistré