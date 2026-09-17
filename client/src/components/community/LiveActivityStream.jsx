import { useTranslation } from "react-i18next";
import {
  Activity as ActivityIcon,
  MessageSquareText,
  Megaphone,
  Trophy,
} from "lucide-react";
import { useCommunityAuth } from "../../context/CommunityAuthContext";
import { initialsAvatar } from "../../utils/communityStorage";

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

const TYPE_META = {
  service_request: { icon: MessageSquareText, tint: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  community_post: { icon: Megaphone, tint: "bg-orange-50 text-orange-600 border-orange-200" },
  milestone: { icon: Trophy, tint: "bg-amber-50 text-amber-600 border-amber-200" },
};

function formatActivity(activity, t) {
  const params = activity.params || {};
  switch (activity.type) {
    case "service_request":
      return t("activity.serviceRequest", { service: params.service || "" });
    case "community_post":
      return t("activity.communityPost");
    case "milestone":
      return t("activity.milestone", { points: params.points ?? "" });
    default:
      return "";
  }
}

export default function LiveActivityStream({ className = "" }) {
  const { t } = useTranslation();
  const { activities } = useCommunityAuth();

  return (
    <div
      className={`border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-900 flex items-center gap-1.5">
            <ActivityIcon size={13} className="text-emerald-600" />
            {t("activity.title")}
          </h3>
        </div>
        <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200">
          {t("activity.live")}
        </span>
      </div>

      {/* Body */}
      {activities.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <span className="mx-auto w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400">
            <ActivityIcon size={18} />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-500">
            {t("activity.empty")}
          </p>
        </div>
      ) : (
        <ul className="max-h-72 overflow-y-auto divide-y divide-slate-50">
          {activities.map((a) => {
            const meta = TYPE_META[a.type] || TYPE_META.community_post;
            const Icon = meta.icon;
            return (
              <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                <div className="relative shrink-0">
                  <img
                    src={a.actor?.avatar || "/logo.png"}
                    alt={a.actor?.name || ""}
                    className="w-9 h-9 object-cover border border-slate-200"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = initialsAvatar(a.actor?.name || "G");
                    }}
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-5 h-5 p-0.5 flex items-center justify-center border bg-white ${meta.tint}`}
                  >
                    <Icon size={11} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug text-slate-600">
                    <span className="font-bold text-slate-900">
                      {a.actor?.name || t("community.you")}
                    </span>{" "}
                    {formatActivity(a, t)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {timeAgo(a.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}