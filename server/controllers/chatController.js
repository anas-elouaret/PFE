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

const STREAM_SYSTEM_PROMPT_BASE = `You are the official AI Consultant for GROWSTACK, a creative multi-service agency.

## STRICT RULES
1. ONLY answer questions about GROWSTACK's services, pricing, bundles, delivery times, processes, or how it works. Politely decline off-topic questions.
2. Respond in the user's language (French, Arabic, or English). Default to French if unclear.
3. Be warm, professional, and concise. Always suggest a relevant action or next step.
4. Respond in natural plain text. Do NOT use JSON formatting. Your response will be streamed character by character to the user.
5. If asked about pricing or packages, provide a helpful summary and offer to connect with a human agent for detailed quotes.
6. Keep responses concise (2-4 sentences typically). Be helpful but don't overwhelm.

## OFFICIAL KNOWLEDGE BASE (use this to answer accurately)
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
          text: "Désolé, notre conseiller IA n'est pas encore configuré. Contactez-nous via /contact ou par email à contact@growstack.app.",
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
      max_tokens: 600,
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

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const latestMessage = getLatestUserMessage(messages);
    const systemPrompt = buildSystemPrompt(STREAM_SYSTEM_PROMPT_BASE, latestMessage);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      stream: true,
      temperature: 0.3,
      max_tokens: 600,
    });

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
    console.error("AI Chat Stream error:", error);

    if (error.status === 429 && !res.headersSent) {
      return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
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
