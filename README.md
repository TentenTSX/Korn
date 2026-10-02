# Configuration Stripe

Le checkout utilise Stripe Checkout en mode paiement EUR. Aucune donnée de carte
ne transite par l’API Korn.

1. Copier `server/.env.sample` vers `server/.env` et renseigner `STRIPE_SECRET_KEY`,
	`STRIPE_WEBHOOK_SECRET`, `CLIENT_URL` ainsi que les paramètres MySQL/JWT.
	En local, démarrer Mailpit avec `docker compose up -d mailpit` : les emails
	sont visibles dans `http://localhost:8025` et ne partent pas vers de vrais
	destinataires.
   Pour envoyer en réel, remplacer SMTP_HOST/PORT/SECURE, ajouter SMTP_USER et
   SMTP_PASSWORD si le fournisseur en demande, puis configurer EMAIL_FROM.
2. Appliquer une fois les ajouts de schéma non destructifs :

	```sh
	npm run db:migrate:commerce --workspace=server
	```

	Ne pas utiliser `db:migrate` pour cette évolution : cette commande recrée la
	base entière.
3. En développement, installer Stripe CLI (`brew install stripe/stripe-cli/stripe`).
   Le lanceur local récupère le secret webhook en mémoire et le masque dans ses
   logs; il démarre ensuite l’API et le forwarder Stripe ensemble :

	```sh
	npm run dev:stripe --workspace=server
	```

   Pour un déploiement, créer un endpoint webhook Stripe pour
   `/api/payments/stripe/webhook` et définir son secret `whsec_...` dans
   `STRIPE_WEBHOOK_SECRET`.

Le webhook `checkout.session.completed` confirme la commande et retire du panier
uniquement les quantités payées. Les paniers invités sont conservés dans MySQL
et fusionnés avec le panier du compte lors de l’inscription ou de la connexion.

## Factures et emails de confirmation

Après la confirmation signée par Stripe, le backend marque le paiement, attribue
un numéro de facture et envoie un email avec la facture PDF en pièce jointe. Les
factures sont aussi téléchargeables depuis le dashboard, uniquement pour les
commandes payées et appartenant au compte connecté.

Configurer dans `server/.env` les variables SMTP suivantes :

```dotenv
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=Korn <orders@example.com>
```

Le dashboard calcule les commandes en cours, factures disponibles et paiements
en attente à partir des statuts et paiements enregistrés en base. Une facture
n’est jamais proposée pour une commande non payée.
