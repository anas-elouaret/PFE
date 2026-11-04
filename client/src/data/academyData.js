/**
 * GROWSTACK Academy — the twelve-course path.
 *
 * Imported from the catalogue PDF Anas supplied (Version 1.0, 12 cours,
 * 36 leçons). The text is his; it is transcribed, not rewritten. The quiz
 * answers live on the server in server/data/quizzes.json and never reach the
 * browser, like every other quiz on the site.
 */
export const courses = [
  {
    number: 1,
    slug: "les-fondamentaux-de-lentrepreneuriat",
    title: "Les fondamentaux de l’entrepreneuriat",
    level: "Débutant",
    duration: "3 à 4 heures",
    objective: "Comprendre le rôle de l’entrepreneur, reconnaître une opportunité et transformer une intuition en problème à résoudre.",
    lessons: [
      {
        title: "Comprendre l’entrepreneuriat",
        paragraphs: [
          "L’entrepreneuriat consiste à identifier un besoin, concevoir une réponse utile et organiser les ressources nécessaires pour la proposer à des clients. Créer une entreprise n’est donc pas seulement déposer un nom ou ouvrir une page sur les réseaux sociaux : c’est construire une activité qui apporte une valeur reconnue et qui peut fonctionner dans la durée.",
          "Un entrepreneur avance dans l’incertitude. Il formule des hypothèses, les confronte au terrain, apprend des retours et adapte son offre. Il n’a pas besoin d’avoir toutes les réponses au départ ; il doit surtout savoir observer, décider et apprendre rapidement.",
        ],
        practice: "Exemple : au lieu de décider qu’un café culturel plaira forcément, interrogez des habitants, observez les lieux existants et testez un événement pilote avant de signer un bail.",
      },
      {
        title: "Devenir entrepreneur : posture et compétences",
        paragraphs: [
          "Les compétences utiles se développent : écoute client, communication, vente, gestion du temps, négociation, organisation et lecture des chiffres. La discipline compte davantage qu’une motivation constante. Une routine simple — définir trois priorités, suivre les actions et faire un bilan hebdomadaire — aide à transformer une idée en progrès mesurable.",
          "Il faut distinguer le risque calculé du pari aveugle. Un risque calculé est identifié, limité et suivi. Par exemple, tester dix commandes avant d’acheter un stock important réduit l’argent immobilisé et révèle les attentes réelles.",
        ],
        practice: "Exercice : listez trois compétences que vous possédez déjà, deux à acquérir et une personne ou ressource qui pourrait vous aider.",
      },
      {
        title: "Passer de l’idée au problème",
        paragraphs: [
          "Une idée n’est pas encore une opportunité. Une opportunité apparaît lorsqu’un groupe de personnes rencontre un problème suffisamment fréquent ou coûteux et accepte de payer, de changer d’habitude ou de consacrer du temps à une solution. Décrivez le problème avant de décrire votre produit.",
          "Utilisez cette phrase : « Pour [type de personne], qui rencontre [problème] dans [situation], nous proposons [solution] afin d’obtenir [résultat]. » Si la phrase reste vague, votre cible ou votre problème doit être précisé.",
        ],
        practice: "Exercice : rédigez trois problèmes observés dans votre ville, votre secteur ou votre entourage. Pour chacun, indiquez qui le rencontre, à quelle fréquence et comment il le résout aujourd’hui.",
      },
    ],
    caseStudy: "Une petite marque de vêtements reçoit des messages Instagram mais perd des commandes parce que les tailles, les prix et les délais ne sont pas clairement présentés. Le problème prioritaire n’est peut-être pas un nouveau logo : c’est un parcours de commande simple et fiable.",
    assignment: "Rédigez une fiche d’opportunité d’une page : public concerné, problème, fréquence, solutions actuelles, conséquences et première hypothèse de solution.",
    deliverable: "Fiche d’opportunité et problème client",
  },
  {
    number: 2,
    slug: "trouver-et-valider-une-idee-rentable",
    title: "Trouver et valider une idée rentable",
    level: "Débutant",
    duration: "4 heures",
    objective: "Générer des idées à partir de besoins réels, choisir une cible et vérifier l’intérêt avant d’investir.",
    lessons: [
      {
        title: "Observer les besoins du marché",
        paragraphs: [
          "Les bonnes idées viennent souvent de problèmes répétitifs : perte de temps, coût trop élevé, manque de confiance, accès difficile ou expérience frustrante. Observez les avis clients, les questions récurrentes, les groupes communautaires et les tâches que les gens bricolent eux-mêmes. Notez les faits, sans conclure trop vite.",
          "Classez les problèmes selon quatre critères : intensité, fréquence, nombre de personnes concernées et solutions déjà utilisées. Un problème fréquent mais peu gênant peut être moins intéressant qu’un problème rare mais très coûteux.",
        ],
        practice: "Exercice : pendant une journée, notez dix irritants vécus par des particuliers ou professionnels. Ne proposez aucune solution à ce stade.",
      },
      {
        title: "Définir une cible précise",
        paragraphs: [
          "« Tout le monde » n’est pas une cible exploitable. Définissez un segment par situation, besoin, comportement, zone géographique et capacité à acheter. Une cible précise facilite le choix du prix, du canal de communication et du message commercial.",
          "Construisez un profil client fondé sur des observations : rôle, objectifs, difficultés, critères de décision, objections et solutions actuelles. Évitez les portraits imaginaires remplis de détails sans utilité commerciale.",
        ],
        practice: "Exemple : « salons de beauté indépendants de Casablanca qui publient régulièrement mais ne disposent pas d’un système de réservation en ligne » est plus actionnable que « les entreprises marocaines ».",
      },
      {
        title: "Valider avant de construire",
        paragraphs: [
          "La validation consiste à rechercher des preuves d’intérêt. Les entretiens exploratoires servent à comprendre le comportement passé : « Racontez-moi la dernière fois que… ». Une page de présentation, une démonstration ou une précommande clairement annoncée peuvent ensuite mesurer l’intention d’agir.",
          "Ne demandez pas seulement « aimez-vous mon idée ? ». Les compliments sont faciles et ne prouvent pas une demande. Cherchez des signaux concrets : rendez-vous accepté, demande de devis, inscription qualifiée, acompte ou commande selon le contexte.",
        ],
        practice: "Exercice : réalisez cinq entretiens avec des personnes de votre cible, consignez les mots exacts et les preuves observées. Ne présentez pas votre solution pendant les premières minutes.",
      },
    ],
    caseStudy: "Avant de développer une application de réservation pour salons, un porteur de projet interroge cinq gérants, observe leur prise de rendez-vous et teste un formulaire simple. Il découvre que les absences non confirmées sont leur douleur principale.",
    assignment: "Créez un plan de validation sur sept jours : hypothèse, personnes à rencontrer, questions neutres, test le moins coûteux, indicateur et seuil de décision.",
    deliverable: "Plan de validation et profil cible",
  },
  {
    number: 3,
    slug: "etude-de-marche-et-analyse-concurrentielle",
    title: "Étude de marché et analyse concurrentielle",
    level: "Débutant à intermédiaire",
    duration: "5 heures",
    objective: "Estimer le marché accessible, comprendre les alternatives et identifier un positionnement différenciant.",
    lessons: [
      {
        title: "Délimiter son marché",
        paragraphs: [
          "Une étude de marché cherche à comprendre les clients, la demande, l’offre, les prix, les tendances et les contraintes. Délimitez le marché par catégorie de besoin, zone géographique et type de client. Distinguez le marché théorique du marché réellement accessible avec vos moyens.",
          "Une estimation ascendante est souvent plus utile : nombre de clients potentiels accessibles × fréquence d’achat × panier moyen. Écrivez chaque hypothèse et indiquez sa source. Une estimation n’est pas une certitude ; elle doit pouvoir être corrigée.",
        ],
        practice: "Exemple : 120 commerces ciblés dans une zone × 10 % de conversion annuelle × 3 000 DH de panier annuel = 36 000 DH de chiffre d’affaires annuel potentiel selon ces hypothèses.",
      },
      {
        title: "Étudier les concurrents et alternatives",
        paragraphs: [
          "Vos concurrents ne sont pas uniquement les entreprises qui vendent le même produit. Les clients peuvent choisir une solution artisanale, un outil gratuit, un employé interne ou ne rien faire. Comparez les offres, les prix affichés, les délais, la qualité perçue, les avis et les garanties.",
          "Utilisez une matrice simple : acteur, cible, promesse, offre, prix, canal, forces, limites et preuves. Ne recopiez pas leur communication ; cherchez les besoins mal servis et les critères importants pour votre segment.",
        ],
        practice: "Exercice : analysez cinq concurrents directs et trois alternatives indirectes à partir d’informations publiques et d’entretiens.",
      },
      {
        title: "Choisir un positionnement",
        paragraphs: [
          "Le positionnement explique pourquoi un client devrait choisir votre offre plutôt qu’une autre. Il peut reposer sur la spécialisation, la proximité, la rapidité, l’accompagnement, la simplicité, la qualité ou une expérience particulière. Il doit être crédible et important pour la cible.",
          "Une proposition de valeur claire répond à trois questions : pour qui ? quel résultat ? pourquoi votre approche est-elle pertinente ? Évitez les promesses vagues comme « meilleure qualité » sans preuve observable.",
        ],
        practice: "Exercice : écrivez trois versions de votre proposition de valeur, puis demandez à cinq personnes de votre cible ce qu’elles comprennent et ce qui leur paraît crédible.",
      },
    ],
    caseStudy: "Une agence digitale généraliste remarque que les nouveaux commerces ont surtout besoin d’un lancement coordonné : identité visuelle, photos produits et page de commande. Elle se positionne sur le lancement digital des nouvelles marques plutôt que sur « tous les services pour tous ».",
    assignment: "Produisez une mini-étude de marché de 3 à 5 pages avec segment, méthode, taille accessible, concurrents, alternatives, prix observés, risques et conclusion.",
    deliverable: "Mini-étude de marché et matrice concurrentielle",
  },
  {
    number: 4,
    slug: "business-model-canvas",
    title: "Business Model Canvas",
    level: "Débutant à intermédiaire",
    duration: "4 heures",
    objective: "Décrire comment l’entreprise crée, délivre et capture de la valeur à l’aide des neuf blocs du Canvas.",
    lessons: [
      {
        title: "Comprendre les neuf blocs",
        paragraphs: [
          "Le Business Model Canvas synthétise neuf éléments : segments clients, proposition de valeur, canaux, relations clients, revenus, ressources clés, activités clés, partenaires clés et structure de coûts. Il permet de visualiser les liens entre la promesse faite au client et les moyens nécessaires pour la tenir.",
          "Commencez par le segment et la proposition de valeur, puis précisez comment atteindre et servir les clients. Complétez ensuite les revenus, les ressources, les activités, les partenaires et les coûts. Le Canvas est une hypothèse de travail, pas une preuve de rentabilité.",
        ],
        practice: "Exercice : remplissez une première version avec des notes courtes. Une idée par note, sans chercher une formulation parfaite.",
      },
      {
        title: "Relier les blocs entre eux",
        paragraphs: [
          "Chaque bloc doit être cohérent avec les autres. Une offre premium exige des ressources et une expérience compatibles. Un canal de vente coûteux doit être cohérent avec la marge. Une relation très personnalisée limite parfois le nombre de clients servis.",
          "Testez la cohérence en racontant le parcours : le client découvre l’offre, comprend sa valeur, achète, reçoit le service, obtient un résultat et revient ou recommande. Repérez les ruptures et les coûts cachés.",
        ],
        practice: "Exemple : une prestation photo vendue à bas prix avec déplacements longs et retouches illimitées peut être déficitaire, même si les ventes augmentent.",
      },
      {
        title: "Tester et faire évoluer le modèle",
        paragraphs: [
          "Attribuez à chaque bloc une hypothèse et un niveau de confiance. Les hypothèses les plus risquées sont souvent celles qui concernent la volonté de payer, l’accès aux clients, la fréquence d’achat et le coût réel de livraison.",
          "Testez d’abord les hypothèses qui peuvent invalider le modèle. Après chaque test, conservez ce qui est confirmé, modifiez ce qui est infirmé et notez la date et la preuve. Le Canvas évolue avec l’apprentissage.",
        ],
        practice: "Exercice : sélectionnez trois hypothèses critiques et concevez un test peu coûteux pour chacune.",
      },
    ],
    caseStudy: "Un studio de podcast peut gagner de l’argent par la location à l’heure, la production complète, le montage à distance ou des abonnements. Chaque modèle implique une relation client, des ressources et un taux d’occupation différents.",
    assignment: "Remplissez les neuf blocs, marquez les trois hypothèses les plus risquées et ajoutez pour chacune une expérience de validation.",
    deliverable: "Business Model Canvas rempli",
  },
  {
    number: 5,
    slug: "construire-un-business-plan",
    title: "Construire un Business Plan",
    level: "Intermédiaire",
    duration: "6 heures",
    objective: "Structurer un dossier cohérent présentant le projet, le marché, la stratégie, l’équipe et les prévisions financières.",
    lessons: [
      {
        title: "Présenter le projet et son équipe",
        paragraphs: [
          "Le résumé exécutif présente en une page le problème, la solution, la cible, le modèle économique, l’avancement, l’équipe et le besoin éventuel de financement. Il se rédige généralement à la fin, lorsque les choix sont stabilisés.",
          "La présentation du porteur de projet doit relier les compétences, les expériences et les responsabilités aux besoins du projet. Identifiez aussi les compétences manquantes et les moyens de les couvrir : formation, recrutement, partenaire ou prestataire.",
        ],
        practice: "Exercice : rédigez un résumé de 150 à 250 mots sans superlatifs ni promesses non vérifiées.",
      },
      {
        title: "Décrire le marché et la stratégie commerciale",
        paragraphs: [
          "Le Business Plan doit montrer comment les clients seront acquis et servis. Décrivez les segments prioritaires, les canaux, le processus de vente, le prix, les objectifs commerciaux et les indicateurs. Reliez chaque objectif à une capacité réelle de prospection et de production.",
          "Présentez les concurrents et les risques avec honnêteté. Une analyse crédible reconnaît les obstacles et explique les réponses prévues. Distinguez les données vérifiées, les estimations et les hypothèses.",
        ],
        practice: "Exercice : construisez un plan commercial de 90 jours avec actions hebdomadaires, volume de prospects, rendez-vous, devis et ventes visées.",
      },
      {
        title: "Construire des prévisions cohérentes",
        paragraphs: [
          "Les prévisions doivent découler d’hypothèses explicites : nombre de ventes, panier moyen, saisonnalité, capacité, délais de paiement et coûts. Le chiffre d’affaires prévisionnel est généralement calculé par nombre de ventes × prix moyen, en détaillant les catégories si nécessaire.",
          "Ne confondez pas chiffre d’affaires, marge, bénéfice et trésorerie. Une vente facturée n’est pas nécessairement encaissée immédiatement. Intégrez les investissements, charges, impôts et décalages de paiement selon votre situation et faites vérifier les obligations locales par un professionnel compétent.",
        ],
        practice: "Exercice : préparez trois scénarios — prudent, central et ambitieux — et expliquez ce qui doit se produire pour atteindre chacun.",
      },
    ],
    caseStudy: "Un dossier annonce 12 ventes mensuelles mais ne prévoit ni le temps de production ni les coûts de sous-traitance. Le prévisionnel doit être corrigé : la capacité opérationnelle doit soutenir les ventes annoncées.",
    assignment: "Réalisez un Business Plan synthétique : résumé, offre, marché, concurrence, marketing, organisation, risques, besoins et prévisions sur 12 mois.",
    deliverable: "Business Plan synthétique",
  },
  {
    number: 6,
    slug: "finance-budget-et-tresorerie",
    title: "Finance, budget et trésorerie",
    level: "Débutant à intermédiaire",
    duration: "5 heures",
    objective: "Comprendre les principaux indicateurs financiers, fixer un prix cohérent et anticiper les besoins de trésorerie.",
    lessons: [
      {
        title: "Comprendre les chiffres essentiels",
        paragraphs: [
          "Le chiffre d’affaires mesure les ventes. Les coûts variables évoluent avec le volume vendu ; les coûts fixes restent relativement stables sur une période donnée. La marge sur coûts variables correspond au chiffre d’affaires diminué des coûts variables. Le résultat tient compte des charges de la période selon les règles comptables applicables.",
          "Suivez séparément les ventes facturées, les sommes encaissées et les dépenses payées. Cette distinction permet de voir pourquoi une entreprise peut afficher des ventes mais manquer de liquidités.",
        ],
        practice: "Exercice : classez vos dépenses en coûts fixes, variables, investissements et dépenses ponctuelles.",
      },
      {
        title: "Fixer un prix et calculer le seuil de rentabilité",
        paragraphs: [
          "Un prix doit tenir compte de la valeur perçue, des prix alternatifs, des coûts, du temps de travail et de la marge nécessaire. Le coût complet inclut les coûts directs et une part des frais indirects. Vendre en dessous de son coût réel peut créer une activité très occupée mais non viable.",
          "Dans un modèle simplifié, le seuil de rentabilité en unités = coûts fixes ÷ marge sur coût variable unitaire. Si les coûts fixes mensuels sont de 6 000 DH et la marge par vente de 600 DH, il faut 10 ventes pour couvrir ces coûts, avant autres éléments non inclus dans le modèle.",
        ],
        practice: "Exercice : calculez le coût réel d’une prestation, votre prix plancher et le nombre de ventes nécessaire pour couvrir les charges.",
      },
      {
        title: "Piloter la trésorerie",
        paragraphs: [
          "La trésorerie suit les entrées et sorties d’argent à leurs dates réelles. Préparez un plan mensuel avec solde initial, encaissements attendus, décaissements prévus et solde final. Prévoyez les retards de paiement, les achats de stock, les acomptes et les périodes creuses.",
          "Des habitudes simples réduisent les tensions : demander un acompte lorsque c’est adapté, formaliser les échéances, relancer les factures, limiter les stocks dormants et garder une réserve. Les obligations fiscales et sociales dépendent du statut et doivent être vérifiées auprès des organismes compétents.",
        ],
        practice: "Exercice : construisez un tableau de trésorerie sur 13 semaines et repérez le montant minimum nécessaire.",
      },
    ],
    caseStudy: "Une agence vend une prestation 2 000 DH, mais oublie les heures de préparation, les déplacements et les retouches. Le prix doit être revu à partir du coût complet et de la marge souhaitée.",
    assignment: "Créez un budget de démarrage, une grille de prix, un calcul de seuil de rentabilité et un plan de trésorerie.",
    deliverable: "Budget, prix et plan de trésorerie",
  },
  {
    number: 7,
    slug: "marketing-strategique-et-acquisition-clients",
    title: "Marketing stratégique et acquisition clients",
    level: "Débutant à intermédiaire",
    duration: "5 heures",
    objective: "Construire une stratégie marketing simple, choisir les bons canaux et mesurer l’acquisition.",
    lessons: [
      {
        title: "Définir objectifs et message",
        paragraphs: [
          "Une stratégie marketing commence par un objectif mesurable : générer des demandes qualifiées, augmenter les ventes, faire connaître une offre précise ou fidéliser les clients. Un objectif comme « être plus visible » doit être traduit en indicateurs et en période.",
          "Le message doit relier le problème du client, le résultat proposé et une preuve. Adaptez le message à chaque segment. Une communication efficace parle d’abord de la situation du client plutôt que de la liste de fonctionnalités de l’entreprise.",
        ],
        practice: "Exercice : formulez un objectif SMART et trois messages adaptés à trois segments.",
      },
      {
        title: "Choisir les canaux d’acquisition",
        paragraphs: [
          "Les canaux peuvent être organiques, payants, directs ou partenaires : référencement, contenu, réseaux sociaux, prospection, événements, recommandations, publicité et partenariats. Le meilleur canal dépend du comportement de la cible, du panier moyen, du cycle de vente et des ressources disponibles.",
          "Testez peu de canaux à la fois. Définissez un budget, une durée et un indicateur avant de lancer une action. Comparez le coût par prospect qualifié, le taux de conversion et la valeur générée, pas seulement les vues.",
        ],
        practice: "Exemple : une prestation B2B à forte valeur peut nécessiter une prospection ciblée et des rendez-vous, tandis qu’un produit visuel peut mieux se prêter à des démonstrations courtes.",
      },
      {
        title: "Construire un parcours de conversion",
        paragraphs: [
          "Le parcours comprend découverte, intérêt, évaluation, achat et fidélisation. À chaque étape, identifiez la question du prospect et l’action suivante : consulter une page, demander un devis, réserver un appel, payer ou recommander.",
          "Une page d’offre doit expliquer la cible, le bénéfice, le contenu, le prix ou la méthode de devis, les preuves, les conditions et l’appel à l’action. Réduisez les frictions : formulaire court, réponse rapide, informations claires et suivi des demandes.",
        ],
        practice: "Exercice : dessinez le parcours d’un prospect depuis son premier contact jusqu’à la recommandation.",
      },
    ],
    caseStudy: "Une campagne génère 5 000 vues mais seulement deux demandes. Le problème peut venir du ciblage, du message, de l’offre ou de la page de destination. Il faut analyser chaque étape avant d’augmenter le budget.",
    assignment: "Préparez un plan marketing de 30 jours avec cible, promesse, trois canaux maximum, calendrier, budget, KPI et règles d’ajustement.",
    deliverable: "Plan marketing de 30 jours",
  },
  {
    number: 8,
    slug: "branding-et-identite-de-marque",
    title: "Branding et identité de marque",
    level: "Débutant à intermédiaire",
    duration: "4 heures",
    objective: "Définir une marque cohérente, reconnaissable et crédible, au-delà du simple logo.",
    lessons: [
      {
        title: "Construire la plateforme de marque",
        paragraphs: [
          "Une marque est l’ensemble des perceptions et expériences associées à une entreprise. Sa plateforme clarifie mission, vision, valeurs, cible, personnalité, promesse et preuves. Elle sert de référence pour les décisions et la communication.",
          "Les valeurs doivent se traduire en comportements observables. « Proximité » peut signifier répondre dans un délai défini ; « transparence » peut signifier expliquer les prix et les limites. Une valeur non visible dans l’expérience reste un mot décoratif.",
        ],
        practice: "Exercice : écrivez une plateforme de marque d’une page avec une promesse et trois preuves.",
      },
      {
        title: "Créer une identité visuelle cohérente",
        paragraphs: [
          "L’identité visuelle regroupe logo, couleurs, typographies, iconographie, photographie, mise en page et règles d’utilisation. Elle doit être lisible sur différents supports, accessible et adaptée au contexte de la marque.",
          "Le logo n’est qu’un élément du système. Vérifiez les versions horizontale, verticale, monochrome et réduite. Testez les contrastes, la lisibilité mobile et les usages réels : facture, emballage, profil social, site et présentation.",
        ],
        practice: "Exercice : créez un mini moodboard et un guide de cinq règles visuelles. Vérifiez les droits des polices, images et éléments utilisés.",
      },
      {
        title: "Déployer l’expérience de marque",
        paragraphs: [
          "La cohérence se construit à chaque point de contact : réponse WhatsApp, devis, emballage, livraison, service après-vente et contenu social. Une promesse de qualité doit être confirmée par le produit et le service.",
          "Préparez des modèles réutilisables : signature, devis, présentation, publications et réponses fréquentes. Documentez les règles pour que plusieurs personnes puissent communiquer sans déformer la marque.",
        ],
        practice: "Exercice : auditez cinq points de contact et notez les incohérences entre la promesse et l’expérience.",
      },
    ],
    caseStudy: "Une marque annonce un service premium mais répond tardivement, utilise des visuels incohérents et ne précise pas ses conditions. L’expérience contredit le positionnement, même si le logo est réussi.",
    assignment: "Livrez une plateforme de marque, un moodboard, les règles du logo, la palette, les typographies et trois exemples d’application.",
    deliverable: "Plateforme et mini-guide de marque",
  },
  {
    number: 9,
    slug: "vente-negociation-et-relation-client",
    title: "Vente, négociation et relation client",
    level: "Débutant à intermédiaire",
    duration: "5 heures",
    objective: "Structurer une conversation commerciale, présenter une offre, traiter les objections et fidéliser.",
    lessons: [
      {
        title: "Prospecter et qualifier",
        paragraphs: [
          "La prospection consiste à identifier des personnes susceptibles d’avoir le besoin, puis à ouvrir une conversation pertinente. La qualification vérifie le problème, l’urgence, le budget indicatif, le décideur, le calendrier et les critères de choix.",
          "Personnalisez le premier contact avec un élément réel et utile. Évitez les messages massifs sans contexte. Enregistrez les échanges dans un tableau ou CRM avec prochaine action et date de relance.",
        ],
        practice: "Exercice : établissez une liste de 20 prospects correspondant à votre cible et rédigez deux approches personnalisées.",
      },
      {
        title: "Présenter une offre et traiter les objections",
        paragraphs: [
          "Une bonne présentation reprend d’abord le besoin compris, puis relie chaque élément de l’offre à un résultat. Précisez livrables, délais, responsabilités, exclusions, prix, modalités et prochaines étapes.",
          "Une objection est une information à clarifier, pas une attaque. Écoutez, reformulez, posez une question et répondez avec une preuve ou une option. Si le budget est insuffisant, ajustez le périmètre plutôt que de promettre la même prestation à perte.",
        ],
        practice: "Exercice : préparez des réponses honnêtes aux objections « trop cher », « je dois réfléchir » et « votre concurrent propose moins cher ».",
      },
      {
        title: "Négocier et fidéliser",
        paragraphs: [
          "La négociation porte sur plusieurs variables : prix, périmètre, délais, volume, paiement, accompagnement et durée. Ne concédez pas sans contrepartie. Une remise peut être liée à un engagement, un volume ou une réduction du périmètre.",
          "Après la vente, confirmez les engagements par écrit, donnez de la visibilité sur les étapes et demandez un retour à la livraison. La fidélisation repose sur la fiabilité, la résolution des problèmes et la valeur continue, pas sur des relances insistantes.",
        ],
        practice: "Exercice : créez un modèle de proposition commerciale, un script de découverte et un protocole de suivi après livraison.",
      },
    ],
    caseStudy: "Un client demande une remise de 30 % sans réduire le travail. Le commercial propose plutôt une version essentielle avec moins de livrables, tout en conservant une qualité maîtrisée.",
    assignment: "Simulez un entretien de vente : découverte, reformulation, proposition, objection, négociation et confirmation écrite.",
    deliverable: "Script commercial et proposition",
  },
  {
    number: 10,
    slug: "entrepreneuriat-digital-et-presence-en-ligne",
    title: "Entrepreneuriat digital et présence en ligne",
    level: "Débutant",
    duration: "4 heures",
    objective: "Choisir des outils numériques utiles et concevoir un parcours digital adapté à l’activité.",
    lessons: [
      {
        title: "Choisir un modèle digital",
        paragraphs: [
          "Un projet digital peut vendre un service en ligne, un produit e-commerce, un abonnement, une formation, une place de marché ou un logiciel. Le choix dépend du problème, de la fréquence d’usage, du coût de livraison et de la capacité à attirer des clients.",
          "Ne commencez pas par construire une application complexe si un formulaire, une page de présentation ou un outil existant permet de tester la demande. Le numérique est un moyen de servir le client, pas une fin en soi.",
        ],
        practice: "Exercice : comparez trois modèles possibles selon valeur client, coût initial, complexité et délai de test.",
      },
      {
        title: "Construire une présence digitale utile",
        paragraphs: [
          "Une présence en ligne peut inclure site web, fiche établissement, réseaux sociaux, catalogue, messagerie et email. Chaque canal doit avoir un rôle précis. Une page d’accueil doit expliquer rapidement ce que vous proposez, à qui, pourquoi vous êtes crédible et comment vous contacter.",
          "Prévoyez une expérience mobile, des informations à jour, des formulaires fonctionnels, des politiques de confidentialité adaptées et des moyens de contact clairs. Sécurisez les comptes avec des mots de passe uniques et l’authentification multifacteur.",
        ],
        practice: "Exercice : auditez votre présence digitale sur mobile et testez chaque lien, formulaire et appel à l’action.",
      },
      {
        title: "Mesurer et améliorer",
        paragraphs: [
          "Les outils d’analyse aident à comprendre les visites, les sources, les demandes et les conversions. Choisissez peu d’indicateurs utiles : visiteurs qualifiés, taux de contact, taux de conversion, panier moyen, coût d’acquisition et réachat.",
          "Collectez uniquement les données nécessaires, informez les utilisateurs de manière appropriée et respectez les règles applicables. Une hausse du trafic n’est pas un succès si elle ne produit aucune demande pertinente.",
        ],
        practice: "Exercice : créez un tableau de bord hebdomadaire avec cinq indicateurs et une décision associée à chaque indicateur.",
      },
    ],
    caseStudy: "Une boutique reçoit beaucoup de visites Instagram mais peu de commandes. Un lien vers un catalogue clair, des frais de livraison visibles et un processus de commande simplifié peuvent être plus utiles qu’une nouvelle plateforme complexe.",
    assignment: "Réalisez une maquette de page d’offre, un parcours de commande et un tableau de bord de cinq KPI.",
    deliverable: "Maquette de parcours digital et tableau de bord",
  },
  {
    number: 11,
    slug: "cadre-juridique-et-demarches-de-creation-au-maroc",
    title: "Cadre juridique et démarches de création au Maroc",
    level: "Sensibilisation",
    duration: "4 heures",
    objective: "Identifier les principales décisions administratives et juridiques à vérifier avant de lancer une activité au Maroc.",
    lessons: [
      {
        title: "Choisir une forme adaptée",
        paragraphs: [
          "Le choix du statut dépend de l’activité, du chiffre d’affaires envisagé, des risques, des associés, des obligations et du développement attendu. Au Maroc, plusieurs formes existent, notamment l’auto-entrepreneur et les sociétés commerciales. Elles n’offrent pas les mêmes règles ni les mêmes responsabilités.",
          "Ne choisissez pas un statut uniquement parce qu’il est simple ou populaire. Vérifiez l’éligibilité de l’activité, les plafonds applicables, les obligations déclaratives, la fiscalité, la protection sociale et les conséquences en cas de dépassement ou de changement d’activité.",
        ],
        practice: "Exercice : préparez une liste de questions à poser à un comptable, au CRI ou aux organismes officiels avant de choisir.",
      },
      {
        title: "Préparer les démarches et documents",
        paragraphs: [
          "Selon la forme et l’activité, les démarches peuvent impliquer l’identification, l’immatriculation, les déclarations fiscales, les autorisations sectorielles, les contrats et les obligations sociales. Les procédures évoluent : utilisez les portails officiels et confirmez les exigences en vigueur au moment de la création.",
          "Préparez un dossier organisé : identité des fondateurs, adresse de domiciliation, description de l’activité, répartition du capital si société, justificatifs et documents demandés par l’organisme compétent. Ne publiez pas de données personnelles ou documents sensibles sur une page publique.",
        ],
        practice: "Exercice : créez une checklist de démarches à confirmer pour votre activité et votre ville.",
      },
      {
        title: "Protéger les relations et les actifs",
        paragraphs: [
          "Formalisez les relations avec clients, fournisseurs, associés et prestataires : périmètre, prix, paiement, délais, propriété intellectuelle, confidentialité, résiliation et traitement des litiges. Un accord écrit réduit les malentendus.",
          "Vérifiez les droits sur les marques, images, musiques, polices, logiciels et contenus utilisés. Pour les données personnelles, renseignez-vous sur les obligations applicables au Maroc, notamment auprès de la CNDP lorsque nécessaire. Ce cours est informatif et ne remplace pas un conseil juridique ou comptable.",
        ],
        practice: "Exercice : identifiez les trois risques juridiques majeurs de votre activité et les documents ou avis professionnels nécessaires.",
      },
    ],
    caseStudy: "Un entrepreneur utilise des photos trouvées en ligne dans une publicité. Même si elles sont faciles à télécharger, leur usage commercial peut nécessiter une licence ou une autorisation. Il doit utiliser des ressources autorisées et conserver les preuves.",
    assignment: "Construisez une checklist juridique personnalisée : statut, activité autorisée, immatriculation, fiscalité, contrats, propriété intellectuelle, données et assurances éventuelles.",
    deliverable: "Checklist juridique à faire vérifier",
  },
  {
    number: 12,
    slug: "lancer-gerer-et-developper-une-startup",
    title: "Lancer, gérer et développer une startup",
    level: "Intermédiaire",
    duration: "5 heures",
    objective: "Organiser les premières étapes du lancement, suivre les performances et préparer une croissance maîtrisée.",
    lessons: [
      {
        title: "Préparer un lancement maîtrisé",
        paragraphs: [
          "Un lancement doit être préparé autour d’une offre compréhensible, d’un processus de vente, d’une capacité de livraison et d’un service client. Définissez ce qui doit être prêt, ce qui peut attendre et les risques qui empêcheraient de servir les premiers clients.",
          "Un lancement pilote avec un groupe limité permet de repérer les problèmes avant une communication plus large. Fixez une période, un nombre de clients, des critères de réussite et une méthode de collecte des retours.",
        ],
        practice: "Exercice : préparez une checklist de lancement à J-30, J-7, J-1 et J+7.",
      },
      {
        title: "Organiser les opérations et l’équipe",
        paragraphs: [
          "Documentez les processus répétitifs : réception d’une demande, devis, paiement, production, contrôle qualité, livraison et suivi. Un processus simple rend la qualité plus régulière et facilite la délégation.",
          "Définissez les responsabilités et les décisions autorisées. Pour une petite équipe, un tableau clair des tâches, responsables, échéances et statuts peut suffire. Suivez la charge réelle afin de ne pas vendre plus que la capacité de production.",
        ],
        practice: "Exercice : cartographiez un processus de bout en bout et identifiez deux tâches à automatiser ou simplifier.",
      },
      {
        title: "Mesurer la croissance et décider",
        paragraphs: [
          "La croissance saine associe demande, marge, trésorerie, qualité et capacité opérationnelle. Suivez quelques KPI adaptés : revenus récurrents si pertinents, marge, coût d’acquisition, rétention, satisfaction, délai de livraison et trésorerie disponible.",
          "Avant de recruter, ouvrir une nouvelle zone ou augmenter les dépenses publicitaires, vérifiez que le modèle fonctionne de manière répétable. La croissance peut aussi venir de la fidélisation, de l’amélioration du panier moyen ou de la réduction des pertes.",
        ],
        practice: "Exercice : créez un tableau de bord mensuel et choisissez trois décisions possibles selon les résultats.",
      },
    ],
    caseStudy: "Une startup double ses commandes après une campagne mais accumule les retards et les remboursements. La priorité n’est pas d’augmenter encore la publicité : elle doit stabiliser les opérations et la qualité.",
    assignment: "Élaborez un plan 90 jours : lancement pilote, objectifs commerciaux, capacité, rôles, KPI, risques et critères de passage à l’échelle.",
    deliverable: "Plan de lancement et tableau de pilotage",
  },
];

export function getCourse(slug) {
  return courses.find((c) => c.slug === slug) || null;
}

export const courseLevels = [...new Set(courses.map((c) => c.level))];
