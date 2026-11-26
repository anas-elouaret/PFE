import { useTranslation } from "react-i18next";

/**
 * The first thing the Tab key reaches on every public page.
 *
 * Hidden off-screen rather than with `display:none`, because a hidden
 * element cannot take focus and the link would never appear. It sits in the
 * normal flow only while focused, so it never shifts the layout.
 */
export default function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      href="#main"
      className="absolute start-4 top-4 z-[100] -translate-y-[200%] bg-slate-900 px-5 py-3 text-sm font-black text-white transition-transform focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
    >
      {t("skip_to_content", "Aller au contenu")}
    </a>
  );
}
