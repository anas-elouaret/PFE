import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Send, Bot, ArrowUpRight } from "lucide-react";
import { sendChatMessageStream } from "../../api/ai";
import { answerOffline, detectLanguage, OFFLINE_NOTICE } from "../../utils/offlineAdvisor";


// Shown only before the visitor has said anything. A blank box asks the
// visitor to work out what to ask; these give them a way in and tell them
// what the assistant is for.
const STARTERS = [
  "Je lance ma marque, par où commencer ?",
  "Combien coûte une séance photo produit ?",
  "Vous faites quoi exactement ?",
  "J'ai besoin de contenu pour Instagram",
];

export default function AIChatModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const welcome = useMemo(
    () => ({ role: "ai", text: t("ai_consultant_welcome"), link: null }),
    [t]
  );

  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const scrollRef = useRef(null);
  const streamIdRef = useRef(0);

  useEffect(() => {
    setMessages([welcome]);
  }, [welcome]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = (presetText) => {
    const text = (typeof presetText === "string" ? presetText : input).trim();
    if (!text || loading) return;

    const userMsg = { role: "user", text, link: null };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const streamId = ++streamIdRef.current;
    setStreamingMessageId(streamId);

    setMessages((prev) => [
      ...prev,
      { role: "ai", text: "", link: null, _streamId: streamId },
    ]);

    const conversation = updatedMessages.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    sendChatMessageStream(
      conversation,
      (delta) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._streamId === streamId
              ? { ...msg, text: msg.text + delta }
              : msg
          )
        );
      },
      (link) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._streamId === streamId
              ? { ...msg, link, _streamId: undefined }
              : msg
          )
        );
        setLoading(false);
        setStreamingMessageId(null);
      },
      // The live advisor could not be reached. Answer from the catalogue
      // rather than leave the visitor with nothing, and say plainly that this
      // is not the advisor speaking.
      async () => {
        const lang = detectLanguage(text);
        let fallback;
        try {
          fallback = await answerOffline(text);
        } catch {
          fallback = {
            text:
              lang === "ar"
                ? "وقع شي مشكل تقني. كتب لينا على growstackagency@gmail.com ونرجعو ليك."
                : "Un incident technique est survenu. Écrivez-nous à growstackagency@gmail.com, nous revenons vers vous.",
            link: { path: "/contact", label: lang === "ar" ? "تواصل معانا" : "Nous contacter" },
          };
        }
        setMessages((prev) =>
          prev.map((msg) =>
            msg._streamId === streamId
              ? {
                  ...msg,
                  text: `${OFFLINE_NOTICE[lang]}\n\n${fallback.text}`,
                  link: fallback.link,
                  _streamId: undefined,
                }
              : msg
          )
        );
        setLoading(false);
        setStreamingMessageId(null);
      }
    );
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
          className="fixed inset-x-4 bottom-4 z-[9999] flex max-h-[80vh] flex-col border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:inset-x-auto sm:bottom-6 sm:end-6 sm:max-h-[520px] sm:w-96"
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
            className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "border-2 border-black bg-white text-slate-900"
                  }`}
                >
                  {msg._streamId && !msg.text ? (
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
                  ) : (
                    <p className="whitespace-pre-line" dir="auto">
                      {msg.text}
                    </p>
                  )}
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
            {loading && !streamingMessageId && (
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

          {messages.length <= 1 && !loading && (
            <div className="border-t-2 border-black px-4 pt-3 pb-1">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pour commencer
              </p>
              <div className="flex flex-wrap gap-2 pb-2">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => handleSend(starter)}
                    className="border-2 border-slate-200 px-3 py-2 text-start text-xs font-medium text-slate-700 transition-colors hover:border-orange-500 hover:text-orange-600"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t-2 border-black p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                dir="auto"
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
