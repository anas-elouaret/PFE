import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Trophy,
  BadgeCheck,
  Heart,
  MessageCircle,
  Send,
  Check,
  Sparkles,
} from "lucide-react";
import {
  readSuccessStories,
  writeSuccessStories,
  initialsAvatar,
  migrateCommunityData,
} from "../../utils/communityStorage";
import { useCommunityAuth } from "../../context/CommunityAuthContext";
import AccountLoginModal from "./AccountLoginModal";

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(ts).toLocaleDateString();
}

function authorProfilePath(author) {
  return author?.accountId
    ? `/profile/${author.accountId}`
    : `/profile/${encodeURIComponent(author?.name || "user")}`;
}

function getInitialSuccess() {
  migrateCommunityData();
  return readSuccessStories();
}

function ClientAvatar({ author }) {
  return (
    <img
      src={author.avatar}
      alt={author.name}
      className="w-11 h-11 object-cover border border-amber-200 shrink-0"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = initialsAvatar(author.name);
      }}
    />
  );
}

function CommentInput({
  currentUser,
  value,
  onChange,
  onFocus,
  onSubmit,
  commentAvatar,
}) {
  const { t } = useTranslation();
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-start gap-3 pt-4 border-t border-amber-100"
    >
      <img
        src={commentAvatar}
        alt=""
        className="w-8 h-8 object-cover border border-amber-200 shrink-0"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = initialsAvatar(
            currentUser?.name || t("community.you")
          );
        }}
      />
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={
            currentUser
              ? t("community.commentPlaceholder")
              : t("community.signInToComment")
          }
          className="w-full border border-amber-200 bg-amber-50/40 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={!value.trim() || !currentUser}
        className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label={t("community.send")}
      >
        <Send size={15} />
        {t("community.send")}
      </button>
    </form>
  );
}

function MetricGrid({ metrics }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="border border-amber-200 bg-gradient-to-b from-amber-50 to-white px-3 py-3 text-center"
        >
          <p className="text-lg sm:text-xl font-extrabold text-amber-600 tracking-tight">
            {m.value}
          </p>
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
            {m.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function HallOfFameSection() {
  const { t } = useTranslation();
  const { currentUser } = useCommunityAuth();
  const [stories, setStories] = useState(getInitialSuccess);
  const [commentsOpen, setCommentsOpen] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    writeSuccessStories(stories);
  }, [stories]);

  const toggleLike = (storyId) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id !== storyId) return s;
        const turningOn = !s.liked;
        const next = { ...s, liked: turningOn, likes: s.likes + (turningOn ? 1 : -1) };
        return next;
      })
    );
  };

  const addComment = (storyId, text) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id !== storyId) return s;
        const commentsList = s.commentsList || [];
        const newComment = {
          id: `${s.id}-c-${Date.now()}`,
          author: {
            accountId: currentUser?.id,
            name:
              currentUser?.name || t("community.you"),
            avatar: currentUser?.avatar || "/logo.png",
          },
          createdAt: Date.now(),
          text,
        };
        return { ...s, commentsList: [...commentsList, newComment] };
      })
    );
  };

  const submitComment = (e, storyId) => {
    e.preventDefault();
    const text = (commentTexts[storyId] || "").trim();
    if (!text) return;
    addComment(storyId, text);
    setCommentTexts((prev) => ({ ...prev, [storyId]: "" }));
    setCommentsOpen((prev) => (prev === storyId ? prev : storyId));
  };

  const commentsFor = (s) => s.commentsList || [];

  const featured = stories.filter((s) => s.featured)[0];
  const previous = stories.filter((s) => !s.featured);

  if (stories.length === 0) {
    return (
      <section className="mb-10">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-white shadow-sm">
              <Trophy size={12} fill="currentColor" />
              {t("community.hallOfFameBadge")}
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
            {t("community.hallOfFame")}
          </h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            {t("community.hallOfFameSubtitle")}
          </p>
        </div>

        <div className="border border-dashed border-amber-300 bg-white p-10 sm:p-14 text-center">
          <span className="mx-auto w-14 h-14 flex items-center justify-center bg-amber-50 border border-amber-200 text-amber-600">
            <Trophy size={26} />
          </span>
          <p className="mt-4 text-sm font-bold text-slate-900">
            {t("community.fameEmptyTitle")}
          </p>
          <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            {t("community.fameEmpty")}
          </p>
        </div>
      </section>
    );
  }

  const commentAvatar = currentUser?.avatar || "/logo.png";
  const featuredComments = commentsFor(featured);

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-white shadow-sm">
            <Trophy size={12} fill="currentColor" />
            {t("community.hallOfFameBadge")}
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
          {t("community.hallOfFame")}
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {t("community.hallOfFameSubtitle")}
        </p>
      </div>

      {/* Featured success card */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative border-2 border-amber-300/80 bg-white shadow-[0_8px_30px_rgba(217,119,6,0.15)] overflow-hidden"
      >
        {/* Gold ribbon */}
        <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 px-4 sm:px-6 py-2.5">
          <span className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
            <Trophy size={14} fill="currentColor" />
            {t("community.weeklyHighlight")}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white">
            {t("community.week", { week: featured.week })}
          </span>
        </div>

        <div className="p-4 sm:p-6">
          {/* Client header */}
          <div className="flex items-center gap-3">
            <ClientAvatar author={featured.author} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={authorProfilePath(featured.author)}
                  className="text-sm font-bold text-slate-900 leading-tight truncate hover:text-amber-600 transition-colors inline-block max-w-full"
                >
                  {featured.author.name}
                </Link>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 shrink-0">
                  {t("community.verified")}
                  <BadgeCheck size={11} />
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {featured.author.role}
              </p>
            </div>
            <span className="shrink-0 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300">
              {t("community.serviceDelivered")} · {featured.service}
            </span>
          </div>

          {/* Title + summary */}
          <h3 className="mt-4 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
            {featured.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {featured.summary}
          </p>

          {/* Hero image */}
          {featured.image && (
            <div className="mt-4 border-2 border-amber-200 bg-amber-50/40 p-1">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full max-h-[340px] object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Verified metrics */}
          <div className="mt-5 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-amber-600">
              {t("community.verifiedPerformance")}
            </span>
          </div>
          <div className="mt-2.5">
            <MetricGrid metrics={featured.metrics} />
          </div>

          {/* Takeaways */}
          {featured.takeaways?.length > 0 && (
            <ul className="mt-5 space-y-2">
              {featured.takeaways.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2.5 text-sm text-slate-700"
                >
                  <span className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center bg-amber-600 text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          )}

          {/* Engagement bar */}
          <div className="mt-5 flex items-center gap-5 border-t border-amber-100 pt-3">
            <button
              onClick={() => toggleLike(featured.id)}
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                featured.liked
                  ? "text-amber-600"
                  : "text-slate-500 hover:text-amber-600"
              }`}
            >
              <Heart
                size={19}
                fill={featured.liked ? "currentColor" : "none"}
              />
              {featured.likes + (featured.liked ? 1 : 0)}
            </button>
            <button
              onClick={() => setCommentsOpen(
                (prev) => (prev === featured.id ? null : featured.id)
              )}
              aria-expanded={commentsOpen === featured.id}
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                commentsOpen === featured.id
                  ? "text-amber-600"
                  : "text-slate-500 hover:text-amber-600"
              }`}
            >
              <MessageCircle size={19} />
              {featuredComments.length}
            </button>
          </div>

          {/* Comments */}
          {commentsOpen === featured.id && (
            <div className="mt-4 border-t border-amber-100 pt-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t("community.comments")}
                </h3>
                <span className="text-[11px] font-bold text-amber-600">
                  {featuredComments.length}
                </span>
              </div>

              <div className="space-y-4 mb-4">
                {featuredComments.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {t("community.noComments")}
                  </p>
                ) : (
                  featuredComments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                      <img
                        src={c.author.avatar}
                        alt={c.author.name}
                        className="w-8 h-8 object-cover border border-amber-200 shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = initialsAvatar(c.author.name);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {c.author.name}
                          </span>
                          <span className="text-[11px] text-slate-400 shrink-0">
                            {timeAgo(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mt-0.5">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <CommentInput
                currentUser={currentUser}
                value={commentTexts[featured.id] || ""}
                onChange={(e) =>
                  setCommentTexts((prev) => ({
                    ...prev,
                    [featured.id]: e.target.value,
                  }))
                }
                onFocus={() => {
                  if (!currentUser) setLoginOpen(true);
                }}
                onSubmit={(e) => submitComment(e, featured.id)}
                commentAvatar={commentAvatar}
              />
            </div>
          )}
        </div>
      </motion.article>

      {/* Previous winners */}
      {previous.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {t("community.previousWinners")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {previous.map((s, i) => {
              const open = commentsOpen === s.id;
              const comments = commentsFor(s);
              return (
                <motion.article
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="border border-slate-200 border-l-4 border-l-amber-400 bg-white shadow-sm p-4"
                >
                  <div className="flex items-center gap-3">
                    <Link
                      to={authorProfilePath(s.author)}
                      className="shrink-0 block"
                    >
                      <ClientAvatar author={s.author} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={authorProfilePath(s.author)}
                        className="text-sm font-bold text-slate-900 truncate hover:text-amber-600 transition-colors inline-block max-w-full"
                      >
                        {s.author.name}
                      </Link>
                      <p className="text-[11px] text-slate-500 truncate">
                        {s.author.company} · {s.week}
                      </p>
                    </div>
                    <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200">
                      {t("community.verified")}
                    </span>
                  </div>

                  <h4 className="mt-3 text-sm font-extrabold text-slate-900 leading-snug">
                    {s.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {s.summary}
                  </p>

                  {s.metrics?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.metrics.map((m) => (
                        <span
                          key={m.label}
                          className="px-1.5 py-0.5 text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200"
                        >
                          {m.value} {m.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-5 border-t border-amber-100 pt-2.5">
                    <button
                      onClick={() => toggleLike(s.id)}
                      className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                        s.liked
                          ? "text-amber-600"
                          : "text-slate-500 hover:text-amber-600"
                      }`}
                    >
                      <Heart size={17} fill={s.liked ? "currentColor" : "none"} />
                      {s.likes + (s.liked ? 1 : 0)}
                    </button>
                    <button
                      onClick={() =>
                        setCommentsOpen((prev) => (prev === s.id ? null : s.id))
                      }
                      aria-expanded={open}
                      className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                        open
                          ? "text-amber-600"
                          : "text-slate-500 hover:text-amber-600"
                      }`}
                    >
                      <MessageCircle size={17} />
                      {comments.length}
                    </button>
                  </div>

                  {open && (
                    <div className="mt-3">
                      <div className="space-y-3 mb-3">
                        {comments.length === 0 ? (
                          <p className="text-xs text-slate-500">
                            {t("community.noComments")}
                          </p>
                        ) : (
                          comments.map((c) => (
                            <div key={c.id} className="flex items-start gap-2.5">
                              <img
                                src={c.author.avatar}
                                alt={c.author.name}
                                className="w-7 h-7 object-cover border border-amber-200 shrink-0"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = initialsAvatar(c.author.name);
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-slate-900 truncate">
                                  {c.author.name}
                                  <span className="ml-1.5 font-normal text-slate-400">
                                    {timeAgo(c.createdAt)}
                                  </span>
                                </p>
                                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                                  {c.text}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <CommentInput
                        currentUser={currentUser}
                        value={commentTexts[s.id] || ""}
                        onChange={(e) =>
                          setCommentTexts((prev) => ({
                            ...prev,
                            [s.id]: e.target.value,
                          }))
                        }
                        onFocus={() => {
                          if (!currentUser) setLoginOpen(true);
                        }}
                        onSubmit={(e) => submitComment(e, s.id)}
                        commentAvatar={commentAvatar}
                      />
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      )}

      <AccountLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </section>
  );
}