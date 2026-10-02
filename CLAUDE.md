# KORN — Architecture et règles de développement

Ce fichier définit les règles d'architecture, de développement, de Git, de tests et de CI/CD du projet KORN.

Claude doit lire et respecter ce fichier avant toute modification du projet.

L'objectif est de conserver une architecture cohérente, maintenable, testable et prévisible sur l'ensemble du projet.

---

# 1. Présentation du projet

KORN est une application web développée avec une architecture séparant clairement le frontend et le backend.

Le projet utilise notamment :

* React
* TypeScript
* Vite
* Node.js
* Express
* MySQL
* npm
* Biome
* GitHub
* GitHub Actions

L'application est organisée autour de deux parties principales :

```text
KORN/
├── client/
└── server/
```

Le frontend est responsable de l'interface utilisateur.

Le backend est responsable :

* des routes HTTP ;
* de la logique métier ;
* de l'accès aux données ;
* de l'authentification ;
* des paiements ;
* de la communication avec la base de données ;
* des services externes.

---

# 2. Principe général d'architecture

L'architecture KORN repose sur une séparation claire des responsabilités.

Le principe fondamental est :

```text
Frontend
   ↓
Hooks
   ↓
API HTTP
   ↓
router.ts
   ↓
Actions
   ↓
Repositories
   ↓
MySQL
```

Chaque couche possède une responsabilité précise.

Il ne faut pas mélanger les responsabilités entre les couches.

---

# 3. Architecture MVC adaptée à KORN

KORN suit une architecture inspirée du modèle MVC.

Il ne faut cependant pas chercher à reproduire un MVC traditionnel avec obligatoirement des dossiers `controllers`, `models` et `views`.

L'architecture KORN adapte le MVC à une application React + API REST.

## Correspondance

```text
MVC traditionnel       KORN
------------------------------------------------
View                    React
Controller              router.ts + actions
Model                   repositories + database
```

### View

La View correspond au frontend React.

Elle contient notamment :

* les pages ;
* les composants ;
* les formulaires ;
* les éléments d'interface ;
* les hooks frontend.

La View ne doit pas communiquer directement avec MySQL.

### Controller

Le Controller est réparti entre :

* `router.ts`
* les actions

Le router reçoit les requêtes HTTP et détermine quelle action doit être exécutée.

Les actions exécutent la logique métier nécessaire.

### Model

Le Model correspond à :

* la couche repository ;
* la connexion à la base de données ;
* les requêtes SQL.

Les repositories sont les seuls responsables de l'accès aux données.

---

# 4. Frontend

Le frontend est développé avec React et TypeScript.

Il est responsable de :

* l'affichage ;
* l'interaction utilisateur ;
* la navigation ;
* la gestion de l'état de l'interface ;
* l'envoi des requêtes HTTP vers le backend ;
* l'affichage des données reçues de l'API.

Le frontend ne doit jamais accéder directement à MySQL.

---

# 5. Pages React

Les pages représentent les différentes vues accessibles par l'utilisateur.

Une page doit principalement :

* organiser les composants ;
* récupérer les données nécessaires via les hooks ;
* afficher les données ;
* gérer les interactions principales.

Une page ne doit pas contenir de logique backend.

Une page ne doit pas contenir de requêtes SQL.

Une page ne doit pas contenir de logique métier qui appartient au backend.

---

# 6. Composants React

Les composants sont responsables de l'interface utilisateur.

Ils doivent rester réutilisables lorsque cela est pertinent.

Un composant doit principalement gérer :

* l'affichage ;
* les interactions utilisateur ;
* les props ;
* les états UI locaux.

Il ne doit pas contenir de logique backend.

Lorsqu'une logique devient importante ou réutilisable, elle doit être déplacée dans un hook ou dans une couche adaptée.

---

# 7. Hooks frontend

Les hooks frontend sont utilisés pour communiquer avec l'API.

Exemples :

```text
useProduct()
useProducts()
useArticle()
useAuth()
```

Le nom réel des hooks doit suivre les conventions déjà présentes dans le projet.

Le rôle d'un hook est notamment de :

1. déclencher une requête HTTP ;
2. envoyer les données nécessaires ;
3. récupérer la réponse ;
4. gérer l'état associé ;
5. retourner les données au composant.

Exemple conceptuel :

```text
React component
      ↓
useProducts()
      ↓
fetch("/api/products")
      ↓
Backend
```

Les composants ne doivent pas reproduire plusieurs fois les mêmes appels API.

Lorsqu'une fonctionnalité nécessite plusieurs appels similaires, la logique doit être centralisée dans un hook approprié.

---

# 8. Communication Frontend / Backend

Le frontend communique avec le backend uniquement via HTTP.

Exemple :

```text
React
  ↓
useProducts()
  ↓
fetch()
  ↓
GET /api/products
  ↓
router.ts
```

Les URLs d'API doivent rester cohérentes.

Les méthodes HTTP doivent respecter leur rôle :

```text
GET     récupération
POST    création
PUT     remplacement / modification
PATCH   modification partielle
DELETE  suppression
```

Les réponses API doivent utiliser des codes HTTP cohérents.

Exemples :

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

---

# 9. Backend

Le backend est développé avec Node.js, Express et TypeScript.

Il constitue la frontière entre :

* le frontend ;
* la logique métier ;
* la base de données ;
* les services externes.

Le backend doit rester organisé par responsabilités.

Le flux principal est :

```text
HTTP Request
     ↓
router.ts
     ↓
action
     ↓
repository
     ↓
database
```

---

# 10. router.ts

Le fichier `router.ts` constitue le point d'entrée des routes HTTP.

Son rôle est de :

* déclarer les routes ;
* associer une méthode HTTP à une action ;
* récupérer les paramètres nécessaires ;
* transmettre les informations à l'action ;
* retourner la réponse HTTP.

Le router ne doit pas contenir de logique métier complexe.

Exemple conceptuel :

```ts
router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.post("/products", createProduct);
```

Le router doit rester simple.

Il ne doit pas contenir directement :

* des requêtes SQL ;
* des traitements métier complexes ;
* des appels directs à MySQL ;
* des calculs métier importants.

---

# 11. Actions

Les actions contiennent la logique métier du backend.

Une action reçoit les informations nécessaires à l'exécution d'une opération et utilise les repositories pour accéder aux données.

Exemple :

```text
router
   ↓
createProductAction()
   ↓
productRepository.create()
   ↓
MySQL
```

Les actions peuvent notamment :

* valider les données métier ;
* vérifier les permissions ;
* vérifier l'existence d'une ressource ;
* orchestrer plusieurs repositories ;
* appliquer des règles métier ;
* préparer les données ;
* appeler des services externes lorsque nécessaire.

Les actions ne doivent pas contenir directement les requêtes SQL.

---

# 12. Repositories

Les repositories sont responsables de l'accès à la base de données.

Ils contiennent les requêtes SQL nécessaires.

Exemple :

```text
productRepository
    ↓
SELECT ...
INSERT ...
UPDATE ...
DELETE ...
```

Un repository doit se concentrer sur l'accès aux données.

Il ne doit pas contenir de logique d'interface.

Il ne doit pas gérer les composants React.

Il ne doit pas décider de la réponse HTTP.

Il ne doit pas contenir de logique métier complexe qui appartient aux actions.

---

# 13. Base de données

MySQL constitue la couche de persistance.

La communication avec MySQL doit passer par la couche repository.

Principe obligatoire :

```text
Action
  ↓
Repository
  ↓
MySQL
```

Et jamais :

```text
Router
  ↓
MySQL
```

ou :

```text
React
  ↓
MySQL
```

Les requêtes SQL doivent être paramétrées afin d'éviter les injections SQL.

Exemple :

```ts
const [rows] = await database.query(
  "SELECT * FROM product WHERE id = ?",
  [id],
);
```

Il ne faut pas concaténer directement des données utilisateur dans une requête SQL.

---

# 14. Flux complet d'une fonctionnalité

Une fonctionnalité complète doit respecter le flux suivant :

```text
Utilisateur
    ↓
React component
    ↓
Hook
    ↓
fetch()
    ↓
HTTP API
    ↓
router.ts
    ↓
Action
    ↓
Repository
    ↓
MySQL
    ↓
Repository
    ↓
Action
    ↓
router
    ↓
HTTP response
    ↓
Hook
    ↓
React
    ↓
Interface utilisateur
```

Chaque couche doit rester responsable de son domaine.

---

# 15. Exemple concret : récupération des produits

Exemple de fonctionnement :

```text
Page Products
      ↓
useProducts()
      ↓
GET /api/products
      ↓
router.ts
      ↓
getProductsAction()
      ↓
productRepository.findAll()
      ↓
MySQL
```

Puis :

```text
MySQL
   ↓
Repository
   ↓
Action
   ↓
Router
   ↓
JSON
   ↓
Hook
   ↓
React
```

Cette organisation doit être reproduite pour les autres fonctionnalités.

---

# 16. Règle d'assimilation de l'architecture existante

Lorsqu'une fonctionnalité existe déjà dans le projet, Claude doit commencer par analyser son architecture avant d'en créer une nouvelle.

Il faut reproduire le fonctionnement déjà utilisé.

Exemple :

Si une fonctionnalité existante utilise :

```text
router
  ↓
action
  ↓
repository
```

une nouvelle fonctionnalité doit utiliser le même principe.

Il ne faut pas créer une nouvelle architecture parallèle.

Il ne faut pas introduire soudainement :

```text
controller/
service/
model/
manager/
```

si cette organisation n'existe pas déjà dans le projet.

L'objectif est de conserver une architecture homogène.

---

# 17. Nouvelle fonctionnalité

Chaque nouvelle fonctionnalité doit être développée de manière isolée.

Une fonctionnalité peut nécessiter :

* une page React ;
* des composants ;
* un hook ;
* une route API ;
* une action ;
* un repository ;
* une modification de base de données ;
* des tests ;
* une documentation.

Il faut uniquement créer les couches réellement nécessaires.

Ne pas créer de fichiers inutiles.

---

# 18. Validation des données

Les données provenant du frontend doivent toujours être considérées comme non fiables.

Le backend doit effectuer les validations nécessaires.

Exemples :

* champs obligatoires ;
* types ;
* formats ;
* valeurs autorisées ;
* existence d'une ressource ;
* permissions ;
* règles métier.

La validation backend est obligatoire même si le frontend effectue déjà une validation.

Le frontend améliore l'expérience utilisateur.

Le backend garantit l'intégrité et la sécurité.

---

# 19. Gestion des erreurs

Les erreurs doivent être gérées explicitement.

Une erreur ne doit pas être silencieusement ignorée.

Les réponses HTTP doivent être cohérentes.

Exemple :

```text
400 → données invalides
401 → utilisateur non authentifié
403 → utilisateur non autorisé
404 → ressource inexistante
409 → conflit
500 → erreur serveur
```

Les erreurs internes ne doivent pas exposer inutilement :

* les requêtes SQL ;
* les chemins internes ;
* les secrets ;
* les variables d'environnement ;
* les informations sensibles.

---

# 20. Authentification

L'authentification est gérée côté backend.

Les informations sensibles liées à l'authentification ne doivent jamais être exposées inutilement au frontend.

Lorsqu'une authentification par cookie est utilisée, les cookies doivent être configurés correctement.

Exemple de principes :

```text
httpOnly
secure en production
sameSite approprié
expiration contrôlée
```

Le frontend doit envoyer les credentials lorsque l'API utilise des cookies :

```ts
fetch(url, {
  credentials: "include",
});
```

Les routes nécessitant une authentification doivent vérifier l'utilisateur côté backend.

Il ne faut jamais considérer une simple protection frontend comme une protection suffisante.

---

# 21. Autorisation

Être authentifié ne signifie pas nécessairement être autorisé.

Les actions sensibles doivent vérifier les permissions côté backend.

Exemple :

```text
Utilisateur connecté
        ↓
Possède-t-il le rôle nécessaire ?
        ↓
Oui → continuer
Non → 403
```

Les contrôles d'autorisation ne doivent jamais dépendre uniquement du frontend.

---

# 22. Stripe

Stripe est considéré comme un service externe du backend.

Les clés secrètes Stripe doivent rester uniquement côté serveur.

La clé publique Stripe peut être utilisée côté frontend lorsqu'elle est nécessaire au fonctionnement de Stripe.

Principe :

```text
Frontend
   ↓
Stripe public key

Backend
   ↓
Stripe secret key
```

La clé secrète ne doit jamais être envoyée au frontend.

Les opérations sensibles Stripe doivent être réalisées côté backend.

Les webhooks Stripe doivent également être traités côté backend lorsqu'ils sont nécessaires.

---

# 23. Variables d'environnement

Les secrets et informations sensibles doivent être stockés dans des variables d'environnement.

Exemples :

```text
DATABASE_URL
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
STRIPE_SECRET_KEY
```

Les noms exacts doivent respecter ceux déjà utilisés dans le projet.

Ne jamais :

* hardcoder un mot de passe ;
* hardcoder une clé secrète ;
* commit une clé API privée ;
* commit un fichier `.env` contenant des secrets.

Le fichier `.env.example` peut contenir les noms des variables nécessaires sans leurs valeurs secrètes.

---

# 24. TypeScript

TypeScript est obligatoire sur le code applicatif.

Il faut éviter autant que possible :

```ts
any
```

L'utilisation de `any` doit être exceptionnelle et justifiée.

Les données provenant de l'extérieur de l'application doivent être correctement typées.

Les fonctions doivent avoir des types explicites lorsque cela améliore la compréhension ou évite une ambiguïté.

Il ne faut pas contourner TypeScript avec :

```ts
as any
```

uniquement pour faire disparaître une erreur.

Une erreur TypeScript doit être comprise et corrigée proprement.

---

# 25. Biome

Biome est utilisé pour :

* le formatage ;
* le linting ;
* les vérifications de code.

Il faut respecter la configuration Biome existante.

Ne pas installer ESLint si Biome est déjà utilisé comme outil principal.

Avant de considérer une fonctionnalité terminée, les vérifications disponibles doivent être exécutées.

Exemple :

```bash
npm run check
```

ou les commandes spécifiques déjà présentes dans le projet.

---

# 26. Tests unitaires

Les fonctionnalités importantes doivent être testées.

Les tests unitaires permettent notamment de vérifier :

* la logique métier ;
* les actions ;
* les fonctions importantes ;
* les cas nominaux ;
* les cas d'erreur ;
* les règles métier.

Un test doit vérifier un comportement précis.

Exemples :

```text
création d'un produit valide
création avec données invalides
produit inexistant
utilisateur non autorisé
suppression d'une ressource
```

Les tests ne doivent pas uniquement tester l'interface visuelle.

La logique métier doit être testée indépendamment lorsque cela est pertinent.

---

# 27. Base de données et tests

Les tests doivent éviter de dépendre inutilement d'un environnement de production.

Lorsqu'un test nécessite une base de données, utiliser l'environnement de test prévu par le projet.

Les tests doivent être reproductibles.

Un test ne doit pas dépendre d'une donnée créée manuellement par un développeur dans sa base personnelle.

---

# 28. CI — Continuous Integration

La CI est exécutée lors des Pull Requests.

Le but est de vérifier qu'une fonctionnalité peut être intégrée sans casser le projet.

La CI doit notamment vérifier :

```text
Installation
    ↓
TypeScript
    ↓
Biome
    ↓
Tests unitaires
    ↓
Build
```

Toutes les vérifications doivent être vertes avant le merge.

Une Pull Request ne doit pas être considérée comme prête si la CI est rouge.

---

# 29. Pull Requests

Toutes les nouvelles fonctionnalités doivent passer par une Pull Request.

La Pull Request doit permettre de vérifier :

* le code ;
* les tests ;
* le TypeScript ;
* Biome ;
* le build ;
* la cohérence avec l'architecture existante.

La Pull Request doit être créée vers :

```text
Dev
```

et non vers :

```text
main
```

---

# 30. Workflow Git KORN

Le workflow Git de KORN est strict.

## Règle fondamentale

La branche `main` ne doit jamais être utilisée pour le développement des fonctionnalités.

Claude ne doit jamais :

* faire `git push main` ;
* travailler directement sur `main` ;
* créer une feature en partant de `main` ;
* faire un merge directement vers `main`.

La branche centrale de développement est :

```text
Dev
```

Les fonctionnalités sont développées sur des branches dédiées puis intégrées à `Dev` via Pull Request.

---

# 31. Branches de fonctionnalités

Chaque fonctionnalité possède sa propre branche.

Les branches sont numérotées selon le workflow du projet.

Exemple :

```text
feature/14
feature/15
feature/16
feature/17
```

Une branche de fonctionnalité doit être conservée pendant le développement de la fonctionnalité correspondante.

---

# 32. Création d'une nouvelle branche

Le workflow KORN ne consiste pas à repartir systématiquement de `main`.

Il ne faut pas faire automatiquement :

```bash
git checkout main
git pull
git checkout -b feature/15
```

Ce workflow n'est pas celui utilisé dans KORN.

La nouvelle branche est créée à partir de la branche de fonctionnalité précédente.

Exemple :

```text
feature/14
     ↓
PR vers Dev
     ↓
CI verte
     ↓
merge dans Dev
     ↓
feature/15 créée depuis feature/14
```

Puis :

```text
feature/15
     ↓
PR vers Dev
     ↓
CI verte
     ↓
merge dans Dev
     ↓
feature/16 créée depuis feature/15
```

Et ainsi de suite.

---

# 33. Workflow complet d'une feature

Exemple avec `feature/14`.

## Étape 1 — Développement

Travailler sur :

```text
feature/14
```

Développer la fonctionnalité.

---

## Étape 2 — Vérifications locales

Avant de pousser :

```text
TypeScript
Biome
Tests
Build
```

Toutes les vérifications doivent passer.

---

## Étape 3 — Push

Pousser la branche :

```bash
git push origin feature/14
```

---

## Étape 4 — Pull Request

Créer une Pull Request :

```text
feature/14 → Dev
```

---

## Étape 5 — CI

La CI doit être entièrement verte.

Cela signifie notamment :

```text
TypeScript       ✅
Biome            ✅
Tests            ✅
Build            ✅
```

---

## Étape 6 — Merge

Une fois tous les contrôles validés :

```text
feature/14 → Dev
```

La Pull Request est mergée dans `Dev`.

---

## Étape 7 — Nouvelle feature

La prochaine branche est créée à partir de la branche précédente.

```bash
git checkout feature/14
git checkout -b feature/15
```

Puis le cycle recommence.

---

# 34. Règle importante concernant Dev

`Dev` est la branche centrale de développement.

Elle reçoit les fonctionnalités via Pull Requests.

Claude ne doit pas développer directement sur `Dev`.

Il ne faut pas faire :

```bash
git checkout Dev
# modifier des fichiers
git commit
git push
```

Le code doit passer par une branche de fonctionnalité.

---

# 35. Règle absolue concernant main

`main` est une branche protégée.

Claude ne doit jamais improviser un workflow impliquant `main`.

Interdictions :

```bash
git push origin main
```

```bash
git checkout main
```

pour créer une nouvelle feature.

```text
feature → main
```

sans processus de release explicitement défini.

Toute future promotion de `Dev` vers `main` devra suivre un processus de release défini par le projet.

Claude ne doit pas inventer ce processus.

---

# 36. Git — Commits

Les commits doivent rester compréhensibles.

Un commit doit représenter une modification cohérente.

Éviter les commits qui mélangent :

* une nouvelle fonctionnalité ;
* un refactoring sans rapport ;
* une modification de configuration ;
* une correction totalement différente.

Les messages doivent expliquer clairement la modification.

Exemples :

```text
feat: add product creation
fix: handle missing product
test: add product action tests
refactor: simplify product repository
```

Les conventions déjà utilisées dans le repository doivent être respectées lorsqu'elles existent.

---

# 37. Git — Avant chaque commit

Avant de commit une fonctionnalité :

```text
1. Vérifier le code
2. Vérifier TypeScript
3. Exécuter Biome
4. Exécuter les tests
5. Exécuter le build
6. Vérifier les fichiers modifiés
7. Commit
```

Il ne faut pas commit volontairement du code qui échoue aux vérifications du projet.

---

# 38. Git — Ne pas écraser le travail existant

Claude doit préserver le travail déjà réalisé.

Avant de modifier une partie du projet :

* comprendre le code existant ;
* comprendre les dépendances ;
* identifier les conventions utilisées ;
* réutiliser les fonctions existantes lorsque cela est pertinent.

Ne pas réécrire une architecture entière pour ajouter une petite fonctionnalité.

Ne pas supprimer du code fonctionnel sans raison.

Ne pas remplacer une solution existante par une autre simplement parce qu'elle est différente.

---

# 39. CI/CD

La CI et la CD doivent être séparées conceptuellement.

## CI

La CI vérifie que le code est valide :

```text
Lint / Biome
TypeScript
Tests
Build
```

## CD

La CD est responsable du déploiement.

Le déploiement ne doit être effectué que selon le workflow de déploiement configuré pour le projet.

Claude ne doit pas inventer un nouveau système de déploiement lorsqu'un système existe déjà.

---

# 40. Environnements

Le projet doit distinguer les environnements lorsque cela est nécessaire.

Exemple :

```text
development
staging
production
```

Les variables d'environnement doivent être adaptées à l'environnement.

Les secrets de production ne doivent jamais être utilisés ou commités dans le code source.

---

# 41. Dépendances

Avant d'ajouter une dépendance :

1. vérifier si une solution existante peut être réutilisée ;
2. vérifier si une dépendance déjà installée répond au besoin ;
3. éviter les packages inutiles ;
4. installer uniquement ce qui est nécessaire.

Le gestionnaire de paquets utilisé est :

```text
npm
```

Ne pas utiliser pnpm ou yarn pour installer arbitrairement des dépendances si le projet utilise npm.

---

# 42. Structure et responsabilités

Chaque fichier doit avoir une responsabilité claire.

Exemple :

```text
Page
→ interface

Component
→ élément d'interface réutilisable

Hook
→ communication avec l'API / logique frontend réutilisable

Router
→ routes HTTP

Action
→ logique métier

Repository
→ accès aux données

Database
→ connexion / exécution SQL
```

Il ne faut pas transformer un fichier en "fichier fourre-tout".

---

# 43. Réutilisation du code

Avant de créer une nouvelle fonction, rechercher si une fonction équivalente existe déjà.

Avant de créer un nouveau composant, vérifier si un composant existant peut être réutilisé.

Avant de créer un nouveau hook, vérifier si un hook existant peut être étendu.

Avant de créer une nouvelle action ou un nouveau repository, vérifier l'organisation existante.

L'objectif est d'éviter les doublons.

---

# 44. Séparation des responsabilités

Ne pas faire :

```text
React component
    ↓
SQL
```

Ne pas faire :

```text
router
    ↓
SQL
```

Ne pas faire :

```text
repository
    ↓
HTTP response
```

Ne pas faire :

```text
component
    ↓
logique métier backend
```

Le flux doit rester :

```text
React
 ↓
Hook
 ↓
API
 ↓
Router
 ↓
Action
 ↓
Repository
 ↓
Database
```

---

# 45. Modification de la base de données

Toute modification du schéma de base de données doit être réfléchie avant d'être appliquée.

Exemples :

* nouvelle table ;
* nouvelle colonne ;
* nouvelle relation ;
* index ;
* contrainte ;
* suppression de colonne.

Les migrations existantes doivent être respectées.

Ne pas modifier directement une base de production pour contourner le système de migration.

---

# 46. Sécurité

Les données utilisateur doivent être considérées comme non fiables.

Toujours protéger :

* authentification ;
* autorisation ;
* requêtes SQL ;
* secrets ;
* cookies ;
* endpoints sensibles ;
* paiements ;
* données personnelles.

Les secrets ne doivent jamais apparaître :

* dans le code ;
* dans Git ;
* dans les logs ;
* dans les réponses API.

---

# 47. Logs

Les logs doivent être utiles au debugging.

Ne pas logger inutilement :

* mots de passe ;
* tokens ;
* clés API ;
* données bancaires ;
* secrets ;
* informations personnelles sensibles.

Les logs de développement ne doivent pas devenir des dépendances du fonctionnement normal de l'application.

---

# 48. Performance

La performance doit être prise en compte sans complexifier inutilement l'application.

Éviter notamment :

* requêtes SQL inutiles ;
* appels API répétés ;
* duplication de données ;
* boucles inutiles ;
* composants inutilement lourds.

Mais ne pas optimiser prématurément une partie du projet sans problème identifié.

La priorité est :

```text
correct
→ maintenable
→ testé
→ performant
```

---

# 49. Responsive et interface

Le frontend doit rester utilisable sur les différentes tailles d'écran prévues par le projet.

Les composants doivent éviter les dimensions rigides inutiles.

Les interfaces doivent conserver :

* une structure claire ;
* une bonne lisibilité ;
* des interactions compréhensibles ;
* une cohérence visuelle.

---

# 50. Accessibilité

L'accessibilité doit être prise en compte lors du développement frontend.

Utiliser notamment :

* des éléments HTML sémantiques ;
* des labels pour les champs ;
* des boutons réellement interactifs ;
* des attributs accessibles lorsque nécessaire ;
* un contraste suffisant ;
* une navigation clavier cohérente.

Ne pas remplacer inutilement un élément HTML natif par un `div` cliquable.

---

# 51. Workflow obligatoire pour Claude

Lorsqu'une nouvelle tâche est donnée, Claude doit suivre cette logique.

## Étape 1 — Comprendre

Avant de modifier le code :

* lire les fichiers concernés ;
* comprendre leur fonctionnement ;
* identifier les dépendances ;
* vérifier les conventions déjà utilisées.

---

## Étape 2 — Identifier la couche concernée

Déterminer si la modification concerne :

```text
Frontend
Hook
Router
Action
Repository
Database
Test
CI/CD
```

---

## Étape 3 — Réutiliser l'existant

Chercher les fonctions, composants, hooks, actions et repositories existants avant d'en créer de nouveaux.

---

## Étape 4 — Implémenter

Respecter l'architecture :

```text
Frontend
→ Hooks
→ Router
→ Actions
→ Repositories
→ Database
```

---

## Étape 5 — Tester

Ajouter ou modifier les tests nécessaires.

---

## Étape 6 — Vérifier

Exécuter :

```text
TypeScript
Biome
Tests
Build
```

en utilisant les scripts réellement présents dans le projet.

---

## Étape 7 — Git

Vérifier la branche courante.

Si une fonctionnalité est déjà en cours sur une branche `feature/*`, continuer sur cette branche.

Ne jamais basculer automatiquement vers `main`.

---

## Étape 8 — Push

Pousser uniquement la branche de fonctionnalité :

```bash
git push origin feature/XX
```

Jamais :

```bash
git push origin main
```

---

## Étape 9 — Pull Request

Créer la Pull Request :

```text
feature/XX → Dev
```

---

## Étape 10 — CI

Attendre que toutes les vérifications soient vertes.

---

## Étape 11 — Merge

Une fois la CI validée :

```text
feature/XX → Dev
```

---

## Étape 12 — Feature suivante

Créer la prochaine feature depuis la branche de feature précédente.

Exemple :

```text
feature/14
    ↓
PR → Dev
    ↓
merge
    ↓
feature/15 créée depuis feature/14
```

Puis continuer :

```text
feature/15
    ↓
PR → Dev
    ↓
merge
    ↓
feature/16 créée depuis feature/15
```

---

# 52. Ce que Claude ne doit jamais faire

Claude ne doit jamais :

* pousser directement sur `main` ;
* développer directement sur `Dev` ;
* créer automatiquement une feature depuis `main` ;
* contourner la CI ;
* ignorer les tests ;
* ignorer TypeScript ;
* désactiver Biome pour faire passer un build ;
* hardcoder des secrets ;
* mettre du SQL dans React ;
* mettre du SQL directement dans le router ;
* mettre de la logique métier complexe dans le router ;
* faire communiquer React directement avec MySQL ;
* créer une architecture parallèle à celle déjà utilisée ;
* réécrire inutilement une partie fonctionnelle du projet ;
* supprimer une fonctionnalité existante sans raison ;
* ajouter des dépendances sans vérifier l'existant ;
* inventer des dossiers ou abstractions inutiles ;
* considérer une validation frontend comme suffisante pour la sécurité ;
* exposer des secrets dans les réponses API ou les logs.

---

# 53. Principe fondamental du projet

KORN doit rester simple à comprendre.

Chaque fonctionnalité doit pouvoir être suivie facilement :

```text
Utilisateur
    ↓
React
    ↓
Hook
    ↓
API
    ↓
router.ts
    ↓
Action
    ↓
Repository
    ↓
MySQL
```

Si une nouvelle fonctionnalité nécessite une autre organisation, elle doit être justifiée par une contrainte réelle du projet.

L'architecture existante doit toujours être privilégiée avant l'introduction d'une nouvelle abstraction.

---

# 54. Règle finale

La priorité de Claude est de :

1. comprendre l'existant ;
2. respecter l'architecture déjà mise en place ;
3. conserver la séparation des responsabilités ;
4. réutiliser le code existant ;
5. écrire du code TypeScript propre ;
6. tester les fonctionnalités ;
7. faire passer Biome ;
8. faire passer le build ;
9. respecter le workflow Git ;
10. ne jamais pousser directement sur `main`.

Le principe général à retenir est :

```text
Comprendre
   ↓
Respecter l'existant
   ↓
Développer
   ↓
Tester
   ↓
Vérifier TypeScript
   ↓
Vérifier Biome
   ↓
Build
   ↓
Commit
   ↓
Push feature/XX
   ↓
Pull Request → Dev
   ↓
CI verte
   ↓
Merge → Dev
   ↓
Créer feature suivante depuis la feature précédente
```

**Ne jamais contourner ce workflow sans instruction explicite.**
