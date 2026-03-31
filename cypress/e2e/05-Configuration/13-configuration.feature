# language: fr

@section @configuration
Fonctionnalité: Gérer la configuration et générer mon CV
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir exporter/importer mon profil, changer le thème et générer mon CV
  Afin de personnaliser mon expérience et obtenir mon CV final

  Contexte:
    Soit je suis connecté à mon compte
    Et je suis sur un CV existant

  @CONF-001
  Scénario: Télécharger le profil en JSON
    Quand je clique sur "Download profil" dans la configuration
    Alors un fichier JSON est téléchargé

  @CONF-002
  Scénario: Uploader un profil depuis un fichier JSON
    Quand j'uploade le fichier "cypress/fixtures/profil-test.json" dans la configuration
    Alors le profil est importé avec succès

  @CONF-003
  Scénario: Activer le mode sombre
    Soit le mode sombre est désactivé
    Quand j'active le mode sombre
    Alors l'application est en mode sombre

  @CONF-004
  Scénario: Désactiver le mode sombre
    Soit le mode sombre est activé
    Quand je désactive le mode sombre
    Alors l'application est en mode clair

  @CONF-005
  Scénario: Naviguer vers la page Générer CV
    Quand je clique sur "Générer CV"
    Alors la page de génération du CV s'affiche
    Et l'aperçu du CV est visible

  @CONF-006
  Scénario: Télécharger le CV généré
    Quand je clique sur "Générer CV"
    Et je clique sur "Télécharger le CV"
    Alors le CV est téléchargé

  @CONF-007
  Scénario: Le mode sombre persiste après navigation
    Soit le mode sombre est désactivé
    Quand j'active le mode sombre
    Et je navigue vers la section "Compétences"
    Et je reviens sur la configuration
    Alors l'application est en mode sombre
