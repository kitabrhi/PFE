# language: fr

@section @experiences
Fonctionnalité: Gérer mes expériences professionnelles
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir ajouter, modifier et supprimer mes expériences
  Afin de présenter mon parcours professionnel

  Contexte:
    Soit je suis connecté à mon compte
    Et je suis sur la section "Expériences" d'un CV existant

  @EXP-001
  Scénario: Ajouter une expérience professionnelle
    Quand j'ajoute l'expérience "Développeur Angular" chez "REDSEN" à "Genève" du "01/2024" au "06/2024"
    Alors l'expérience "Développeur Angular" apparaît dans ma liste

  @EXP-002
  Scénario: Modifier une expérience existante
    Soit une expérience "Développeur Angular" existe dans ma liste
    Quand je modifie cette expérience en "Lead Developer" chez "Anthropic" à "Paris"
    Alors l'expérience "Lead Developer" apparaît dans ma liste
    Et l'expérience "Lead Developer" a pour société "Anthropic" et lieu "Paris"

  @EXP-003
  Scénario: Supprimer une expérience
    Soit une expérience "Développeur Angular" existe dans ma liste
    Quand je supprime cette expérience
    Alors l'expérience "Développeur Angular" n'apparaît plus dans ma liste

  @EXP-004
  Scénario: Masquer une expérience du CV
    Soit une expérience "Développeur Angular" existe et est visible sur le CV
    Quand je masque cette expérience du CV
    Alors l'expérience "Développeur Angular" est masquée sur le CV

  @EXP-005
  Scénario: Rendre visible une expérience masquée
    Soit une expérience "Développeur Angular" existe et est masquée sur le CV
    Quand je rends visible cette expérience sur le CV
    Alors l'expérience "Développeur Angular" est visible sur le CV

  @EXP-006
  Scénario: Changer le tri d'une expérience
    Soit une expérience "Développeur Angular" existe dans ma liste
    Et une expérience "Lead Developer" existe dans ma liste
    Quand je change le tri de l'expérience "Développeur Angular" à la position "2"
    Alors l'expérience "Développeur Angular" est en position "2" dans la liste

  @EXP-007
  Scénario: L'expérience est conservée après navigation
    Soit une expérience "Développeur Angular" existe dans ma liste
    Quand je quitte la section "Expériences"
    Et je reviens sur la section "Expériences"
    Alors l'expérience "Développeur Angular" apparaît dans ma liste
