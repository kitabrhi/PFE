@carte-cv @proprietaire
Feature: Transférer la propriété d'un CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir transférer mon CV à un collègue
  Afin de déléguer sa gestion

  Background:
    Given je suis connecté à mon compte
    And je suis sur la page "Mes CVS"
    And j'ai au moins 2 CVs sur la page

  @CARTE-005
  Scenario: Transférer un CV à un collègue existant
    Given un CV existe dans ma liste
    When je transfère ce CV à un collègue
    Then le transfert est enregistré avec succès

  @CARTE-005-bis
  Scenario: Transférer un CV à un email inexistant
    Given un CV existe dans ma liste
    When je tente de transférer ce CV à un email inexistant
    Then un message indique que le propriétaire est introuvable