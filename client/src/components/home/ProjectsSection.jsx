import { useTranslation } from "react-i18next";
import { ArrowUpRight, Compass, Gamepad2 } from "lucide-react";

/**
 * The two GROWSTACK products that live outside this site.
 *
 * Both are real deployments, not mockups, so each card carries a screenshot
 * of the thing itself and one checkable fact about it rather than a
 * description. They open in a new tab because they are separate sites: a
 * visitor who follows one has not finished with this one.
 */
const PROJECTS = [
  {
    key: "aides",
    href: "https://growstack-aides.vercel.app",
    image: "/projects/aides.jpg",
    Icon: Compass,
  },
  {
    key: "game",
    href: "https://growstack-game.vercel.app",
    image: "/projects/game.jpg",
    Icon: Gamepad2,
  },
];

export default function ProjectsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4">
            {t("projects_title")}
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            {t("projects_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PROJECTS.map(({ key, href, image, Icon }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col border-2 border-black bg-white transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-black bg-slate-900">
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <span className="inline-flex w-fit items-center gap-2 bg-slate-900 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-white">
                  <Icon size={13} aria-hidden="true" />
                  {t(`projects_${key}_label`)}
                </span>

                <h3 className="mt-4 text-xl sm:text-2xl font-black leading-snug text-slate-900">
                  {t(`projects_${key}_title`)}
                </h3>

                <p className="mt-3 flex-1 text-sm sm:text-base leading-relaxed text-slate-600">
                  {t(`projects_${key}_desc`)}
                </p>

                {/* One checkable fact, not a selling line. */}
                <p className="mt-4 border-s-2 border-orange-500 ps-3 text-xs sm:text-sm font-semibold text-slate-700">
                  {t(`projects_${key}_fact`)}
                </p>

                <span className="mt-6 inline-flex min-h-[44px] w-fit items-center gap-2 border-2 border-slate-900 px-5 py-2.5 text-sm font-black text-slate-900 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                  {t(`projects_${key}_cta`)}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
