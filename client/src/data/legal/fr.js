import { entity } from "../legalEntity";

/**
 * The five legal documents, in French.
 *
 * Written against what this site actually does, not from a template: the
 * processors named below are the four the code really talks to (Vercel,
 * MongoDB Atlas, the Resend SMTP relay and OpenAI), and the data listed is
 * what the Mongoose models really store. A policy that describes a different
 * site is not a smaller problem than no policy.
 */
const UPDATED = "26 novembre 2026";

const fr = {
  confidentialite: {
    title: "Politique de confidentialité",
    intro:
      "Cette page explique quelles données GROWSTACK collecte sur growstack.ma, pourquoi, " +
      "avec qui elles sont partagées et comment en demander la suppression.",
    updated: UPDATED,
    sections: [
      {
        h: "Qui est responsable",
        p: [
          `Le responsable du traitement est ${entity.tradingName}, représenté par ${entity.founder}, ` +
            `à ${entity.city}, ${entity.country}. Pour toute question sur vos données : ${entity.email}.`,
        ],
      },
      {
        h: "Ce que nous collectons, et pourquoi",
        p: ["Nous ne collectons que ce dont une prestation a besoin pour exister."],
        ul: [
          "Compte client : nom, adresse e-mail, mot de passe (stocké sous forme de hachage, jamais en clair), et si vous les renseignez, téléphone et ville. Nécessaire pour vous connecter et suivre vos commandes.",
          "Commandes et projets : prestations choisies, montants, brief, échanges et fichiers que vous nous transmettez. Nécessaire à l'exécution du contrat.",
          "Formulaire de contact : nom, e-mail, téléphone si renseigné, sujet et message. Utilisés pour vous répondre.",
          "Avis : nom affiché, e-mail (jamais publié), note et commentaire.",
          "Quiz et attestations : vos scores, et le nom qui figure sur l'attestation que vous obtenez.",
          "Assistant de discussion : le contenu des messages que vous lui envoyez (voir « Sous-traitants » ci-dessous).",
        ],
      },
      {
        h: "Ce que nous ne faisons pas",
        ul: [
          "Aucun outil de mesure d'audience, aucun pixel publicitaire, aucun traceur tiers n'est installé sur ce site.",
          "Nous ne construisons pas de profil publicitaire et ne faisons pas de profilage automatisé.",
          "Nous ne vendons, ne louons et n'échangeons aucune donnée personnelle.",
        ],
      },
      {
        h: "Sous-traitants",
        p: [
          "Quatre prestataires techniques traitent des données pour notre compte. Ce sont les seuls.",
        ],
        ul: [
          `Hébergement du site et de l'API : ${entity.host.name} (${entity.host.address}).`,
          "Base de données : MongoDB Atlas, où sont stockés les comptes, commandes, messages et avis.",
          "Envoi des e-mails transactionnels (vérification d'adresse, réinitialisation de mot de passe, suivi de commande) : relais SMTP Resend.",
          "Assistant de discussion : OpenAI. Les messages que vous écrivez à l'assistant lui sont transmis pour produire la réponse. N'y écrivez pas d'informations sensibles ou confidentielles.",
        ],
      },
      {
        h: "Combien de temps nous les gardons",
        ul: [
          "Compte client : tant que le compte existe, puis supprimé sur demande.",
          "Commandes et factures : conservées pour la durée légale applicable aux pièces comptables.",
          "Messages du formulaire de contact : jusqu'à trois ans après le dernier échange.",
          "Attestations : conservées tant qu'elles doivent rester vérifiables par leur référence.",
        ],
      },
      {
        h: "Vos droits",
        p: [
          "Conformément à la loi 09-08 relative à la protection des personnes physiques à l'égard " +
            "du traitement des données à caractère personnel, vous disposez d'un droit d'accès, " +
            "de rectification, d'opposition et de suppression.",
          `Pour les exercer, écrivez à ${entity.email} depuis l'adresse associée à votre compte. ` +
            "Nous répondons sous 30 jours. Vous pouvez également saisir la CNDP (Commission " +
            "Nationale de contrôle de la protection des Données à caractère Personnel).",
        ],
      },
      {
        h: "Supprimer vos données",
        p: [
          `Écrivez à ${entity.email} avec pour objet « Suppression de mes données », depuis ` +
            "l'adresse e-mail de votre compte. Nous confirmons la réception, puis nous supprimons " +
            "votre compte, vos avis, vos résultats de quiz et vos attestations.",
          "Ce qui ne peut pas être supprimé immédiatement : les pièces liées à une commande payée, " +
            "que la loi comptable impose de conserver. Elles sont alors isolées et ne servent plus " +
            "qu'à cette obligation.",
        ],
      },
      {
        h: "Âge minimum",
        p: [
          "Ce site s'adresse à des professionnels et n'est pas destiné aux enfants. La création " +
            "d'un compte est réservée aux personnes de 16 ans ou plus. Si vous constatez qu'un " +
            `compte a été créé par un mineur de moins de 16 ans, écrivez-nous à ${entity.email} ` +
            "et nous le supprimerons.",
        ],
      },
      {
        h: "Sécurité",
        p: [
          "Les mots de passe sont hachés. Les échanges avec le site sont chiffrés en HTTPS. " +
            "Le jeton qui maintient votre session est posé en cookie `httpOnly`, inaccessible aux " +
            "scripts de la page.",
        ],
      },
      {
        h: "Modifications",
        p: [
          "Toute modification de cette page est datée en haut du document. Les changements qui " +
            "touchent à la nature des données collectées vous seront signalés par e-mail si vous " +
            "avez un compte.",
        ],
      },
    ],
  },

  cookies: {
    title: "Politique de cookies",
    intro:
      "Ce site n'utilise aucun cookie publicitaire ni aucun outil de mesure d'audience. " +
      "Voici la liste complète de ce qui est déposé sur votre appareil.",
    updated: UPDATED,
    sections: [
      {
        h: "Cookie déposé par le site",
        table: {
          head: ["Nom", "Type", "À quoi il sert", "Durée"],
          rows: [
            ["token", "Cookie httpOnly", "Maintient votre session une fois connecté. Sans lui, vous seriez déconnecté à chaque page.", "Jusqu'à la déconnexion"],
          ],
        },
      },
      {
        h: "Stockage local du navigateur",
        p: [
          "Les éléments ci-dessous ne sont pas des cookies : ils restent dans votre navigateur et " +
            "ne sont jamais envoyés à un serveur tiers.",
        ],
        table: {
          head: ["Clé", "À quoi elle sert"],
          rows: [
            ["auth_token, client_token, client_user, admin_token", "Vous garder connecté à votre espace."],
            ["app_lang", "Retenir la langue que vous avez choisie."],
            ["rememberedEmail", "Pré-remplir votre e-mail sur l'écran de connexion, si vous l'avez demandé."],
          ],
        },
      },
      {
        h: "Pourquoi il n'y a pas de bandeau « accepter / refuser »",
        p: [
          "Le consentement est requis pour les traceurs qui ne sont pas strictement nécessaires : " +
            "mesure d'audience, publicité, réseaux sociaux. Ce site n'en pose aucun. Tout ce qui " +
            "précède sert soit à vous connecter, soit à retenir un choix que vous avez fait " +
            "vous-même.",
          "Un bandeau qui demanderait d'accepter des traceurs inexistants vous ferait cliquer pour " +
            "rien. Nous avons préféré une note d'information, affichée une fois, qui renvoie à " +
            "cette page. Si un outil de mesure est ajouté un jour, un vrai choix apparaîtra ici " +
            "et dans le bandeau.",
        ],
      },
      {
        h: "Supprimer ce qui est stocké",
        p: [
          "Se déconnecter supprime le cookie de session et les clés liées au compte. Vous pouvez " +
            "aussi vider le stockage du site depuis les réglages de votre navigateur, à tout " +
            "moment et sans nous le demander.",
        ],
      },
      {
        h: "Polices et images",
        p: [
          "Les polices de caractères sont chargées depuis Google Fonts, ce qui transmet votre " +
            "adresse IP à Google le temps du chargement. Aucun cookie n'est posé par ce biais. " +
            "Les photographies proviennent d'Unsplash et sont servies depuis son réseau de diffusion.",
        ],
      },
    ],
  },

  conditions: {
    title: "Conditions générales d'utilisation et de vente",
    intro:
      "Ces conditions encadrent l'utilisation de growstack.ma et les prestations commandées " +
      "par son intermédiaire.",
    updated: UPDATED,
    sections: [
      {
        h: "Objet",
        p: [
          `${entity.tradingName} propose des prestations de design graphique, de gestion de ` +
            "réseaux sociaux, de contenu UGC, de photographie, de stratégie marketing et de " +
            "développement web. Les prix affichés sur le site sont exprimés en dirhams marocains (MAD).",
        ],
      },
      {
        h: "Commande et devis",
        p: [
          "Une commande passée sur le site vaut demande de prestation. Elle devient ferme après " +
            "confirmation écrite de notre part, qui précise le périmètre, le délai et le prix final.",
          "Le prix affiché est le prix de la prestation décrite. Aucun frais de dossier, de " +
            "mise en service ou de gestion ne s'y ajoute. Si votre demande sort du périmètre " +
            "affiché, le supplément est chiffré et accepté par écrit avant que le travail commence.",
        ],
      },
      {
        h: "Paiement",
        p: [
          "Le règlement s'effectue par virement bancaire. Un acompte de 50 % est demandé à la " +
            "commande, le solde à la livraison. Aucun prélèvement automatique n'est mis en place " +
            "et aucune donnée bancaire n'est saisie ni conservée sur ce site.",
        ],
      },
      {
        h: "Délais",
        p: [
          "La plupart des projets sont livrés sous 7 à 14 jours ouvrés. Le délai exact est fixé " +
            "dans la confirmation de commande, avec ses jalons. Un délai dépendant d'éléments que " +
            "vous devez fournir court à compter de leur réception.",
        ],
      },
      {
        h: "Révisions",
        p: [
          "Chaque prestation comprend jusqu'à trois séries de modifications, comprises dans le " +
            "prix affiché. Au-delà, ou si la demande change la nature du travail, un complément " +
            "est chiffré avant d'être engagé.",
        ],
      },
      {
        h: "Propriété des livrables",
        p: [
          "Les droits sur les livrables finaux vous sont cédés au paiement intégral de la " +
            "prestation. Les fichiers sources sont remis dans les conditions prévues au devis.",
          "Les éléments sous licence tierce intégrés à un livrable (polices, photographies, " +
            "musiques) restent soumis à leur propre licence, qui vous est indiquée à la livraison.",
        ],
      },
      {
        h: "Vos obligations",
        ul: [
          "Fournir des éléments dont vous détenez les droits.",
          "Ne pas utiliser le site pour publier des contenus illicites, diffamatoires ou trompeurs.",
          "Ne pas tenter d'accéder aux espaces réservés d'un autre utilisateur.",
        ],
      },
      {
        h: "Compte et contenus publiés",
        p: [
          "La création d'un compte est réservée aux personnes de 16 ans ou plus. Vous êtes " +
            "responsable des contenus que vous publiez dans les espaces communautaires. Nous " +
            "pouvons retirer un contenu manifestement illicite et, le cas échéant, suspendre le " +
            "compte concerné.",
        ],
      },
      {
        h: "Responsabilité",
        p: [
          "Les guides et cours publiés dans la section ressources sont fournis à titre " +
            "d'information. GROWSTACK est une agence digitale, pas un organisme de formation " +
            "accrédité : les attestations délivrées à l'issue des quiz ne sont ni un diplôme ni " +
            "une certification professionnelle reconnue.",
          "Les informations relatives aux programmes de soutien publiées sur nos autres sites " +
            "sont reprises de sources officielles et datées. Elles ne remplacent pas la " +
            "vérification auprès de l'organisme concerné.",
        ],
      },
      {
        h: "Droit applicable",
        p: [
          "Ces conditions sont soumises au droit marocain. En cas de différend, les parties " +
            "chercheront une solution amiable avant toute action.",
        ],
      },
    ],
  },

  remboursement: {
    title: "Politique d'annulation et de remboursement",
    intro:
      "Ce que vous pouvez annuler, à quel moment, et ce qui vous est rendu.",
    updated: UPDATED,
    sections: [
      {
        h: "Avant le démarrage",
        p: [
          "Tant que le travail n'a pas commencé, vous pouvez annuler et l'acompte vous est " +
            "intégralement remboursé. Écrivez-nous ; la date retenue est celle de votre e-mail.",
        ],
      },
      {
        h: "Après le démarrage",
        p: [
          "Une fois le travail engagé, l'annulation donne lieu au remboursement de la part non " +
            "réalisée. Ce qui a déjà été produit vous est remis, et ce qui reste de l'acompte " +
            "vous est rendu.",
        ],
      },
      {
        h: "Si le livrable ne correspond pas à la commande",
        p: [
          "Les trois séries de révisions comprises servent d'abord à cela. Si, après ces " +
            "révisions, le livrable ne correspond toujours pas à ce qui était décrit dans la " +
            "confirmation de commande, la prestation est remboursée.",
          "Un désaccord sur un choix esthétique, lorsque le livrable est conforme à ce qui a été " +
            "commandé, relève des révisions et non du remboursement.",
        ],
      },
      {
        h: "Ce qui n'est pas remboursable",
        ul: [
          "Les prestations livrées, acceptées et utilisées.",
          "Les frais réellement engagés auprès de tiers à votre demande (impression, licence d'image, achat de police, location de matériel), lorsqu'ils ne sont pas annulables.",
          "Les ressources gratuites du site : guides, cours, quiz et attestations ne sont pas vendus.",
        ],
      },
      {
        h: "Délai et moyen",
        p: [
          "Un remboursement accepté est versé sous 14 jours, par virement, sur le compte ayant " +
            "servi au paiement. Aucun frais n'est retenu sur le montant remboursé.",
          `Pour ouvrir une demande : ${entity.email}, objet « Remboursement », en indiquant la ` +
            "référence de la commande.",
        ],
      },
    ],
  },

  "mentions-legales": {
    title: "Mentions légales",
    intro: "Qui édite ce site, qui l'héberge, et comment nous joindre.",
    updated: UPDATED,
    sections: [
      {
        h: "Éditeur du site",
        rows: [
          ["Nom commercial", entity.tradingName],
          ["Représentant", entity.founder],
          ["Directeur de la publication", entity.publicationDirector],
          ["Siège", `${entity.city}, ${entity.country}`],
          ["E-mail", entity.email],
          ["Téléphone / WhatsApp", entity.phone],
          ["Instagram", entity.instagram],
        ],
        registration: true,
      },
      {
        h: "Hébergeur",
        rows: [
          ["Société", entity.host.name],
          ["Adresse", entity.host.address],
          ["Site", entity.host.site],
        ],
      },
      {
        h: "Propriété intellectuelle",
        p: [
          "La marque GROWSTACK, le logo, les textes, les guides et les cours publiés sur ce site " +
            "en sont la propriété. Leur reproduction sans autorisation écrite n'est pas permise.",
          "Les photographies illustrant les prestations proviennent d'Unsplash et sont utilisées " +
            "selon la licence Unsplash. Les polices de caractères (Inter, Space Grotesk, " +
            "Noto Sans Arabic) sont diffusées sous SIL Open Font License 1.1. Les icônes " +
            "proviennent de Lucide, sous licence ISC.",
        ],
      },
      {
        h: "Signaler un contenu",
        p: [
          `Pour signaler un contenu publié sur ce site : ${entity.email}. Précisez l'adresse de ` +
            "la page et la raison du signalement.",
        ],
      },
    ],
  },
};

export default fr;
