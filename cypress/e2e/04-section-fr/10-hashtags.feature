# language: fr

@section @hashtags
Fonctionnalité: Gérer mes hashtags
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir ajouter, modifier et supprimer mes hashtags
  Afin de mettre en avant mes fonctions et mots-clés professionnels

  Contexte:
    Soit je suis connecté à mon compte
    Et je suis sur la section "Hashtags" d'un CV existant

  @HASH-001
  Scénario: Ajouter un hashtag
    Quand j'ajoute le hashtag "Chef de projet"
    Alors le hashtag "Chef de projet" apparaît dans ma liste

  @HASH-002
  Scénario: Modifier un hashtag existant
    Soit un hashtag "Chef de projet" existe dans ma liste
    Quand je modifie ce hashtag en "Scrum Master"
    Alors le hashtag "Scrum Master" apparaît dans ma liste

  @HASH-003
  Scénario: Supprimer un hashtag
    Soit un hashtag "Chef de projet" existe dans ma liste
    Quand je supprime ce hashtag
    Alors le hashtag "Chef de projet" n'apparaît plus dans ma liste

  @HASH-004
  Scénario: Masquer un hashtag du CV
    Soit un hashtag "Chef de projet" existe et est visible sur le CV
    Quand je masque ce hashtag du CV
    Alors le hashtag "Chef de projet" est masqué sur le CV

  @HASH-005
  Scénario: Rendre visible un hashtag masqué
    Soit un hashtag "Chef de projet" existe et est masqué sur le CV
    Quand je rends visible ce hashtag sur le CV
    Alors le hashtag "Chef de projet" est visible sur le CV

  @HASH-006
  Scénario: Changer le tri d'un hashtag
    Soit un hashtag "Chef de projet" existe dans ma liste
    Et un hashtag "Scrum Master" existe dans ma liste
    Quand je change le tri du hashtag "Chef de projet" à la position "2"
    Alors le hashtag "Chef de projet" est en position "2" dans la liste

  @HASH-007
  Scénario: Le hashtag est conservé après navigation
    Soit un hashtag "Chef de projet" existe dans ma liste
    Quand je quitte la section "Hashtags"
    Et je reviens sur la section "Hashtags"
    Alors le hashtag "Chef de projet" apparaît dans ma liste
