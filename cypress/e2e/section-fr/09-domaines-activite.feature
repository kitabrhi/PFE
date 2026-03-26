# language: fr

@section @domaines-activite
Fonctionnalité: Gérer mes domaines d'activité
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir ajouter, modifier et supprimer mes domaines d'activité
  Afin de mettre en valeur mon expertise sectorielle

  Contexte:
    Soit je suis connecté à mon compte
    Et je suis sur la section "Domaines d'activité" d'un CV existant

  @DA-001
  Scénario: Ajouter un domaine d'activité avec son expérience
    Quand j'ajoute le domaine d'activité "Santé" avec "3 ANS" d'expérience
    Alors le domaine d'activité "Santé" apparaît dans ma liste

  @DA-002
  Scénario: Modifier un domaine d'activité existant
    Soit un domaine d'activité "Santé" existe dans ma liste
    Quand je modifie ce domaine d'activité en "Finance" avec "> 5 ANS" d'expérience
    Alors le domaine d'activité "Finance" apparaît dans ma liste

  @DA-003
  Scénario: Supprimer un domaine d'activité
    Soit un domaine d'activité "Santé" existe dans ma liste
    Quand je supprime ce domaine d'activité
    Alors le domaine d'activité "Santé" n'apparaît plus dans ma liste

  @DA-004
  Scénario: Masquer un domaine d'activité du CV
    Soit un domaine d'activité "Santé" existe et est visible sur le CV
    Quand je masque ce domaine d'activité du CV
    Alors le domaine d'activité "Santé" est masqué sur le CV

  @DA-005
  Scénario: Rendre visible un domaine d'activité masqué
    Soit un domaine d'activité "Santé" existe et est masqué sur le CV
    Quand je rends visible ce domaine d'activité sur le CV
    Alors le domaine d'activité "Santé" est visible sur le CV

  @DA-006
  Scénario: Changer le tri d'un domaine d'activité
    Soit un domaine d'activité "Santé" existe dans ma liste
    Et un domaine d'activité "Finance" existe dans ma liste
    Quand je change le tri du domaine d'activité "Santé" à la position "2"
    Alors le domaine d'activité "Santé" est en position "2" dans la liste

  @DA-007
  Scénario: Le domaine d'activité est conservé après navigation
    Soit un domaine d'activité "Santé" existe dans ma liste
    Quand je quitte la section "Domaines d'activité"
    Et je reviens sur la section "Domaines d'activité"
    Alors le domaine d'activité "Santé" apparaît dans ma liste
