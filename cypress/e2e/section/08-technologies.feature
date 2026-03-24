# language: fr
@section @technologies
Fonctionnalité: Gérer mes technologies
  En tant qu'utilisateur de ReDsume
  Je veux pouvoir ajouter et supprimer mes technologies par catégorie
  Afin de valoriser mon expertise technique sur mon CV

  Contexte:
    Étant donné que je suis connecté à mon compte
    Et je suis sur la section "Technologies" d'un CV existant

  @TECH-001
  Scénario: Ajouter une technologie dans une catégorie
    Quand j'ajoute la technologie "Angular" avec "3 ANS" d'expérience dans la catégorie "Développement"
    Alors la technologie "Angular" apparaît dans la catégorie "Développement"

  @TECH-002
  Scénario: Ajouter des technologies dans différentes catégories
    Quand j'ajoute la technologie "Python" avec "2 ANS" d'expérience dans la catégorie "Data"
    Et j'ajoute la technologie "TensorFlow" avec "> 5 ANS" d'expérience dans la catégorie "Machine learning"
    Alors la technologie "Python" apparaît dans la catégorie "Data"
    Et la technologie "TensorFlow" apparaît dans la catégorie "Machine learning"

  @TECH-003
  Scénario: Supprimer une technologie
    Étant donné que la technologie "Angular" existe dans la catégorie "Développement"
    Quand je supprime la technologie "Angular" de la catégorie "Développement"
    Alors la technologie "Angular" n'apparaît plus dans la catégorie "Développement"

  @TECH-004
  Scénario: La technologie est conservée après navigation
    Étant donné que la technologie "Angular" existe dans la catégorie "Développement"
    Quand je quitte la section "Technologies"
    Et je reviens sur la section "Technologies"
    Alors la technologie "Angular" apparaît dans la catégorie "Développement"