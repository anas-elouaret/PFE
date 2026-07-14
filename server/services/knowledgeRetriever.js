const fs = require("fs");
const path = require("path");

const KNOWLEDGE_PATH = path.join(__dirname, "..", "data", "services-knowledge.json");

let knowledgeBase = null;

function loadKnowledgeBase() {
  try {
    const raw = fs.readFileSync(KNOWLEDGE_PATH, "utf-8");
    knowledgeBase = JSON.parse(raw);
    console.log(`[Knowledge] Loaded ${knowledgeBase.services.length} service categories`);
  } catch (err) {
    console.error("[Knowledge] Failed to load knowledge base:", err.message);
    knowledgeBase = { services: [], agency: {}, general: {} };
  }
}

loadKnowledgeBase();

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreCategory(text, category) {
  const tokens = tokenize(text);
  const allKeywords = [category.name.toLowerCase(), ...category.keywords.map((k) => k.toLowerCase())];
  let score = 0;
  for (const token of tokens) {
    for (const kw of allKeywords) {
      if (kw.includes(token) || token.includes(kw)) {
        score += 2;
      }
    }
  }
  for (const kw of allKeywords) {
    if (text.toLowerCase().includes(kw)) {
      score += 3;
    }
  }
  return score;
}

function scoreSubService(text, subService) {
  const lower = text.toLowerCase();
  const subName = subService.name.toLowerCase();
  let score = lower.includes(subName) ? 5 : 0;

  const priceStr = subService.price ? subService.price.toLowerCase() : "";
  if (lower.includes(priceStr)) score += 3;

  if (subService.features) {
    for (const feature of subService.features) {
      if (lower.includes(feature.toLowerCase())) score += 2;
    }
  }
  return score;
}

function getGeneralContext() {
  const g = knowledgeBase.general;
  return `
## General Information
- Payment Terms: ${g.paymentTerms}
- Revision Policy: ${g.revisionPolicy}
- Delivery Times: ${g.deliveryTimes}
- Multi-Service Discounts: ${g.multiServiceDiscounts}
- Contact: ${g.contactInfo}`.trim();
}

function formatServiceContext(category) {
  let block = `\n## ${category.name}`;
  block += `\n${category.detailedDescription || category.shortDescription}`;
  block += `\nPricing Range: ${category.pricingRange}`;
  block += `\nTypical Delivery: ${category.deliveryTime}`;

  if (category.subServices && category.subServices.length > 0) {
    block += `\n\n### Sub-Services:`;
    for (const sub of category.subServices) {
      block += `\n- ${sub.name}: ${sub.description}`;
      if (sub.price) block += ` (${sub.price})`;
    }
  }

  if (category.bundles && category.bundles.length > 0) {
    block += `\n\n### Bundles:`;
    for (const b of category.bundles) {
      block += `\n- ${b.name}: ${b.price} — Includes: ${b.includes.join(", ")}`;
      if (b.savings) block += ` (Save ${b.savings})`;
    }
  }

  return block;
}

function retrieveContext(userMessage) {
  if (!knowledgeBase) loadKnowledgeBase();

  const scored = knowledgeBase.services.map((cat) => {
    let score = scoreCategory(userMessage, cat);

    let bestSubScore = 0;
    let bestSub = null;
    if (cat.subServices) {
      for (const sub of cat.subServices) {
        const subScore = scoreSubService(userMessage, sub);
        if (subScore > bestSubScore) {
          bestSubScore = subScore;
          bestSub = sub;
        }
      }
    }

    score += bestSubScore;
    return { category: cat, score, matchedSubService: bestSub, subScore: bestSubScore };
  });

  scored.sort((a, b) => b.score - a.score);

  const threshold = 2;
  const relevant = scored.filter((s) => s.score >= threshold);

  let contextParts = [];

  if (relevant.length === 0) {
    const overview = knowledgeBase.services
      .map((s) => `- ${s.name}: ${s.shortDescription}`)
      .join("\n");
    contextParts.push(`## Available Services Overview\n${overview}`);
  } else {
    const topServices = relevant.slice(0, 3);
    for (const match of topServices) {
      contextParts.push(formatServiceContext(match.category));
    }
  }

  contextParts.push(getGeneralContext());

  return contextParts.join("\n\n---\n\n");
}

function getFullKnowledgeBase() {
  if (!knowledgeBase) loadKnowledgeBase();
  return knowledgeBase;
}

module.exports = { retrieveContext, getFullKnowledgeBase };
