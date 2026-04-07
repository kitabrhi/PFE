# language: fr
# Feature créée par l’extension Claude Chrome

@section @missions
Fonctionnalité: Gérer mes missions professionnelles
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir ajouter, modifier, copier et supprimer mes missions
  Afin de détailler mon parcours professionnel mission par mission
  Contexte:
    Soit je suis connecté à mon compte
    Et je suis sur la section "Missions" d'un CV existant
  @MIS-001
  Scénario: Ajouter une mission professionnelle
    Quand j'ajoute la mission "Consultant Senior" chez "Redsen Consulting" à "Lausanne, Suisse" du "01/2024" au "06/2024"
    Alors la mission "Consultant Senior" apparaît dans ma liste
  @MIS-002
  Scénario: Ajouter une mission avec contexte et tâches
    Quand j'ajoute la mission "Architecte Cloud" chez "Redsen Consulting" à "Genève, Suisse" du "07/2024" au "12/2024" avec le contexte "Migration infrastructure vers Azure" et les tâches "Analyse des besoins, conception de l'architecture"
    Alors la mission "Architecte Cloud" apparaît dans ma liste
  @MIS-003
  Scénario: Ajouter une mission sans date de fin (mission en cours)
    Quand j'ajoute la mission "Lead Developer" chez "Anthropic" à "Paris, France" à partir du "01/2025"
    Alors la mission "Lead Developer" apparaît dans ma liste
  @MIS-004
  Scénario: Modifier une mission existante
    Soit une mission "Consultant Senior" existe dans ma liste
    Quand je modifie cette mission en "Lead Consultant" chez "Anthropic" à "Paris, France"
    Alors la mission "Lead Consultant" apparaît dans ma liste
    Et la mission "Lead Consultant" a pour société "Anthropic" et lieu "Paris, France"
  @MIS-005
  Scénario: Supprimer une mission
    Soit une mission "Consultant Senior" existe dans ma liste
    Quand je supprime cette mission
    Alors la mission "Consultant Senior" n'apparaît plus dans ma liste
  @MIS-006
  Scénario: Copier une mission existante
    Soit une mission "Consultant Senior" existe dans ma liste
    Quand je copie cette mission
    Alors une nouvelle mission "Consultant Senior" apparaît dans ma liste
    Et la mission copiée contient les mêmes informations que la mission d'origine
  @MIS-007
  Scénario: Marquer une mission comme confidentielle
    Soit une mission "Consultant Senior" existe dans ma liste et n'est pas confidentielle
    Quand je marque cette mission comme confidentielle
    Alors la mission "Consultant Senior" est marquée comme confidentielle
  @MIS-008
  Scénario: Retirer le caractère confidentiel d'une mission
    Soit une mission "Consultant Senior" existe dans ma liste et est confidentielle
    Quand je retire le caractère confidentiel de cette mission
    Alors la mission "Consultant Senior" n'est plus marquée comme confidentielle
  @MIS-009
  Scénario: Inclure une mission dans le CV
    Soit une mission "Consultant Senior" existe et est exclue du CV
    Quand j'inclus cette mission dans le CV
    Alors la mission "Consultant Senior" est incluse dans le CV
  @MIS-010
  Scénario: Exclure une mission du CV
    Soit une mission "Consultant Senior" existe et est incluse dans le CV
    Quand j'exclus cette mission du CV
    Alors la mission "Consultant Senior" est exclue du CV
  @MIS-011
  Scénario: Associer une mission à une expérience professionnelle
    Soit une mission "Consultant Senior" existe dans ma liste
    Et une expérience "Redsen Consulting" existe dans mon parcours
    Quand j'associe la mission "Consultant Senior" à l'expérience "Redsen Consulting"
    Alors la mission "Consultant Senior" est liée à l'expérience "Redsen Consulting"
  @MIS-012
  Scénario: Renseigner le contexte d'une mission
    Soit une mission "Consultant Senior" existe dans ma liste
    Quand je renseigne le contexte "Migration d'une infrastructure on-premise vers Azure pour un client bancaire"
    Alors le contexte de la mission "Consultant Senior" est enregistré
  @MIS-013
  Scénario: Renseigner les tâches d'une mission
    Soit une mission "Consultant Senior" existe dans ma liste
    Quand je renseigne les tâches "Analyse des besoins, rédaction des spécifications techniques, coordination des équipes"
    Alors les tâches de la mission "Consultant Senior" sont enregistrées
  @MIS-014
  Scénario: Renseigner les actions d'une mission
    Soit une mission "Consultant Senior" existe dans ma liste
    Quand je renseigne les actions "Mise en place des pipelines CI/CD, formation des équipes, déploiement en production"
    Alors les actions de la mission "Consultant Senior" sont enregistrées
  @MIS-015
  Scénario: Renseigner les résultats d'une mission
    Soit une mission "Consultant Senior" existe dans ma liste
    Quand je renseigne les résultats "Réduction des coûts d'infrastructure de 30%, délai de livraison réduit de 2 semaines"
    Alors les résultats de la mission "Consultant Senior" sont enregistrés
  @MIS-016
  Scénario: Renseigner les technologies d'une mission
    Soit une mission "Consultant Senior" existe dans ma liste
    Quand je renseigne les technologies "Azure, Terraform, Docker, Kubernetes"
    Alors les technologies de la mission "Consultant Senior" sont enregistrées
  @MIS-017
  Scénario: La mission est conservée après navigation
    Soit une mission "Consultant Senior" existe dans ma liste
    Quand je quitte la section "Missions"
    Et je reviens sur la section "Missions"
    Alors la mission "Consultant Senior" apparaît dans ma liste
  @MIS-018
  Scénario: Enregistrer plusieurs missions pour un même CV
    Soit une mission "Consultant Senior" existe dans ma liste
    Quand j'ajoute la mission "Architecte Solution" chez "Redsen Consulting" à "Lausanne, Suisse" du "07/2024" au "12/2024"
    Alors la mission "Consultant Senior" apparaît dans ma liste
    Et la mission "Architecte Solution" apparaît dans ma liste