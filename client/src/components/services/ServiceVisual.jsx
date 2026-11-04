import { useMemo } from "react";
import {
  Camera,
  Clapperboard,
  Globe,
  Megaphone,
  PenTool,
  Printer,
  TrendingUp,
} from "lucide-react";

/**
 * The visual panel at the top of a service card.
 *
 * It replaces the stock photograph each service used to carry. Thirteen of
 * the forty-nine services shared a photo with another — one image served
 * five different services at once — so a card regularly showed something
 * that had nothing to do with what was being sold, and no photo could be
 * checked before use from this environment.
 *
 * This is drawn instead of fetched: the brand's navy and orange, the
 * category's icon, and a faint pattern seeded from the service id so cards
 * differ without any of them being wrong. It also removes a network request
 * per card.
 */
const CATEGORY_ICONS = {
  "graphic-design": PenTool,
  "social-media": Megaphone,
  "marketing-strategy": TrendingUp,
  ugc: Clapperboard,
  photography: Camera,
  "web-development": Globe,
  printing: Printer,
};

const CATEGORY_LABELS = {
  fr: {
    "graphic-design": "Design",
    "social-media": "Réseaux sociaux",
    "marketing-strategy": "Stratégie",
    ugc: "UGC",
    photography: "Photographie",
    "web-development": "Web",
    printing: "Impression",
  },
  en: {
    "graphic-design": "Design",
    "social-media": "Social media",
    "marketing-strategy": "Strategy",
    ugc: "UGC",
    photography: "Photography",
    "web-development": "Web",
    printing: "Printing",
  },
  ar: {
    "graphic-design": "تصميم",
    "social-media": "مواقع التواصل",
    "marketing-strategy": "استراتيجية",
    ugc: "UGC",
    photography: "تصوير",
    "web-development": "ويب",
    printing: "طباعة",
  },
};

/** A small deterministic generator, so a given service always draws the same. */
function seededPattern(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const next = () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return (h >>> 16) / 65535;
  };
  const circles = Array.from({ length: 5 }, () => ({
    cx: `${next() * 120 - 10}%`,
    cy: `${next() * 100 - 10}%`,
    r: 20 + next() * 55,
    opacity: 0.12 + next() * 0.2,
  }));
  return { circles, y1: `${30 + next() * 40}%`, y2: `${10 + next() * 50}%` };
}

export default function ServiceVisual({ service, language = "fr", popular = false, fill = false }) {
  const Icon = CATEGORY_ICONS[service.category] || PenTool;
  const lang = String(language).split("-")[0];
  const label =
    (CATEGORY_LABELS[lang] || CATEGORY_LABELS.fr)[service.category] || service.category;
  const pattern = useMemo(() => seededPattern(service.id || service.title || "s"), [service.id, service.title]);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 ${
        fill ? "absolute inset-0 h-full w-full" : "h-40 shrink-0"
      }`}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {pattern.circles.map((c, i) => (
          <circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            fill="none"
            stroke="#f97316"
            strokeOpacity={c.opacity}
            strokeWidth="1"
          />
        ))}
        <line
          x1="0"
          y1={pattern.y1}
          x2="100%"
          y2={pattern.y2}
          stroke="#f97316"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
      </svg>

      {!fill && (
      <span className="absolute start-3 top-3 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
        {label}
      </span>
      )}

      {!fill && popular && (
        <span className="absolute end-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white">
          {lang === "ar" ? "الأكثر طلبًا" : lang === "en" ? "Popular" : "Populaire"}
        </span>
      )}

      <Icon
        className={`relative text-white ${fill ? "h-12 w-12 sm:h-16 sm:w-16" : "h-14 w-14"}`}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </div>
  );
}
