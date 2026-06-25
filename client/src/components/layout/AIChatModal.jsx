import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Send, Bot } from "lucide-react";

const SERVICES = [
  {
    keywords: ["logo", "brand identity", "branding", "marque", "identité"],
    title: "Logo Design & Brand Identity",
    info: "Logo Design from 2,500 MAD, Brand Identity from 4,500 MAD. Includes vector files, color palettes, typography, and brand guidelines. Bundle: Brand Starter at 6,000 MAD.",
  },
  {
    keywords: ["social media", "instagram", "tiktok", "facebook", "linkedin", "réseaux", "community"],
    title: "Social Media Management",
    info: "Instagram & TikTok Management at 2,500 MAD/month, Facebook & LinkedIn at 2,000 MAD/month. Bundles: Social Starter 3,500 MAD, Social Growth 5,500 MAD.",
  },
  {
    keywords: ["marketing", "strategy", "stratégie", "brand positioning", "growth", "funnel"],
    title: "Marketing Strategy",
    info: "Brand Positioning 3,500 MAD, Growth Strategy 4,500 MAD, Launch Strategy 4,000 MAD, Content Strategy 2,800 MAD. Strategy Essentials bundle at 5,000 MAD.",
  },
  {
    keywords: ["ugc", "user-generated", "tiktok video", "instagram reel", "product review", "unboxing", "storytelling", "content creation", "création"],
    title: "UGC Content Creation",
    info: "TikTok Videos & Instagram Reels from 3,000 MAD, Product Reviews & Unboxing from 2,500 MAD, Storytelling Ads 3,500 MAD. UGC Starter Pack at 5,000 MAD.",
  },
  {
    keywords: ["photography", "photo", "product photo", "event", "corporate", "lifestyle", "food", "e-commerce", "real estate", "portrait"],
    title: "Photography Services",
    info: "Product Photography from 1,500 MAD, Event Photography from 4,000 MAD, E-commerce from 1,200 MAD, Fashion from 3,500 MAD. Photography Starter at 2,500 MAD.",
  },
  {
    keywords: ["printing", "print", "flyer", "business card", "packaging", "merch", "impression"],
    title: "Printing Services",
    info: "Business cards, flyers, packaging, and merch. Premium finishing, multiple material options, and delivery support. Contact us for a custom quote.",
  },
  {
    keywords: ["website", "web development", "site", "développement", "web app", "application"],
    title: "Web Development",
    info: "Conversion-led websites from $1,499, custom web applications from $2,499. SEO-ready, responsive, with CRM and analytics integration.",
  },
  {
    keywords: ["pricing", "price", "tarif", "cost", "combien", "prix", "budget"],
    title: "Pricing Overview",
    info: "Services range from 1,000 MAD to 6,500 MAD (MAD pricing). USD services from $299 to $2,499. Multi-service discounts: 10% off for 2 services, 15% for 3, 20% for 4+. Explore our full catalog at /services.",
  },
  {
    keywords: ["bundle", "pack", "package", "forfait", "starter", "suite"],
    title: "Service Bundles",
    info: "Brand Starter 6,000 MAD, Print Essentials 4,000 MAD, Social Starter 3,500 MAD, Social Growth 5,500 MAD, Strategy Essentials 5,000 MAD, Growth Accelerator 9,000 MAD, UGC Starter Pack 5,000 MAD or $599, Complete UGC Suite 10,000 MAD, Photography Starter 2,500 MAD, Complete Photography Suite 7,000 MAD.",
  },
  {
    keywords: ["delivery", "time", "délai", "combien de temps", "how long", "livraison", "turnaround"],
    title: "Delivery Time",
    info: "Most projects are delivered within 7 to 14 business days. Photography and printing often faster. Complex strategies and web applications may take 2-4 weeks depending on scope.",
  },
  {
    keywords: ["revision", "revisions", "modification", "change", "modifier", "retouches"],
    title: "Revisions Policy",
    info: "Each project includes revision rounds. Unlimited revisions available on select packages. Additional rounds may be billed depending on scope.",
  },
  {
    keywords: ["payment", "paiement", "pay", "acompte", "deposit", "invoice", "facture"],
    title: "Payment Terms",
    info: "We accept credit card, bank transfer, and PayPal. Payment is split: deposit at launch, balance upon delivery. Multi-service cart discounts apply automatically.",
  },
];

const FALLBACK = "I'm not sure I understand your request. For specific questions, please contact our support team at elouaretanas480@gmail.com or explore our services at /services.";

const WELCOME_TEXT = "Bonjour ! I'm Growstack's AI consultant. Ask me about our services — UGC, web development, printing, design, marketing strategy, social media, photography, pricing, bundles, or anything else.";

function matchService(text) {
  const lower = text.toLowerCase();

  for (const service of SERVICES) {
    for (const kw of service.keywords) {
      if (lower.includes(kw)) return service;
    }
  }

  return null;
}

export default function AIChatModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const welcome = useMemo(() => ({ role: "ai", text: t("ai_consultant_welcome") }), [t]);

  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages([welcome]);
  }, [welcome]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const match = matchService(text);
      const reply = match
        ? `${match.title}:\n${match.info}`
        : "Our services include UGC content creation, web development, printing, graphic design, social media management, marketing strategy, and photography. " + FALLBACK;

      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setLoading(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-[9999] w-[calc(100vw-2rem)] sm:w-96 border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col"
          style={{ maxHeight: "520px" }}
        >
          <div className="flex items-center justify-between gap-2 px-5 py-4 border-b-2 border-black bg-black/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center">
                <Bot size={16} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-black tracking-tight text-black">
                {t("navbar.ai_consultant")}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 border-2 border-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition-colors duration-200"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
            style={{ minHeight: "280px", maxHeight: "340px" }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "border-2 border-black bg-white text-slate-900"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="border-2 border-black bg-white px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-black rounded-none animate-pulse" />
                    <span className="w-2 h-2 bg-black rounded-none animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 bg-black rounded-none animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t-2 border-black p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("ai_consultant_placeholder")}
                className="flex-1 border-2 border-black px-4 py-2.5 text-sm text-black placeholder:text-slate-400 bg-white focus:outline-none focus:ring-0"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-10 h-10 border-2 border-black flex items-center justify-center bg-black text-white hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
