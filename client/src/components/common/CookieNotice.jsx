import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Cookie, X } from "lucide-react";

const KEY = "cookie_notice_seen";

/**
 * A one-time notice about what this site stores.
 *
 * Not a consent banner, because there is nothing here to consent to: the
 * site sets one `httpOnly` session cookie and keeps a few keys in local
 * storage for sign-in and the chosen language. No analytics, no advertising
 * pixel, no third-party tracker. Asking someone to "accept" trackers that do
 * not exist is a click for nothing, and dressing a notice up as a choice is
 * the kind of dark pattern this pass is meant to remove.
 *
 * If a measurement tool is ever added, this is where the real choice goes —
 * and the cookie policy already says so.
 */
export default function CookieNotice() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Storage can throw in a private window; a notice is not worth a crash.
    let seen = false;
    try {
      seen = localStorage.getItem(KEY) === "1";
    } catch {
      seen = true;
    }
    if (!seen) {
      const id = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(id);
    }
    return undefined;
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={t("cookie_notice_label", "Information sur les données")}
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:flex-row sm:items-center sm:gap-5">
        <Cookie className="h-6 w-6 shrink-0 text-orange-600" aria-hidden="true" />

        <p className="flex-1 text-sm leading-6 text-slate-700">
          {t("cookie_notice_text")}{" "}
          <Link
            to="/cookies"
            className="font-bold text-slate-900 underline decoration-orange-500 decoration-2 underline-offset-2 hover:text-orange-700"
          >
            {t("cookie_notice_link")}
          </Link>
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 bg-slate-900 px-6 text-sm font-black text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          <X size={15} aria-hidden="true" />
          {t("cookie_notice_dismiss")}
        </button>
      </div>
    </div>
  );
}
