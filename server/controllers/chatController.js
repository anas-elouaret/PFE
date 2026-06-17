const OpenAI = require("openai");

const SYSTEM_PROMPT = `Tu es le Conseiller IA officiel de GROWSTACK, une agence créative multi-services spécialisée dans :

- **UGC & Content Creation** (TikTok, Reels, Product Reviews, Unboxing)
- **Photographie** (Product, Event, E-commerce, Fashion, Real Estate)
- **Web Development** (Sites conversion-led, Web Apps, SEO)
- **Printing** (Business Cards, Flyers, Packaging, Merch)
- **Graphic Design** (Logo, Brand Identity)
- **Social Media Management** (Instagram, TikTok, Facebook, LinkedIn)
- **Marketing Strategy** (Brand Positioning, Growth, Launch, Content)

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

6. **Politesse et Proactivité** — Sois chaleureux, professionnel et concis. Propose toujours une action pertinente via le champ link.`;

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
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
