import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BarChart3, Check, Users } from "lucide-react";
import { useCommunityAuth } from "../../context/CommunityAuthContext";
import { ensureGuestId, initialsAvatar } from "../../utils/communityStorage";

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

function totalVotes(poll) {
  const votes = poll.votes || {};
  return Object.values(votes).reduce((sum, n) => sum + (Number(n) || 0), 0);
}

function percentOf(poll, optionId) {
  const total = totalVotes(poll);
  if (!total) return 0;
  return Math.round(((poll.votes?.[optionId] || 0) / total) * 100);
}

export default function PollCard({ poll, onVote, index = 0 }) {
  const { t } = useTranslation();
  const { currentUser } = useCommunityAuth();
  const author = poll.author || {};
  const profilePath = authorProfilePath(author);
  const choices = poll.choices || {};
  const voterId = currentUser?.id || ensureGuestId();
  const hasVoted = !!choices[voterId];
  const myChoice = choices[voterId];
  const total = totalVotes(poll);
  const votedOption = poll.options.find((o) => o.id === myChoice);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="border border-slate-200 bg-white shadow-sm p-4 sm:p-5"
    >
      {/* Poll header */}
      <div className="flex items-center gap-3">
        <Link to={profilePath} className="shrink-0 block">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-10 h-10 object-cover border border-slate-200 shrink-0 hover:border-orange-500 transition-colors"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = initialsAvatar(author.name);
            }}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              to={profilePath}
              className="text-sm font-bold text-slate-900 truncate hover:text-orange-600 transition-colors inline-block max-w-full"
            >
              {author.name}
            </Link>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 shrink-0">
              <BarChart3 size={10} />
              {t("community.poll")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{timeAgo(poll.createdAt)}</p>
        </div>
        {hasVoted && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 shrink-0">
            <Check size={11} />
            {t("community.voted")}
          </span>
        )}
      </div>

      {/* Question */}
      <h3 className="mt-4 text-sm sm:text-base font-bold text-slate-900 leading-snug">
        {poll.question}
      </h3>

      {/* Options */}
      <div className="mt-4 space-y-2.5">
        {poll.options.map((option) => {
          const count = poll.votes?.[option.id] || 0;
          const pct = percentOf(poll, option.id);
          const isChosen = hasVoted && myChoice === option.id;

          if (hasVoted) {
            return (
              <div
                key={option.id}
                className={`relative overflow-hidden border px-3.5 py-3 ${
                  isChosen
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
                    isChosen ? "bg-orange-200/50" : "bg-orange-100/60"
                  }`}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-2 min-w-0">
                    {isChosen && <Check size={15} className="text-orange-600 shrink-0" />}
                    <span className="truncate">{option.label}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-600 shrink-0">
                    {count} · {pct}%
                  </span>
                </div>
              </div>
            );
          }

          return (
            <button
              key={option.id}
              onClick={() => onVote?.(poll.id, option.id)}
              className="w-full flex items-center justify-between gap-3 border border-slate-200 bg-white px-3.5 py-3 text-left hover:border-orange-500 hover:bg-orange-50 group transition-colors"
            >
              <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-orange-500 shrink-0" />
                <span className="truncate">{option.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Users size={14} />
          {hasVoted
            ? t("community.yourVote", { option: votedOption?.label })
            : t("community.totalVotes", { count: total })}
        </span>
        {hasVoted && (
          <span className="text-xs font-semibold text-slate-400">
            {t("community.totalVotes", { count: total })}
          </span>
        )}
      </div>
    </motion.div>
  );
}