# language: fr

@admin
Fonctionnalité: Fonctions d'administration
  En tant qu'administrateur de ReDsume
  Je veux pouvoir inviter des candidats et rechercher des CV
  Afin de gérer les profils des consultants

  Contexte:
    Soit je suis connecté à mon compte

  # ─── Invitation Candidat ───────────────────────────────────────

  @ADM-001
  Scénario: Envoyer une invitation à un candidat
    Soit je suis sur la page "Invitation Candidat"
    Quand j'envoie une invitation à "ykitabrhi@redsen.ch"
    Alors l'invitation est envoyée avec succès

  @ADM-002
  Scénario: Tenter d'envoyer une invitation avec un email invalide
    Soit je suis sur la page "Invitation Candidat"
    Quand je saisis l'email invalide "email-invalide"
    Alors le formulaire d'invitation est invalide

  @ADM-003
  Scénario: Tenter d'envoyer une invitation sans email
    Soit je suis sur la page "Invitation Candidat"
    Quand je clique sur "Envoyer" sans saisir d'email
    Alors le formulaire d'invitation est invalide

  # ─── Recherche CV ──────────────────────────────────────────────

  @ADM-004
  Scénario: Rechercher un CV par nom
    Soit je suis sur la page "Recherche CV"
    Quand je recherche "youssef"
    Alors des résultats de recherche s'affichent
    Et les résultats contiennent "Youssef"

#   @ADM-005
#   Scénario: Rechercher un CV par email
#     Soit je suis sur la page "Recherche CV"
#     Quand je recherche "ykitabrhi@redsen.ch"
#     Alors des résultats de recherche s'affichent

  @ADM-006
  Scénario: Rechercher un CV inexistant
    Soit je suis sur la page "Recherche CV"
    Quand je recherche "utilisateur-inexistant-xyz-999"
    Alors aucun résultat n'est affiché

  @ADM-007
  Scénario: Vérifier le statut d'un CV dans les résultats
    Soit je suis sur la page "Recherche CV"
    Quand je recherche "youssef"
    Alors des résultats de recherche s'affichent
    Et un CV de "Youssef" a le statut "EN COURS"

  @ADM-008
  Scénario: Ouvrir un CV depuis les résultats de recherche
    Soit je suis sur la page "Recherche CV"
    Quand je recherche "youssef"
    Et je clique sur modifier le CV de "Youssef"
    Alors je suis redirigé vers l'édition du CV
