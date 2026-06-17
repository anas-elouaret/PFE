import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Bot, Send, X, ArrowUpRight } from "lucide-react";
import { sendChatMessage } from "../../api/ai";

const FALLBACK_SERVICES = [
  {
    keywords: ["logo", "brand identity", "branding", "marque", "identité"],
    link: { path: "/services", label: "Voir nos services" },
    text: "Logo Design & Brand Identity — Logo Design from 2,500 MAD, Brand Identity from 4,500 MAD. Includes vector files, color palettes, typography, and brand guidelines.",
  },
  {
    keywords: ["social media", "instagram", "tiktok", "facebook", "linkedin", "réseaux", "community"],
    link: { path: "/services", label: "Voir nos services" },
    text: "Social Media Management — Instagram & TikTok Management at 2,500 MAD/month, Facebook & LinkedIn at 2,000 MAD/month. Bundles: Social Starter 3,500 MAD, Social Growth 5,500 MAD.",
  },
  {
    keywords: ["marketing", "strategy", "stratégie", "brand positioning", "growth", "funnel"],
    link: { path: "/services", label: "Voir nos services" },
    text: "Marketing Strategy — Brand Positioning 3,500 MAD, Growth Strategy 4,500 MAD, Launch Strategy 4,000 MAD, Content Strategy 2,800 MAD.",
  },
  {
    keywords: ["ugc", "user-generated", "tiktok video", "instagram reel", "product review", "unboxing", "storytelling", "content creation", "création"],
    link: { path: "/portfolio", label: "Voir notre Portfolio" },
    text: "UGC Content Creation — TikTok Videos & Instagram Reels from 3,000 MAD, Product Reviews & Unboxing from 2,500 MAD, Storytelling Ads 3,500 MAD.",
  },
  {
    keywords: ["photography", "photo", "product photo", "event", "corporate", "lifestyle", "food", "e-commerce", "real estate", "portrait"],
    link: { path: "/portfolio", label: "Voir notre Portfolio" },
    text: "Photography Services — Product Photography from 1,500 MAD, Event Photography from 4,000 MAD, E-commerce from 1,200 MAD, Fashion from 3,500 MAD.",
  },
  {
    keywords: ["printing", "print", "flyer", "business card", "packaging", "merch", "impression"],
    link: { path: "/printing", label: "Voir les services d'impression" },
    text: "Printing Services — Business cards, flyers, packaging, and merch. Premium finishing, multiple material options, and delivery support.",
  },
  {
    keywords: ["website", "web development", "site", "développement", "web app", "application"],
    link: { path: "/services", label: "Voir nos services" },
    text: "Web Development — Conversion-led websites from $1,499, custom web applications from $2,499. SEO-ready, responsive, with CRM and analytics integration.",
  },
  {
    keywords: ["pricing", "price", "tarif", "cost", "combien", "prix", "budget"],
    link: { path: "/pricing", label: "Voir les tarifs" },
    text: "Pricing Overview — Services range from 1,000 MAD to 6,500 MAD (MAD pricing). USD services from $299 to $2,499. Multi-service discounts available. Explore our full catalog.",
  },
  {
    keywords: ["portfolio", "work", "projet", "project", "design", "création", "réalisations"],
    link: { path: "/portfolio", label: "Voir le Portfolio" },
    text: "Vous pouvez consulter nos créations UGC et designs précédents dans notre portfolio.",
  },
  {
    keywords: ["contact", "support", "help", "aide", "join", "recrutement", "career"],
    link: { path: "/contact", label: "Nous contacter" },
    text: "Pour toute question spécifique, notre équipe est là pour vous aider.",
  },
  {
    keywords: ["login", "connexion", "sign in", "signin", "account", "compte"],
    link: { path: "/login", label: "Se connecter" },
    text: "Vous pouvez vous connecter à votre compte pour gérer vos projets et commandes.",
  },
  {
    keywords: ["showreel", "demo", "motion", "video", "animation"],
    link: { path: "/showreel", label: "Voir notre Showreel" },
    text: "Découvrez notre showreel pour voir nos travaux en motion design et vidéo.",
  },
];

const FALLBACK_TEXT = `Our services include UGC content creation, web development, printing, graphic design, social media management, marketing strategy, and photography. For specific questions, please contact our support team at contact@growstack.app.`;
const FALLBACK_LINK = { path: "/services", label: "Explorer nos services" };

const WELCOME_TEXT = "Bonjour ! I'm Growstack's AI consultant. Ask me about our services — UGC, web development, printing, design, marketing strategy, social media, photography, pricing, bundles, or anything else.";

function simulateAI(userText) {
  const lower = userText.toLowerCase();
  for (const s of FALLBACK_SERVICES) {
    if (s.keywords.some((kw) => lower.includes(kw))) {
      return { text: s.text, link: s.link };
    }
  }
  return { text: FALLBACK_TEXT, link: FALLBACK_LINK };
}

export default function ChatModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const welcome = useMemo(
    () => ({ text: WELCOME_TEXT, sender: "ai", link: null }),
    []
  );

  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages([welcome]);
  }, [welcome]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { text, sender: "user", link: null };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const conversation = [...messages, userMsg].map((m) => ({
        role: m.sender,
        content: m.text,
      }));

      const data = await sendChatMessage(conversation);

      const reply = data?.reply
        ? { text: data.reply.text, link: data.reply.link }
        : simulateAI(text);

      setMessages((prev) => [
        ...prev,
        { text: reply.text, sender: "ai", link: reply.link },
      ]);
    } catch {
      const fallback = simulateAI(text);
      setMessages((prev) => [
        ...prev,
        { text: fallback.text, sender: "ai", link: fallback.link },
      ]);
    } finally {
      setLoading(false);
    }
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
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-black text-white"
                      : "border-2 border-black bg-white text-slate-900"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.link && (
                    <Link
                      to={msg.link.path}
                      onClick={onClose}
                      className="mt-2 inline-flex items-center gap-2 border-2 border-black bg-yellow-400 px-4 py-1.5 text-sm font-black uppercase hover:bg-black hover:text-white transition-all"
                    >
                      {msg.link.label}
                      <ArrowUpRight size={14} strokeWidth={2.5} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="border-2 border-black bg-white px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-black rounded-none animate-pulse" />
                    <span
                      className="w-2 h-2 bg-black rounded-none animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-2 h-2 bg-black rounded-none animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
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
