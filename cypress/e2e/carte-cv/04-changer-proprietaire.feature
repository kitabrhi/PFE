@carte-cv @proprietaire
Feature: Transférer la propriété d'un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir transférer mon CV à un collègue
  Afin de déléguer sa gestion

  Background:
    Given je suis connecté à mon compte
    And je suis sur la page "Mes CVS"
    And j'ai au moins 2 CVs dans ma liste


  @CARTE-005
  Scenario Outline: Transférer un CV à un collègue existant
    Given un CV a le statut "<statut>"
    When je transfère un CV avec le statut "<statut>" à "ykitabrhi@redsen.ch"
    Then le transfert est enregistré avec succès

    Examples:
      | statut       |
      | En cours     |
      | Non démarré  |
      | Complété     |

  @CARTE-005-bis
  Scenario Outline: Transférer un CV à un email inexistant
    Given un CV a le statut "<statut>"
    When je tente de transférer un CV avec le statut "<statut>" à "inexistant@fake.com"
    Then le message "Propriétaire introuvable. Veuillez vérifier l'email." s'affiche

    Examples:
      | statut       |
      | En cours     |
      | Non démarré  |
      | Complété     |