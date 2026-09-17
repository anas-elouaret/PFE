import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { initialsAvatar } from "../../utils/communityStorage";
import { useCommunityAuth } from "../../context/CommunityAuthContext";

import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Play,
  Pencil,
  Trash2,
  Link2,
  Check,
  Send,
} from "lucide-react";

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

export default function PostCard({
  post,
  onLike,
  onAddComment,
  onRequireAuth,
  onEdit,
  onDelete,
  index = 0,
}) {
  const { t } = useTranslation();
  const { currentUser } = useCommunityAuth();
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const videoRef = useRef(null);
  const menuRef = useRef(null);
  const copiedTimerRef = useRef(null);
  const liked = !!post.liked;
  const likeCount = post.likes + (liked ? 1 : 0);
  const profilePath = authorProfilePath(post.author);
  const hasCompany = !!post.author.company;
  const comments = post.commentsList || [];
  const commentCount = comments.length;
  const composerAvatar = currentUser?.avatar || "/logo.png";

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#post-${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    copiedTimerRef.current = setTimeout(() => {
      setCopied(false);
      setMenuOpen(false);
    }, 900);
  };

  const submitComment = (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    onAddComment?.(post.id, text);
    setCommentText("");
    setCommentsOpen(true);
  };

  const handleCommentInputFocus = () => {
    if (!currentUser) onRequireAuth?.();
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="border border-slate-200 bg-white shadow-sm"
    >
      {/* Post header */}
      <div className="p-4 sm:p-5 flex items-start gap-3">
        <Link to={profilePath} className="shrink-0 block">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 object-cover border border-slate-200 shrink-0 hover:border-orange-500 transition-colors"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = initialsAvatar(post.author.name);
            }}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <Link
                to={profilePath}
                className="text-sm font-bold text-slate-900 leading-tight truncate hover:text-orange-600 transition-colors inline-block max-w-full"
              >
                {post.author.name}
              </Link>
              {hasCompany && (
                <span className="ml-2 inline-block align-middle text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5">
                  {post.author.company}
                </span>
              )}
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {post.author.role}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-xs text-slate-400">
                {timeAgo(post.createdAt)}
              </span>
              <span className="text-[11px] text-orange-600">
                {t("community.following")}
              </span>
            </div>
          </div>
        </div>

        {/* Post options dropdown */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t("community.postOptions")}
            aria-expanded={menuOpen}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-52 border border-slate-200 bg-white shadow-xl">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.(post);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors text-left"
              >
                <Pencil size={15} />
                {t("community.edit")}
              </button>

              <button
                onClick={copyLink}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors text-left"
              >
                {copied ? (
                  <Check size={15} className="text-green-600" />
                ) : (
                  <Link2 size={15} />
                )}
                {copied ? t("community.linkCopied") : t("community.copyLink")}
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.(post.id);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <Trash2 size={15} />
                {t("community.delete")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post text */}
      {post.text && (
        <div className="px-4 sm:px-5 pb-4">
          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
            {post.text}
          </p>
        </div>
      )}

      {/* Media */}
      {post.image && (
        <div className="bg-slate-100 overflow-hidden">
          <img
            src={post.image}
            alt=""
            className="w-full max-h-[480px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      {post.video && (
        <div className="bg-slate-900 relative overflow-hidden">
          <video
            ref={videoRef}
            src={post.video}
            className="w-full max-h-[480px] object-contain"
            playsInline
            controls={videoPlaying}
          />
          {!videoPlaying && (
            <button
              onClick={() => {
                setVideoPlaying(true);
                videoRef.current?.play();
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors"
              aria-label="Play video"
            >
              <span className="w-16 h-16 flex items-center justify-center bg-orange-500 text-white shadow-lg animate-pulse-soft">
                <Play size={26} fill="currentColor" />
              </span>
            </button>
          )}
        </div>
      )}

      {/* Actions bar */}
      <div className="px-4 sm:px-5 py-3 flex items-center gap-6 border-t border-slate-100">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
            liked ? "text-orange-600" : "text-slate-500 hover:text-orange-600"
          }`}
        >
          <Heart size={19} fill={liked ? "currentColor" : "none"} />
          {likeCount}
        </button>
        <button
          onClick={() => setCommentsOpen((v) => !v)}
          aria-expanded={commentsOpen}
          className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
            commentsOpen ? "text-orange-600" : "text-slate-500 hover:text-orange-600"
          }`}
        >
          <MessageCircle size={19} />
          {commentCount}
        </button>
        <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors ml-auto">
          <Share2 size={18} />
          {t("community.share")}
        </button>
      </div>

      {/* Comments section */}
      {commentsOpen && (
        <div className="border-t border-slate-100 px-4 sm:px-5 py-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t("community.comments")}
            </h3>
            <span className="text-[11px] font-bold text-orange-600">{commentCount}</span>
          </div>

          {/* Comment list */}
          <div className="space-y-4 mb-4">
            {commentCount === 0 ? (
              <p className="text-sm text-slate-500">{t("community.noComments")}</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <img
                    src={c.author.avatar}
                    alt={c.author.name}
                    className="w-8 h-8 object-cover border border-slate-200 shrink-0"
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

          {/* Comment input */}
          <form
            onSubmit={submitComment}
            className="flex items-start gap-3 pt-4 border-t border-slate-100"
          >
            <img
              src={composerAvatar}
              alt=""
              className="w-8 h-8 object-cover border border-slate-200 shrink-0"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = initialsAvatar(currentUser?.name || t("community.you"));
              }}
            />
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={handleCommentInputFocus}
                placeholder={
                  currentUser
                    ? t("community.commentPlaceholder")
                    : t("community.signInToComment")
                }
                className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!commentText.trim() || !currentUser}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label={t("community.send")}
            >
              <Send size={15} />
              {t("community.send")}
            </button>
          </form>
        </div>
      )}
    </motion.article>
  );
}