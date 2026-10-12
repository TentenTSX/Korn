# KORN

KORN est une boutique en ligne de vêtements de sport (streetwear/training),
développée en solo comme projet de portfolio. L'application couvre le parcours
e-commerce complet : catalogue, panier, codes promo, paiement Stripe, factures,
comptes utilisateurs et un espace admin de gestion des commandes.

## Sommaire

- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Architecture](#architecture)
- [Démarrage local](#démarrage-local)
- [Scripts disponibles](#scripts-disponibles)
- [Variables d'environnement](#variables-denvironnement)
- [Tests et qualité de code](#tests-et-qualité-de-code)
- [Fonctionnalités](#fonctionnalités)
- [Paiement Stripe](#paiement-stripe)
- [Factures et emails de confirmation](#factures-et-emails-de-confirmation)
- [Livraison](#livraison)
- [Espace admin](#espace-admin)
- [Workflow Git](#workflow-git)
- [Déploiement](#déploiement)
- [Licence](#licence)

## Stack technique

- **Frontend** : React, TypeScript, Vite, React Router
- **Backend** : Node.js, Express, TypeScript
- **Base de données** : MySQL
- **Paiement** : Stripe Checkout + webhooks
- **Emails** : Nodemailer (SMTP), PDF généré avec PDFKit
- **Authentification** : JWT (cookie httpOnly) + OAuth Google
- **Qualité** : Biome (lint/format), Jest (tests), TypeScript strict
- **Gestionnaire de paquets** : npm (workspaces)

## Structure du projet

```text
KORN/
├── client/   # Application React (Vite)
└── server/   # API Express + accès MySQL
```

Le projet est un monorepo npm (`workspaces: ["client", "server"]`) : une seule
installation (`npm install`) à la racine couvre les deux paquets.

## Architecture

Chaque fonctionnalité suit le même flux, dans les deux sens :

```text
React (pages/composants)
   ↓
Hooks (appels API)
   ↓
router.ts (routes Express)
   ↓
Actions (logique métier, validation)
   ↓
Repositories (requêtes SQL)
   ↓
MySQL
```

- Les **pages/composants** ne font que de l'affichage et de l'interaction.
- Les **hooks** sont le seul point de contact avec l'API côté client (aucun
  composant n'appelle `fetch`/`apiRequest` directement).
- Le **router** déclare les routes et délègue tout le reste aux actions.
- Les **actions** valident les entrées, vérifient les permissions et orchestrent
  les repositories — jamais de SQL ici.
- Les **repositories** sont les seuls à parler à MySQL, toujours en requêtes
  paramétrées.

Le détail complet des règles d'architecture et de workflow est dans
[`CLAUDE.md`](./CLAUDE.md).

## Démarrage local

### Prérequis

- Node.js 20+
- Une instance MySQL 8+ accessible (locale ou via Docker)
- [Docker](https://www.docker.com/) (optionnel, pour Mailpit en local)

### Installation

```sh
git clone <url-du-repo>
cd Korn
npm install
```

### Configuration

Copier les fichiers d'exemple et renseigner les valeurs nécessaires :

```sh
cp server/.env.sample server/.env
cp client/.env.sample client/.env
```

Voir la section [Variables d'environnement](#variables-denvironnement) pour le
détail de chaque valeur.

### Base de données

```sh
npm run db:migrate   # crée les tables et insère les données de démo
npm run db:seed       # optionnel : jeu de données supplémentaire
```

### Emails en local

Les emails (confirmation de commande, réinitialisation de mot de passe...) ne
partent pas vers de vrais destinataires en développement. Démarrer Mailpit
pour les consulter dans un navigateur :

```sh
docker compose up -d mailpit
```

Les emails envoyés par l'app sont alors visibles sur `http://localhost:8025`.

### Lancer l'application

```sh
npm run dev
```

Démarre le client (`http://localhost:3000`) et le serveur (`http://localhost:3310`)
en parallèle, avec rechargement automatique.

> Un `Dockerfile` et des fichiers `docker-compose*.yml` existent aussi à la
> racine, hérités du template de départ de l'école (ils ciblent l'infrastructure
> interne de l'école, pas un hébergement générique). Ils ne sont pas utilisés
> pour le déploiement de ce projet — voir [Déploiement](#déploiement).

## Scripts disponibles

Depuis la racine du projet :

| Commande | Effet |
| --- | --- |
| `npm run dev` | Lance client + serveur en développement |
| `npm run build` | Build de production du client (ne touche pas à la base) |
| `npm start` | Démarre le serveur en mode production |
| `npm test` | Lance les tests (Jest, côté serveur) |
| `npm run check` | Biome (lint/format) + vérification TypeScript |
| `npm run check:fix` | Comme `check`, en corrigeant ce qui peut l'être |
| `npm run db:migrate` | Applique le schéma complet (recrée la base) |
| `npm run db:seed` | Ajoute un jeu de données de démonstration |

Scripts spécifiques au serveur (`--workspace=server`) :

| Commande | Effet |
| --- | --- |
| `npm run dev:stripe --workspace=server` | Démarre l'API + le forwarder Stripe CLI (webhooks en local) |
| `npm run db:migrate:commerce --workspace=server` | Applique uniquement les évolutions de schéma non destructives liées au e-commerce |

## Variables d'environnement

### `server/.env`

| Variable | Description |
| --- | --- |
| `APP_PORT` | Port local du serveur (ignoré en production, voir [Déploiement](#déploiement)) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Connexion MySQL |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Signature et durée de vie des sessions |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Connexion Google OAuth |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Paiement Stripe (voir [Paiement Stripe](#paiement-stripe)) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` | Envoi d'emails |
| `CLIENT_URL` | URL du frontend, utilisée pour le CORS et les liens dans les emails |
| `NODE_ENV` | `production` en prod : active les cookies sécurisés (HTTPS uniquement) |

### `client/.env`

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | URL de l'API consommée par le frontend |
| `VITE_STRIPE_PUBLIC_KEY` | Clé publique Stripe (sans risque à exposer côté client) |

Les noms exacts et valeurs d'exemple sont dans `server/.env.sample` et
`client/.env.sample`.

## Tests et qualité de code

```sh
npm test          # suite de tests Jest (actions métier, cas nominaux et d'erreur)
npm run check     # Biome + TypeScript
```

Les deux doivent être au vert avant toute Pull Request — c'est aussi ce que
vérifie la CI GitHub Actions.

## Fonctionnalités

- Authentification (email/mot de passe + Google OAuth), réinitialisation de
  mot de passe, profil (modifier ses informations, changer de mot de passe,
  supprimer son compte).
- Catalogue avec filtres (genre, sous-catégorie, nouveautés, bestsellers),
  recherche, tri par prix, pagination, et un filtre "produits bientôt
  disponibles" pour les articles en rupture de stock.
- Panier persistant (compte ou invité, fusionné à la connexion).
- Codes promo liés aux périodes de soldes, appliqués dans le panier.
- Paiement sécurisé via Stripe Checkout, confirmé par webhook.
- Facture PDF générée automatiquement et envoyée par email après paiement.
- Historique des commandes et téléchargement de facture depuis le compte.
- Espace admin (`/admin/orders`) pour suivre toutes les commandes et faire
  avancer leur statut (préparée → expédiée → livrée).

## Paiement Stripe

Le checkout utilise Stripe Checkout en mode paiement EUR. Aucune donnée de carte
ne transite par l'API KORN.

1. Renseigner dans `server/.env` : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
   `CLIENT_URL` ainsi que les paramètres MySQL/JWT.
2. En local, installer [Stripe CLI](https://stripe.com/docs/stripe-cli)
   (`brew install stripe/stripe-cli/stripe`). Le lanceur dédié récupère le
   secret webhook en mémoire et le masque dans ses logs, puis démarre l'API et
   le forwarder Stripe ensemble :

   ```sh
   npm run dev:stripe --workspace=server
   ```

3. Pour un déploiement, créer un endpoint webhook Stripe pour
   `/api/payments/stripe/webhook` et renseigner son secret `whsec_...` dans
   `STRIPE_WEBHOOK_SECRET`.

Le webhook `checkout.session.completed` confirme la commande et retire du
panier uniquement les quantités payées. Les paniers invités sont conservés en
base et fusionnés avec le panier du compte lors de l'inscription ou de la
connexion.

## Factures et emails de confirmation

Après la confirmation signée par Stripe, le backend marque le paiement,
attribue un numéro de facture et envoie un email avec la facture PDF en pièce
jointe. Les factures sont aussi téléchargeables depuis le compte, uniquement
pour les commandes payées et appartenant à l'utilisateur connecté.

Une commande non payée ne propose jamais de facture.

## Livraison

Les frais de livraison sont un forfait fixe (`server/src/modules/order/shippingFee.ts`),
pas un vrai calcul transporteur. Aucun transporteur (Chronopost, Colissimo,
Shippo, etc.) n'est branché : KORN ne vend pas encore de produits réels, donc
intégrer un vrai transporteur maintenant n'apporterait rien. Le statut d'une
commande (préparée / expédiée / livrée) se met à jour manuellement depuis
l'espace admin plutôt que par webhook transporteur. À revisiter uniquement
quand il y aura de vraies ventes à expédier.

## Espace admin

Un compte avec `role = 'admin'` accède à `/admin/orders` (lien visible dans la
navbar une fois connecté) pour voir toutes les commandes et faire avancer leur
statut. Aucune inscription admin en self-service n'existe volontairement :
promouvoir un compte se fait directement en base :

```sql
UPDATE users SET role = 'admin' WHERE email = 'vous@exemple.com';
```

## Workflow Git

- `main` est protégée : jamais de développement ni de push direct.
- `Dev` est la branche d'intégration : toutes les fonctionnalités y arrivent
  par Pull Request, jamais directement.
- Chaque fonctionnalité vit sur sa propre branche numérotée,
  `NNNN-Nom-Explicite` (ex. `0059-Admin-Order-Management`), créée depuis la
  branche de fonctionnalité précédente.
- Avant toute Pull Request : TypeScript, Biome, tests et build doivent être au
  vert.

Le détail complet (pourquoi, et les règles d'architecture associées) est dans
[`CLAUDE.md`](./CLAUDE.md).

## Déploiement

L'application est pensée pour être déployée comme **un seul service** : le
serveur Express sert aussi le build React (`client/dist`) en statique, avec
redirection vers `index.html` pour les routes côté client
(`server/src/app.ts`). Pas besoin d'hébergement séparé pour le frontend.

Hébergement choisi : [Railway](https://railway.app) (~5$/mois — son offre
gratuite a été supprimée en 2024, mais reste le plus simple pour ce stack
Node + MySQL sans aucune adaptation de code).

1. Créer un projet Railway, y ajouter un service **MySQL** (plugin en un
   clic) et un second service pointant sur ce dépôt.
2. Dans les réglages du service : builder **Railpack**, build `npm run build`,
   start `npm start` (le `Dockerfile` est un reliquat du template de l'école,
   sans commande de démarrage).
3. Renseigner les variables d'environnement du service (onglet *Variables*),
   en reprenant celles de [server/.env](#variables-denvironnement) :
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` via les références
     Railway du service MySQL (ex. `${{MySQL.MYSQLHOST}}`), et `DB_NAME=Korn`
     (`schema.sql` fait `USE Korn;`).
   - `NODE_ENV=production`
   - `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `SMTP_*` / `EMAIL_FROM` d'un vrai fournisseur (Mailpit n'existe qu'en
     local)
   - `CLIENT_URL` et `GOOGLE_REDIRECT_URI`, une fois le domaine Railway
     attribué après le premier déploiement.
4. Initialiser la base **une seule fois**, depuis un poste local, en pointant
   `server/.env` sur l'URL publique (TCP proxy) du MySQL Railway puis
   `npm run db:migrate`. Le build ne lance plus la migration : elle supprime
   et recrée la base, et elle refuse de tourner quand `NODE_ENV=production`.
5. Créer l'endpoint webhook Stripe pointant vers
   `https://<domaine-railway>/api/payments/stripe/webhook` et renseigner son
   secret dans `STRIPE_WEBHOOK_SECRET`.

## Licence

MIT — voir [`LICENSE.md`](./LICENSE.md).
