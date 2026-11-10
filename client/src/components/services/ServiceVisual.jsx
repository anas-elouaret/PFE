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
import { getServiceImage } from "../../data/serviceAssets";

/**
 * The visual panel at the top of a service card.
 *
 * Two modes, and which one runs depends on whether we have a photograph we
 * have actually looked at for this service.
 *
 * A photograph, when there is one. Every url in serviceAssets was opened and
 * viewed before being written there, so a card shows the work being sold
 * rather than a keyword match. serviceAssets wins over the service's own
 * `image` field because it is the checked list; the data files still carry
 * older urls that were never verified one by one.
 *
 * The drawn panel otherwise — the brand's navy and orange, the category's
 * icon, and a faint pattern seeded from the service id so cards differ. It
 * is deliberately not a near-enough stock photo: a wrong picture describes
 * the service wrongly, a drawn panel only declines to describe it.
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
  const photo = getServiceImage(service.id) || service.image || null;

  const popularLabel =
    lang === "ar" ? "الأكثر طلبًا" : lang === "en" ? "Popular" : "Populaire";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-slate-900 ${
        fill ? "absolute inset-0 h-full w-full" : "h-40 shrink-0"
      }`}
    >
      {photo ? (
        <>
          <img
            src={photo}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* A short scrim under the chips only, so the photograph stays the
              photograph but the labels keep their contrast on a light one. */}
          <div
            className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-950/70 to-transparent"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800"
            aria-hidden="true"
          />
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
          <Icon
            className={`relative text-white ${fill ? "h-12 w-12 sm:h-16 sm:w-16" : "h-14 w-14"}`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </>
      )}

      {!fill && (
        <span className="absolute start-3 top-3 rounded-full bg-slate-950/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
          {label}
        </span>
      )}

      {!fill && popular && (
        <span className="absolute end-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white">
          {popularLabel}
        </span>
      )}
    </div>
  );
}
