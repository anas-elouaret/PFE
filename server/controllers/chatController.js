const OpenAI = require("openai");
const { retrieveContext } = require("../services/knowledgeRetriever");

const SYSTEM_PROMPT_BASE = `Tu es le Conseiller IA officiel de GROWSTACK, une agence créative multi-services.

## RÈGLES STRICTES

1. **Périmètre** — Réponds UNIQUEMENT aux questions sur les services, tarifs, bundles, délais, processus, ou fonctionnement de GROWSTACK. Pour toute question hors-sujet, réponds poliment que tu es limité aux sujets GROWSTACK.

2. **Langue** — Réponds dans la langue de l'utilisateur (Français ou Arabe). Si la langue n'est pas claire, utilise le Français.

3. **Format de réponse** — Tu DOIS répondre avec un JSON valide uniquement. Pas de markdown, pas de code blocks, pas de texte en dehors du JSON.

4. **Schéma JSON obligatoire** :
{
  "text": "Ta réponse à l'utilisateur",
  "link": { "path": "/route", "label": "Texte du bouton" }
}

5. **Règles de lien** :
- Si lien non pertinent → mets link à null
- Si l'utilisateur demande les **services, tarifs, ou ce qu'on fait** → { "path": "/services", "label": "Découvrir nos Services" }
- Si l'utilisateur demande des **exemples, travaux, portfolio, photos, créations** → { "path": "/portfolio", "label": "Voir le Portfolio" }
- Si l'utilisateur demande **commander, contacter, support, aide, démarrer un projet** → { "path": "/contact", "label": "Nous Contacter" }
- Si l'utilisateur demande **connexion, suivi de commande, compte** → { "path": "/login", "label": "Se Connecter" }
- Si l'utilisateur demande des **services d'impression** → { "path": "/printing", "label": "Services d'Impression" }
- Si l'utilisateur demande une **démo, showreel, motion design** → { "path": "/showreel", "label": "Voir notre Showreel" }

6. **Politesse et Proactivité** — Sois chaleureux, professionnel et concis. Propose toujours une action pertinente via le champ link.

## CONTEXTE OFFICIEL (à utiliser pour répondre avec précision)
{INJECTED_CONTEXT}`;

const STREAM_SYSTEM_PROMPT_BASE = `Tu es le conseiller de GROWSTACK, une agence digitale au Maroc. Tu parles à un visiteur du site qui réfléchit peut-être à un projet.

## COMMENT TU PARLES
- Comme un conseiller humain, pas comme une FAQ. Chaleureux, direct, jamais commercial à l'excès.
- La langue du visiteur : français, arabe, darija ou anglais. Par défaut le français. En darija, réponds en darija.
- Court : 2 à 4 phrases. Un visiteur sur téléphone ne lit pas un paragraphe.
- Pas de listes à puces sauf si on te demande de comparer plusieurs choses.

## MÈNE LA CONVERSATION
- Termine presque toujours par UNE question qui fait avancer : son secteur, ce qu'il vend, ce qu'il a déjà, son délai, son budget.
- Une seule question à la fois. Jamais un interrogatoire.
- Quand tu comprends son besoin, recommande les 2 ou 3 services qui y répondent et explique en une phrase pourquoi, puis invite-le à les ajouter au panier.
- S'il hésite sur le prix, rappelle la remise automatique : 10% pour 2 services, 15% pour 3, 20% pour 4 ou plus.
- S'il est prêt, oriente-le vers le formulaire de projet.

## CE QUE TU NE FAIS JAMAIS
- N'invente aucun prix, délai, chiffre, référence client ni réalisation. Si ce n'est pas dans la base de connaissances ci-dessous, dis que tu vas faire confirmer par l'équipe et propose le contact.
- Ne promets ni remboursement, ni révisions illimitées, ni moyen de paiement autre que le virement bancaire.
- Ne prétends pas avoir accès à sa commande, à son compte ou à son dossier : tu n'y as pas accès.
- Ne parle pas d'autre chose que de GROWSTACK et de son projet. Si on te demande autre chose, décline en une phrase et ramène la conversation.
- Pas de JSON, pas de markdown : du texte simple, diffusé en direct.

## CONTACT
growstackagency@gmail.com — +212 631-711680 — Instagram @ste_2m.

## BASE DE CONNAISSANCES OFFICIELLE (seule source de vérité)
{INJECTED_CONTEXT}`;

function getLatestUserMessage(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

function buildSystemPrompt(base, userMessage) {
  const context = retrieveContext(userMessage);
  return base.replace("{INJECTED_CONTEXT}", context);
}

function determineLink(text) {
  const lower = text.toLowerCase();
  const rules = [
    { keywords: ["service", "tarif", "prix", "budget", "offre", "forfait", "prestation", "combien", "coût", "cost"], path: "/services", label: "Découvrir nos Services" },
    { keywords: ["portfolio", "projet", "travail", "exemple", "réalisation", "création", "photo", "design", "ugc", "content", "web"], path: "/portfolio", label: "Voir le Portfolio" },
    { keywords: ["contact", "commander", "support", "aide", "démarrer", "devis", "rendez-vous", "recrutement", "career", "join"], path: "/contact", label: "Nous Contacter" },
    { keywords: ["connexion", "login", "compte", "suivi", "commande", "sign in"], path: "/login", label: "Se Connecter" },
    { keywords: ["impression", "printing", "print", "flyer", "carte", "business card", "packaging", "merch"], path: "/printing", label: "Services d'Impression" },
    { keywords: ["showreel", "démo", "demo", "motion", "vidéo", "video", "animation"], path: "/showreel", label: "Voir notre Showreel" },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return { path: rule.path, label: rule.label };
    }
  }
  return null;
}

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages array is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set in .env");
      return res.status(503).json({
        message: "AI service not configured",
        reply: {
          text: "Désolé, notre conseiller IA n'est pas encore configuré. Écrivez-nous à growstackagency@gmail.com ou via le formulaire de contact.",
          link: { path: "/contact", label: "Nous Contacter" },
        },
      });
    }

    const openai = new OpenAI({ apiKey });
    const latestMessage = getLatestUserMessage(messages);
    const systemPrompt = buildSystemPrompt(SYSTEM_PROMPT_BASE, latestMessage);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }

    const reply = {
      text: parsed.text || "Je n'ai pas pu formuler une réponse. Veuillez réessayer ou nous contacter directement.",
      link: parsed.link && parsed.link.path ? { path: parsed.link.path, label: parsed.link.label } : null,
    };

    res.json({ reply });
  } catch (error) {
    console.error("AI Chat error:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message: "Rate limit exceeded. Please try again later.",
        reply: {
          text: "Notre conseiller IA est momentanément surchargé. Veuillez réessayer dans quelques instants ou nous contacter directement.",
          link: { path: "/contact", label: "Nous Contacter" },
        },
      });
    }

    res.status(500).json({
      message: "AI service unavailable",
      reply: {
        text: "Notre conseiller IA est temporairement indisponible. Veuillez réessayer plus tard ou nous contacter via notre formulaire de contact.",
        link: { path: "/contact", label: "Nous Contacter" },
      },
    });
  }
};

exports.chatStream = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages array is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set in .env");
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.write(`data: ${JSON.stringify({ type: "error", text: "Désolé, notre conseiller IA n'est pas encore configuré. Contactez-nous via /contact." })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "done", link: { path: "/contact", label: "Nous Contacter" } })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    const openai = new OpenAI({ apiKey });

    const latestMessage = getLatestUserMessage(messages);
    const systemPrompt = buildSystemPrompt(STREAM_SYSTEM_PROMPT_BASE, latestMessage);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      stream: true,
      temperature: 0.6,
      max_tokens: 500,
    });

    // The event-stream headers go out only once the model has accepted the
    // request. Set earlier, a refusal (no quota, bad key) was answered with a
    // JSON body under a text/event-stream content type.
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    let fullText = "";

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) {
        fullText += delta;
        res.write(`data: ${JSON.stringify({ type: "chunk", text: delta })}\n\n`);
      }
    }

    const link = determineLink(fullText);
    res.write(`data: ${JSON.stringify({ type: "done", link })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    // An exhausted quota is a billing state, not a bug, and it is worth
    // seeing at a glance in the logs: the assistant is down site-wide until
    // the OpenAI account is topped up.
    const quotaExhausted =
      error?.code === "insufficient_quota" || error?.error?.type === "insufficient_quota";
    if (quotaExhausted) {
      console.error("AI Chat Stream: OpenAI quota exhausted — the assistant is unavailable.");
    } else {
      console.error("AI Chat Stream error:", error);
    }

    if (!res.headersSent && (error.status === 429 || quotaExhausted)) {
      return res.status(503).json({
        message: quotaExhausted ? "ai_quota_exhausted" : "ai_rate_limited",
      });
    }

    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: "error", text: "Une erreur est survenue lors de la génération de la réponse." })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    } else {
      res.status(500).json({ message: "AI service unavailable" });
    }
  }
};
