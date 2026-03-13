@section @description
Feature: Gérer le résumé de profil de mon CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir rédiger un résumé de mon profil professionnel
  Afin de présenter synthétiquement mon parcours sur mon CV

  Background:
  Given je suis connecté à mon compte
   And je suis sur la section "Description" d'un CV existant

  # Saisie du résumé

  @DESC-001
  Scenario: Renseigner mon résumé de profil
    When je renseigne mon résumé de profil
    Then mon résumé de profil est enregistré

  # Suppression du contenu

  @DESC-002
  Scenario: Effacer mon résumé de profil
    When je renseigne mon résumé de profil
    And j'efface mon résumé de profil
    Then mon résumé de profil est vide

  # Contrôle de la limite de caractères

@DESC-003
Scenario: La limite de 1000 caractères est respectée
  When je renseigne une description dépassant 1000 caractères
  Then la limite de 1000 caractères est respectée

  # Vérification de la persistance

  @DESC-004
  Scenario: Le résumé de profil est conservé après navigation
    When je renseigne mon résumé de profil
    And je quitte la section "Description"
    And je reviens sur la section "Description"
    Then mon résumé de profil est enregistré
