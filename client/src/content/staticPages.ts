export type StaticPageSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
};

export type StaticPageCategory = "Aide" | "La marque" | "Informations légales";

export type StaticPageContent = {
  category: StaticPageCategory;
  eyebrow: string;
  title: string;
  intro?: string;
  notice?: string;
  sections: StaticPageSection[];
};

export const staticPages: Record<string, StaticPageContent> = {
  faq: {
    category: "Aide",
    eyebrow: "Aide",
    title: "Questions fréquentes",
    sections: [
      {
        heading: "Dois-je créer un compte pour commander ?",
        paragraphs: [
          "Non, vous pouvez commander en tant qu'invité. Créer un compte vous permet toutefois de retrouver facilement votre historique de commandes et de télécharger vos factures à tout moment.",
        ],
      },
      {
        heading: "Comment suivre ma commande ?",
        paragraphs: [
          'Depuis votre espace "Mes commandes", vous retrouvez le statut de chaque commande (en préparation, expédiée, livrée). Un email vous est envoyé à chaque étape importante.',
        ],
      },
      {
        heading:
          "Puis-je modifier ou annuler ma commande après l'avoir passée ?",
        paragraphs: [
          "Si votre commande n'a pas encore été expédiée, contactez-nous le plus vite possible depuis la page Contact en indiquant votre numéro de commande. Une fois expédiée, vous pouvez utiliser notre procédure de retour standard.",
        ],
      },
      {
        heading: "Quels moyens de paiement acceptez-vous ?",
        paragraphs: [
          "Toutes les cartes bancaires principales (Visa, Mastercard...) via Stripe, notre prestataire de paiement sécurisé. Aucune donnée bancaire n'est stockée sur nos serveurs.",
        ],
      },
      {
        heading: "Comment choisir ma taille ?",
        paragraphs: [
          "Consultez notre Guide des tailles, qui détaille les mesures pour chaque taille et explique comment bien vous mesurer.",
        ],
      },
    ],
  },

  livraison: {
    category: "Aide",
    eyebrow: "Aide",
    title: "Livraison",
    intro:
      "Nous mettons tout en œuvre pour que votre commande vous parvienne rapidement et en parfait état.",
    sections: [
      {
        heading: "Délais de livraison",
        list: [
          "France métropolitaine : 2 à 4 jours ouvrés",
          "Union européenne : 4 à 7 jours ouvrés",
        ],
        paragraphs: [
          "Les délais s'entendent à partir de la validation et du paiement de votre commande, hors weekends et jours fériés.",
        ],
      },
      {
        heading: "Frais de livraison",
        paragraphs: [
          "Les frais de livraison sont calculés et affichés avant le paiement final, en fonction de votre adresse de livraison.",
        ],
      },
      {
        heading: "Suivi de commande",
        paragraphs: [
          'Dès l\'expédition de votre colis, vous recevez un email de confirmation. Le statut de votre commande reste visible à tout moment depuis votre espace "Mes commandes".',
        ],
      },
    ],
  },

  retours: {
    category: "Aide",
    eyebrow: "Aide",
    title: "Retours & échanges",
    intro:
      "Si un article ne convient pas, vous disposez d'un délai de rétractation de 14 jours calendaires à compter de la réception de votre commande, conformément à la législation en vigueur.",
    sections: [
      {
        heading: "Conditions de retour",
        list: [
          "L'article n'a pas été porté ni lavé",
          "Les étiquettes d'origine sont toujours attachées",
          "L'article est retourné dans son emballage d'origine",
        ],
      },
      {
        heading: "Comment effectuer un retour",
        paragraphs: [
          "Contactez-nous depuis la page Contact en indiquant votre numéro de commande et l'article concerné. Nous vous communiquerons la marche à suivre et l'adresse de retour.",
        ],
      },
      {
        heading: "Remboursement",
        paragraphs: [
          "Le remboursement est effectué sur votre moyen de paiement d'origine dans un délai de 14 jours suivant la réception de l'article retourné.",
        ],
      },
    ],
  },

  "guide-des-tailles": {
    category: "Aide",
    eyebrow: "Aide",
    title: "Guide des tailles",
    intro:
      "Prenez vos mesures avec un mètre ruban souple, sans trop serrer, pour choisir la taille la plus adaptée.",
    sections: [
      {
        heading: "Hauts (T-shirts, sweats, débardeurs)",
        list: [
          "S — Tour de poitrine 86–91 cm",
          "M — Tour de poitrine 92–97 cm",
          "L — Tour de poitrine 98–103 cm",
          "XL — Tour de poitrine 104–110 cm",
        ],
      },
      {
        heading: "Bas (Pantalons, shorts, leggings)",
        list: [
          "S — Tour de taille 66–71 cm",
          "M — Tour de taille 72–77 cm",
          "L — Tour de taille 78–84 cm",
          "XL — Tour de taille 85–91 cm",
        ],
      },
      {
        heading: "Entre deux tailles ?",
        paragraphs: [
          "Si vous hésitez entre deux tailles, nous recommandons de choisir la taille supérieure pour un confort optimal, en particulier pour les articles techniques.",
        ],
      },
    ],
  },

  contact: {
    category: "Aide",
    eyebrow: "Aide",
    title: "Nous contacter",
    sections: [
      {
        heading: "Par email",
        paragraphs: [
          "Pour toute question sur une commande, un produit ou votre compte, écrivez-nous à contact@korn-store.example. Nous répondons sous 48h ouvrées.",
          "Pensez à indiquer votre numéro de commande si votre question la concerne.",
        ],
      },
      {
        heading: "Réseaux sociaux",
        paragraphs: [
          "Retrouvez-nous sur Instagram, TikTok et YouTube pour suivre nos dernières sorties et coulisses.",
        ],
      },
    ],
  },

  "notre-histoire": {
    category: "La marque",
    eyebrow: "La marque",
    title: "Notre histoire",
    sections: [
      {
        paragraphs: [
          "Korn est née d'une conviction simple : le vêtement de sport ne devrait jamais être un compromis entre performance et style.",
          "Nous concevons des pièces techniques pensées pour le mouvement — matières respirantes, coupes ergonomiques, finitions soignées — sans jamais sacrifier l'esthétique du quotidien.",
          "Chaque collection est pensée pour accompagner aussi bien une séance d'entraînement qu'une journée en ville.",
        ],
      },
    ],
  },

  durabilite: {
    category: "La marque",
    eyebrow: "La marque",
    title: "Durabilité",
    sections: [
      {
        paragraphs: [
          "Du coton biologique doux au nylon recyclé haute performance, chaque matière est choisie pour sa résistance, son confort et son impact réduit.",
          "Nous travaillons à réduire notre empreinte à chaque étape : choix des matières, conception de pièces durables plutôt que jetables, et réduction des emballages.",
          "C'est une démarche continue : nous progressons collection après collection, et nous restons transparents sur le chemin qu'il reste à parcourir.",
        ],
      },
    ],
  },

  presse: {
    category: "La marque",
    eyebrow: "La marque",
    title: "Presse",
    sections: [
      {
        paragraphs: [
          "Journaliste ou créateur de contenu et vous souhaitez parler de Korn ? Contactez-nous à presse@korn-store.example.",
          "Un dossier de presse et des visuels haute définition peuvent être transmis sur demande.",
        ],
      },
    ],
  },

  affiliation: {
    category: "La marque",
    eyebrow: "La marque",
    title: "Programme d'affiliation",
    sections: [
      {
        paragraphs: [
          "Vous créez du contenu autour du sport ou du style, et vous souhaitez recommander Korn à votre communauté ? Notre programme d'affiliation vous permet de toucher une commission sur chaque vente réalisée grâce à votre lien personnalisé.",
          "Pour candidater, écrivez-nous à partenaires@korn-store.example en présentant votre audience et vos canaux de diffusion.",
        ],
      },
    ],
  },

  carrieres: {
    category: "La marque",
    eyebrow: "La marque",
    title: "Carrières",
    sections: [
      {
        paragraphs: [
          "Chez Korn, nous aimons travailler avec des personnes passionnées de sport, de design et de produit.",
          "Aucun poste n'est ouvert pour le moment, mais nous examinons volontiers les candidatures spontanées : écrivez-nous à carrieres@korn-store.example en nous disant ce qui vous motive à nous rejoindre.",
        ],
      },
    ],
  },

  confidentialite: {
    category: "Informations légales",
    eyebrow: "Informations légales",
    title: "Politique de confidentialité",
    notice:
      "Modèle à faire valider par un professionnel du droit avant mise en production, et à compléter avec les informations réelles de l'entreprise.",
    sections: [
      {
        heading: "Données collectées",
        paragraphs: [
          "Nous collectons les données nécessaires à la gestion de votre compte et de vos commandes : nom, prénom, email, adresse de livraison, et historique de commandes.",
        ],
      },
      {
        heading: "Finalité du traitement",
        paragraphs: [
          "Ces données sont utilisées pour traiter vos commandes, assurer le service client, et, si vous y avez consenti, vous envoyer notre newsletter.",
        ],
      },
      {
        heading: "Partage avec des tiers",
        paragraphs: [
          "Vos données de paiement sont traitées directement par Stripe, notre prestataire de paiement, et ne transitent jamais par nos serveurs. Vos informations de livraison sont transmises au transporteur en charge de votre commande.",
        ],
      },
      {
        heading: "Vos droits",
        paragraphs: [
          "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition sur vos données personnelles. Pour exercer ces droits, contactez-nous à confidentialite@korn-store.example.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "Nous utilisons des cookies strictement nécessaires au fonctionnement du site (panier, session de connexion). Aucun cookie publicitaire tiers n'est utilisé à ce jour.",
        ],
      },
    ],
  },

  cgv: {
    category: "Informations légales",
    eyebrow: "Informations légales",
    title: "Conditions générales de vente",
    notice:
      "Modèle à faire valider par un professionnel du droit avant mise en production, et à compléter avec les informations réelles de l'entreprise.",
    sections: [
      {
        heading: "Objet",
        paragraphs: [
          "Les présentes conditions générales de vente régissent les ventes de produits réalisées sur le site Korn entre la société éditrice du site et ses clients.",
        ],
      },
      {
        heading: "Prix",
        paragraphs: [
          "Les prix sont indiqués en euros, toutes taxes comprises. Korn se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est celui en vigueur au moment de la commande.",
        ],
      },
      {
        heading: "Paiement",
        paragraphs: [
          "Le paiement s'effectue en ligne par carte bancaire via Stripe, de manière sécurisée. La commande n'est validée qu'après confirmation du paiement.",
        ],
      },
      {
        heading: "Livraison",
        paragraphs: [
          "Les modalités et délais de livraison sont détaillés sur la page Livraison.",
        ],
      },
      {
        heading: "Droit de rétractation",
        paragraphs: [
          "Conformément à la loi, vous disposez d'un délai de 14 jours calendaires à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motif. Voir la page Retours pour la procédure.",
        ],
      },
      {
        heading: "Garanties légales",
        paragraphs: [
          "Tous les produits vendus bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés, conformément au droit en vigueur.",
        ],
      },
      {
        heading: "Droit applicable",
        paragraphs: [
          "Les présentes conditions générales de vente sont soumises au droit français.",
        ],
      },
    ],
  },

  "mentions-legales": {
    category: "Informations légales",
    eyebrow: "Informations légales",
    title: "Mentions légales",
    notice:
      "Les champs ci-dessous sont des exemples à remplacer par les informations réelles de l'entreprise avant mise en production.",
    sections: [
      {
        heading: "Éditeur du site",
        list: [
          "Raison sociale : [À compléter]",
          "Forme juridique : [À compléter]",
          "Capital social : [À compléter]",
          "Siège social : [À compléter]",
          "SIRET : [À compléter]",
          "Directeur de la publication : [À compléter]",
          "Contact : contact@korn-store.example",
        ],
      },
      {
        heading: "Hébergement",
        list: [
          "Hébergeur : [À compléter]",
          "Adresse de l'hébergeur : [À compléter]",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        paragraphs: [
          "L'ensemble des contenus présents sur ce site (textes, images, logos) est protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation préalable est interdite.",
        ],
      },
    ],
  },
};

export type StaticPageSlug = keyof typeof staticPages;
