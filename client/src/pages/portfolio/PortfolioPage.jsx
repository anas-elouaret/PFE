import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { projects, projectCategories } from "../../data/portfolioData";
import { Eye, Zap, Shield, BarChart3, Smartphone, Globe, Clock } from "lucide-react";

const features = [
  { icon: Zap, label: "Vitesse Ultra Rapide" },
  { icon: Shield, label: "Sécurité Maximale" },
  { icon: BarChart3, label: "SEO Optimisé" },
  { icon: Smartphone, label: "Design Responsive" },
  { icon: Globe, label: "Performance Globale" },
  { icon: Clock, label: "Support 24/7" },
  { icon: Eye, label: "Expérience Utilisateur" },
];

const SkeletonCard = () => (
  <div className="rounded-xl border border-slate-100 bg-white overflow-hidden animate-pulse">
    <div className="aspect-[16/10] bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 bg-slate-100 rounded-full" />
      <div className="h-5 w-3/4 bg-slate-100 rounded-lg" />
      <div className="h-3 w-full bg-slate-100 rounded-lg" />
      <div className="h-3 w-2/3 bg-slate-100 rounded-lg" />
    </div>
  </div>
);

export default function PortfolioPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});
  const [reviews, setReviews] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const hasProjects = projects.length > 0;
  const filtered = hasProjects && filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const toggleLike = useCallback((id) => setLiked((prev) => ({ ...prev, [id]: !prev[id] })), []);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative pt-28 pb-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border border-slate-200 bg-slate-50 text-slate-500 mb-6">
              <Eye className="w-3 h-3" />
              {t("portfolio.badge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900"
          >
            {t("portfolio.heroPrefix")}{" "}
            <span className="text-indigo-600">{t("portfolio.heroHighlight")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            {t("portfolio.subtitle")}
          </motion.p>

          {hasProjects && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex items-center justify-center gap-2"
            >
              <span className="text-3xl font-extrabold text-slate-900">{projects.length}</span>
              <span className="text-sm text-slate-500 font-medium">{t("portfolio.projectsDelivered")}</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* FEATURES BAR */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 py-6">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`flex flex-col items-center gap-2 text-center ${
                  i < features.length - 1 ? "lg:border-r lg:border-slate-200/60" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <f.icon className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-xs font-bold tracking-wide text-slate-800">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTERS */}
      {hasProjects && (
        <section className="py-8 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-2"
            >
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    filter === cat
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* PROJECTS GRID */}
      <section className="px-4 pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {loading && hasProjects ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : !hasProjects ? (
            <EmptyState />
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
              <p className="text-4xl mb-4">&#128270;</p>
              <p className="text-lg text-slate-500 font-medium">{t("portfolio.noProjectsInCategory")}</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    liked={!!liked[project.id]}
                    onLike={() => toggleLike(project.id)}
                    reviewCount={reviews[project.id]?.length || project.comments}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white border-t border-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {t("portfolio.ctaTitle")} <span className="text-indigo-600">{t("portfolio.ctaHighlight")}</span> ?
          </h2>
          <p className="mt-4 text-lg text-slate-500">{t("portfolio.ctaDescription")}</p>
          <div className="mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-8 py-3.5 rounded-lg text-sm hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {t("portfolio.startProject")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ── Empty State ────────────────────────────────── */

function EmptyState() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-24 flex items-center justify-center"
    >
      <div className="max-w-lg mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("portfolio.emptyTitle")}</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          {t("portfolio.emptyDescription")}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {["Web Design", "Branding", "UGC", "Video"].map((tag) => (
            <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Project Card ────────────────────────────────── */

function ProjectCard({ project, index, liked, onLike, reviewCount }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [imgLoaded, setImgLoaded] = useState(false);

  const stars = Math.floor(project.rating);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      ref={ref}
    >
      <Link to={`/portfolio/${project.id}`} className="block group">
        <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 overflow-hidden">
          {/* Thumbnail */}
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
            {project.image ? (
              <>
                {!imgLoaded && <div className="absolute inset-0 bg-slate-100 animate-pulse" />}
                <motion.img
                  src={project.image}
                  alt={project.title}
                  onLoad={() => setImgLoaded(true)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Category badge */}
            {project.category && (
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-semibold text-slate-700 uppercase tracking-wider shadow-sm">
                  {project.category}
                </span>
              </div>
            )}

            {/* Rating badge */}
            {project.rating > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm">
                <span className="text-amber-500 text-xs">&#9733;</span>
                <span className="text-[10px] font-bold text-slate-800">{project.rating}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {project.title || t("portfolio.projectTitle")}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
              {project.shortDescription || project.description || t("portfolio.projectDescription")}
            </p>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-0.5 bg-slate-50 rounded-md text-[10px] font-medium text-slate-400">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Meta row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                {project.rating > 0 ? (
                  [1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={s <= stars ? "text-amber-400" : "text-slate-200"}>&#9733;</span>
                  ))
                ) : (
                  <span className="text-slate-400 text-[10px]">{t("portfolio.notRated")}</span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <button
                  onClick={(e) => { e.preventDefault(); onLike(); }}
                  className={`flex items-center gap-1 transition-colors ${liked ? "text-indigo-600" : "hover:text-indigo-600"}`}
                >
                  {liked ? "\u2764" : "\u2661"}
                  <span>{project.likes + (liked ? 1 : 0)}</span>
                </button>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {reviewCount || 0}
                </span>
              </div>
            </div>

            {/* Bottom row — budget & satisfaction */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>{project.budget || ""}</span>
              {project.satisfaction > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.satisfaction}%` }}
                      viewport={{ once: true }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                  <span className="text-indigo-600 font-semibold">{project.satisfaction}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
