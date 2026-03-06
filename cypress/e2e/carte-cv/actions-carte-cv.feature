@carte-cv @prioritaire
Feature: Gestion de la carte CV
  en tant qu'utilisateur de ReDsume
  Je veux pouvoir gérer mon CV
  Afin de maintenir mes informations professionnelles à jour

  Background:
    Given Je suis sur la page de connexion
    When Je me connecte avec un compte valide
    Then Je suis authentifié avec succès
    And je suis sur la page "Mes CVS"

  # ═══════════════════════════════════════════════════════════════════════════
  # RENOMMER
  # ═══════════════════════════════════════════════════════════════════════════

  @CV-001 @renommer
  Scenario: Renommer un CV
    When je renomme un CV avec le statut "En cours" en "Mon CV Professionnel"
    Then le CV est renommé en "Mon CV Professionnel"

  # ═══════════════════════════════════════════════════════════════════════════
  # DUPLIQUER
  # ═══════════════════════════════════════════════════════════════════════════

  @CV-002 @dupliquer
  Scenario: Dupliquer un CV
    When je duplique un CV avec le statut "Complété"
    Then une copie du CV est créée
    And la copie apparaît dans ma liste de CV

  # ═══════════════════════════════════════════════════════════════════════════
  # VIDER
  # ═══════════════════════════════════════════════════════════════════════════

  @CV-003 @vider
  Scenario: Vider le contenu d'un CV
    When je vide un CV avec le statut "En cours"
    Then toutes les informations sont supprimées

  @CV-004 @vider
  Scenario: Annuler le vidage d'un CV
    When je demande à vider un CV avec le statut "Complété"
    And j'annule l'opération
    Then le contenu du CV reste intact

  # ═══════════════════════════════════════════════════════════════════════════
  # CHANGER PROPRIÉTAIRE
  # ═══════════════════════════════════════════════════════════════════════════

  @CV-005 @proprietaire
  Scenario: Transférer la propriété d'un CV
    When je transfère un CV avec le statut "En cours" à "nouveau.proprietaire@redsen.com"
    Then le propriétaire du CV devient "nouveau.proprietaire@redsen.com"

  # ═══════════════════════════════════════════════════════════════════════════
  # SUPPRIMER
  # ═══════════════════════════════════════════════════════════════════════════

  @CV-006 @supprimer
  Scenario: Supprimer définitivement un CV
    When je supprime un CV avec le statut "Non démarré"
    Then le CV est supprimé définitivement
    And il n'apparaît plus dans ma liste

  @CV-007 @supprimer
  Scenario: Annuler la suppression d'un CV
    When je demande à supprimer un CV avec le statut "En cours"
    And j'annule la suppression
    Then le CV reste dans ma liste

  # ═══════════════════════════════════════════════════════════════════════════
  # ENREGISTRER
  # ═══════════════════════════════════════════════════════════════════════════

  @CV-008 @enregistrer
  Scenario: Sauvegarder les modifications d'un CV
    When j'enregistre les modifications d'un CV avec le statut "En cours"
    Then les modifications sont sauvegardées

  # ═══════════════════════════════════════════════════════════════════════════
  # CHANGER STATUT
  # ═══════════════════════════════════════════════════════════════════════════

  @CV-009 @changer-statut
  Scenario: Changer le statut d'un CV
    When je change le statut d'un CV "Non démarré" en "En cours"
    Then le statut du CV devient "En cours"
