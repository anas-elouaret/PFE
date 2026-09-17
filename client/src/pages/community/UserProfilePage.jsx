import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Briefcase,
  Calendar,
  Mail,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  ArrowUpRight,
  ArrowDownRight,
  BadgeCheck,
  Send,
  UserRound,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Gem,
  X,
  Tag,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { useCommunityAuth } from "../../context/CommunityAuthContext";
import { readProjects, readPosts, normalizeEmail } from "../../utils/communityStorage";
import { initialsAvatar } from "../../utils/communityStorage";
import { REWARDS } from "../../utils/communityPoints";

const STATUS_CONFIG = {
  pending: { color: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
  in_progress: { color: "text-blue-700 bg-blue-50 border-blue-200", icon: AlertCircle },
  completed: { color: "text-orange-700 bg-orange-50 border-orange-200", icon: CheckCircle2 },
  cancelled: { color: "text-red-600 bg-red-50 border-red-200", icon: AlertCircle },
};

function formatDate(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function UserProfilePage() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const { accounts, currentUser, redeemReward } = useCommunityAuth();
  const [storeOpen, setStoreOpen] = useState(false);
  const [lastRedeemed, setLastRedeemed] = useState(null);
  const [redeemError, setRedeemError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const copyTimerRef = useRef(null);

  const account = useMemo(() => {
    if (!userId) return null;
    const decoded = decodeURIComponent(userId);
    return (
      accounts.find((a) => a.id === userId) ||
      accounts.find((a) => a.username === decoded) ||
      accounts.find((a) => a.name === decoded) ||
      null
    );
  }, [userId, accounts]);

  const profileData = useMemo(() => {
    if (!account) return null;
    const projects = (readProjects() || []).filter(
      (p) =>
        p.accountId === account.id ||
        (p.email && normalizeEmail(p.email) === normalizeEmail(account.email))
    );
    const posts = (readPosts() || []).filter(
      (p) =>
        p.author?.accountId === account.id ||
        (account.name && p.author?.name === account.name)
    );
    return { projects, posts };
  }, [account]);

  const isOwnProfile = !!currentUser && currentUser.id === account?.id;

  const openStore = () => {
    setRedeemError(null);
    setLastRedeemed(null);
    setStoreOpen(true);
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedCode(code);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleRedeem = (reward) => {
    const res = redeemReward(reward.id);
    if (res.ok) {
      setLastRedeemed(res.reward);
      setRedeemError(null);
    } else {
      setRedeemError(
        res.error === "insufficient"
          ? t("points.insufficient")
          : t("points.redeemError")
      );
    }
  };

  if (!account || !profileData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="border border-slate-200 bg-white p-10 text-center max-w-md w-full">
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-slate-100 text-slate-400">
            <UserRound size={26} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            {t("community.profileNotFound")}
          </h1>
          <p className="text-sm text-slate-500 mb-6">{t("community.profileNotFoundDesc")}</p>
          <Link
            to="/community"
            className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-5 py-3 text-sm hover:bg-orange-600 transition-colors"
          >
            <ChevronRight size={16} />
            {t("community.backToFeed")}
          </Link>
        </div>
      </div>
    );
  }

  const { projects, posts } = profileData;
  const industryLabel = t(`getStarted.industry_options_${account.industry || "other"}`, {
    defaultValue: account.industry,
  });

  const statCards = [
    { label: t("community.statPosts"), value: posts.length, icon: FileText },
    { label: t("community.statProjects"), value: projects.length, icon: FolderOpen },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Profile hero */}
      <section className="bg-white border-b border-slate-100 pt-10 pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-5"
          >
            <div className="relative shrink-0">
              <img
                src={account.avatar}
                alt={account.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover border-2 border-slate-200"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = initialsAvatar(account.name);
                }}
              />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 break-words">
                  {account.name}
                </h1>
                {account.role === "Official" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 self-center">
                    <BadgeCheck size={12} />
                    {t("community.official")}
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 justify-center sm:justify-start text-sm text-slate-500">
                <span>@{account.username}</span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={13} />
                  {formatDate(account.joinedAt)}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase size={13} className="text-orange-500" />
                  {industryLabel}
                </span>
              </div>

              {(account.companyName || account.role) && (
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {account.companyName && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200">
                      <Building2 size={12} className="text-orange-500" />
                      {account.companyName}
                    </span>
                  )}
                  {account.role && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200">
                      <Briefcase size={12} />
                      {account.role}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-3 flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
                <Link
                  to="/community"
                  className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-bold px-4 py-2 hover:bg-orange-600 transition-colors"
                >
                  <Send size={14} />
                  {t("community.backToFeed")}
                </Link>
                <Link
                  to="/get-started"
                  className="inline-flex items-center gap-2 border border-orange-500 text-orange-600 text-sm font-bold px-4 py-2 hover:bg-orange-50 transition-colors"
                >
                  <ArrowUpRight size={14} />
                  {t("community.newProject")}
                </Link>
              </div>
            </div>

            <div className="hidden sm:flex flex-col text-right shrink-0">
              <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Mail size={12} />
                {account.email}
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="border border-slate-200 bg-slate-50 px-5 py-4 flex items-center gap-3"
              >
                <s.icon size={20} className="text-orange-500 shrink-0" />
                <div>
                  <p className="text-2xl font-black text-slate-900 leading-none">{s.value}</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                    {s.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty & Rewards */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-2">
        {/* Wallet card */}
        <div className="border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-100">
                  {t("points.balance")}
                </p>
                <p className="text-4xl font-black mt-1 flex items-center gap-2 text-white">
                  <Gem className="w-7 h-7" />
                  {account.points ?? 0}
                  <span className="text-lg font-bold text-orange-100">{t("points.pts")}</span>
                </p>
              </div>
              {isOwnProfile && (
                <button
                  onClick={openStore}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-orange-700 bg-white hover:bg-orange-50 transition-colors shadow"
                >
                  <Sparkles size={15} />
                  {t("points.redeem")}
                </button>
              )}
            </div>
            <p className="text-xs text-orange-100 mt-3">{t("points.walletHint")}</p>
          </div>

          {/* Redeemed codes */}
          {(account.redeemedRewards || []).length > 0 && (
            <div className="p-4 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {t("points.myCodes")}
              </p>
              <div className="flex flex-wrap gap-2">
                {(account.redeemedRewards || []).map((r) => (
                  <button
                    key={`${r.code}-${r.createdAt}`}
                    onClick={() => copyCode(r.code)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    title={t("points.copyCode")}
                  >
                    <Tag size={11} />
                    {r.code} -{r.discount}%
                    {copiedCode === r.code ? (
                      <Check size={11} />
                    ) : (
                      <Copy size={11} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Points history */}
        <div className="mt-6 border border-slate-200 bg-white shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Gem size={18} className="text-orange-500" />
            <h2 className="text-lg font-bold text-slate-900">
              {t("points.historyTitle")}
            </h2>
          </div>

          {(account.pointsHistory || []).length === 0 ? (
            <p className="text-sm text-slate-500">{t("points.noHistory")}</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {(account.pointsHistory || []).map((h) => (
                <li key={h.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 flex items-center justify-center shrink-0 border ${
                        h.amount > 0
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {h.amount > 0 ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {t(`points.reason_${h.action}`)}
                        {h.note && (
                          <span className="ml-1.5 text-[11px] font-bold text-orange-600 uppercase">
                            {h.note}
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400">{formatDate(h.createdAt)}</p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-black shrink-0 ${
                      h.amount > 0 ? "text-emerald-600" : "text-slate-500"
                    }`}
                  >
                    {h.amount > 0 ? "+" : ""}
                    {h.amount} {t("points.pts")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Client project history */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen size={18} className="text-orange-500" />
            <h2 className="text-lg font-bold text-slate-900">
              {t("community.historyTitle")}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {projects.length} {projects.length === 1 ? t("community.project") : t("community.projects")}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="border border-slate-200 bg-white p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-slate-100 text-slate-400">
              <FolderOpen size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              {t("community.noHistory")}
            </p>
            <p className="text-xs text-slate-500 mb-5 max-w-xs mx-auto">
              {t("community.noHistoryDesc")}
            </p>
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-bold px-4 py-2.5 hover:bg-orange-600 transition-colors"
            >
              <ArrowUpRight size={14} />
              {t("community.startProjectCta")}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <ProjectHistoryCard key={p.projectId || p.createdAt || p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      {/* Posts by author */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} className="text-orange-500" />
          <h2 className="text-lg font-bold text-slate-900">
            {t("community.theirPosts", { name: account.name.split(" ")[0] })}
          </h2>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            ({posts.length})
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="border border-dashed border-slate-300 bg-white p-8 text-center">
            <ImageIcon size={22} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-slate-500">{t("community.noPosts")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <article
                key={p.id}
                className="border border-slate-200 bg-white shadow-sm p-4 sm:p-5"
              >
                <p className="text-xs text-slate-400 mb-2">{formatDate(p.createdAt)}</p>
                {p.text && (
                  <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                    {p.text}
                  </p>
                )}
                {p.image && (
                  <img
                    src={p.image}
                    alt=""
                    className="mt-3 w-full max-h-[420px] object-cover bg-slate-100"
                  />
                )}
                {p.video && (
                  <video
                    src={p.video}
                    controls
                    playsInline
                    className="mt-3 w-full max-h-[420px] object-contain bg-slate-900"
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Rewards store modal */}
      <AnimatePresence>
        {storeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setStoreOpen(false)}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-12"
          >
            <div className="absolute inset-0 bg-black/60" />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md border border-slate-200 bg-white shadow-xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 shrink-0">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-orange-500" />
                    {t("points.storeTitle")}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{t("points.storeSub")}</p>
                </div>
                <button
                  onClick={() => setStoreOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Balance chip */}
              <div className="px-5 pt-4 shrink-0">
                <div className="flex items-center justify-between rounded-xl bg-orange-50 border border-orange-200 px-4 py-3">
                  <span className="text-sm font-semibold text-orange-700">
                    {t("points.currentBalance")}
                  </span>
                  <span className="text-lg font-black text-orange-700 flex items-center gap-1.5">
                    <Gem size={16} />
                    {account.points ?? 0} {t("points.pts")}
                  </span>
                </div>
              </div>

              {/* Reward cards */}
              <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
                {lastRedeemed && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      {t("points.redeemSuccess")}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-lg font-black text-emerald-700 tracking-wider">
                        {lastRedeemed.code}
                      </span>
                      <button
                        onClick={() => copyCode(lastRedeemed.code)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        {copiedCode === lastRedeemed.code ? (
                          <>
                            <Check size={12} /> {t("points.codeCopied")}
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> {t("points.copyCode")}
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-emerald-600 mt-2">{t("points.useOnOrder")}</p>
                  </div>
                )}

                {REWARDS.map((reward) => {
                  const available = (account.points ?? 0) >= reward.cost;
                  return (
                    <div
                      key={reward.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">{t(reward.title)}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{t(reward.subtitle)}</p>
                        <p className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200">
                          <Gem size={11} />
                          {reward.cost} {t("points.pts")}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!available}
                        className={`shrink-0 px-4 py-2 text-sm font-bold transition-colors ${
                          available
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        }`}
                      >
                        {t("points.redeem")}
                      </button>
                    </div>
                  );
                })}

                {redeemError && (
                  <p className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                    <AlertCircle size={15} />
                    {redeemError}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectHistoryCard({ project }) {
  const { t } = useTranslation();
  const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;
  const serviceNames = project.serviceNames?.length
    ? project.serviceNames
    : (project.serviceTitle || "").split(",").map((s) => s.trim()).filter(Boolean);
  const fileCount = Array.isArray(project.files) ? project.files.length : 0;

  return (
    <div className="border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {project.serviceTitle || t("community.project")}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border ${cfg.color}`}
            >
              <StatusIcon size={10} />
              {t(`community.projectStatus.${project.status || "pending"}`)}
            </span>
          </div>
          {project.companyName && (
            <p className="text-xs text-slate-500 mb-1.5">
              <Building2 size={11} className="inline mr-1 text-orange-500" />
              {project.companyName}
            </p>
          )}
          {project.description && (
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">
              {project.description}
            </p>
          )}

          {/* Service chips */}
          {serviceNames.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {serviceNames.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 uppercase tracking-wider"
                >
                  {s}
                </span>
              ))}
              {typeof project.industry === "string" && (
                <span className="px-2 py-0.5 text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 uppercase tracking-wider">
                  {t(`getStarted.industry_options_${project.industry}`, {
                    defaultValue: project.industry,
                  })}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          {project.price != null && (
            <span className="text-sm font-black text-slate-900">
              {new Intl.NumberFormat("fr-FR").format(Math.round(project.price))} MAD
            </span>
          )}
          {project.budget && (
            <span className="text-[11px] text-slate-400">
              {t("community.budget")}: {project.budget} MAD
            </span>
          )}
          {formatDate(project.createdAt) && (
            <span className="text-[11px] text-slate-400">{formatDate(project.createdAt)}</span>
          )}
        </div>
      </div>

      {/* Attachments */}
      {fileCount > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {t("community.attachments")} ({fileCount})
          </p>
          <div className="flex flex-wrap gap-2">
            {project.files.slice(0, 4).map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 max-w-[200px]"
              >
                <FileText size={11} className="text-orange-500 shrink-0" />
                <span className="truncate">{f.name || t("community.file")}</span>
              </span>
            ))}
            {fileCount > 4 && (
              <span className="px-2 py-1 text-[11px] font-bold text-slate-400">
                +{fileCount - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-3 flex justify-end">
        <Link
          to="/get-started"
          className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          {t("community.orderSimilar")}
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}