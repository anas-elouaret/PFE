import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../../data/portfolioData";
const emojis = ["\uD83D\uDC4D", "\uD83D\uDE0D", "\uD83D\uDC4F", "\uD83D\uDD25", "\uD83E\uDD29", "\uD83C\uDF1F"];

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reactions, setReactions] = useState({});
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setActiveImage(0);
    setUserRating(0);
    setReviewText("");
    setSubmitted(false);
    setLiked(false);
    setLocalLikes(project?.likes || 0);
    window.scrollTo(0, 0);
  }, [id, project]);

  if (!project) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-3xl font-black mb-4">{t("portfolio.projectNotFound")}</h1>
            <p className="text-zinc-500 mb-8">{t("portfolio.projectNotFoundDesc")}</p>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-widest shadow-md hover:shadow-lg transition-shadow"
            >
              {t("portfolio.backToPortfolio")}
            </Link>
          </motion.div>
        </div>
      </div>
  );
}

  const handleLike = () => {
    setLiked(!liked);
    setLocalLikes((c) => (liked ? c - 1 : c + 1));
  };

  const handleReact = (emoji) => {
    setReactions((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !userRating) return;
    setReviews((prev) => [
      {
        id: Date.now(),
        name: t("portfolio.you"),
        rating: userRating,
        text: reviewText,
        date: new Date().toLocaleDateString("fr-FR"),
      },
      ...prev,
    ]);
    setReviewText("");
    setUserRating(0);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const hasGallery = project.gallery && project.gallery.length > 0;
  const hasTimeline = project.timeline && project.timeline.length > 0;
  const hasMetrics = project.metrics && project.metrics.length > 0;
  const hasClientReview = project.clientReview;
  const hasTechnologies = project.technologies && project.technologies.length > 0;

  return (
    <div className="relative text-slate-900">

      {/* Back button */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 pb-4">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-slate-900 transition-colors group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          {t("portfolio.backToPortfolio")}
        </Link>
      </div>

      <div className="relative">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="relative px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid lg:grid-cols-2 gap-12 items-start"
            >
              {/* Gallery */}
              <div className="space-y-4">
                {hasGallery ? (
                  <>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[16/10]">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activeImage}
                          src={project.gallery[activeImage]}
                          alt=""
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4 }}
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-transparent" />
                    </div>
                    {project.gallery.length > 1 && (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {project.gallery.map((img, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveImage(i)}
                            className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                              i === activeImage ? "border-indigo-500" : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 aspect-[16/10] flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-zinc-600">{t("portfolio.galleryComingSoon")}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Info panel */}
              <div className="space-y-8">
                <div>
                  {project.category && (
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-indigo-100 border border-slate-200 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        {project.category}
                      </span>
                      {project.date && <span className="text-xs text-zinc-500">{project.date}</span>}
                    </div>
                  )}
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                    {project.title || t("portfolio.projectTitle")}
                  </h1>
                  <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
                    {project.description || t("portfolio.projectDescription")}
                  </p>
                </div>

                {/* Metrics */}
                {hasMetrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {project.metrics.map((m) => (
                      <div key={m.label} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                        <span className="block text-2xl font-black text-slate-900">
                          {m.value}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1 block">{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Budget, Rating, Likes */}
                <div className="flex flex-wrap gap-6">
                  {project.budget && (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">{t("portfolio.budget")}</span>
                      <span className="font-bold">{project.budget}</span>
                    </div>
                  )}
                  {project.rating > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">{t("portfolio.rating")}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={s <= Math.floor(project.rating) ? "text-yellow-400" : "text-zinc-700"}>
                            &#9733;
                          </span>
                        ))}
                        <span className="ml-1 font-bold text-sm">{project.rating}</span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                      liked ? "border-indigo-500/30 bg-indigo-100 text-indigo-600" : "border-slate-200 bg-slate-50 text-zinc-400 hover:text-slate-900"
                    }`}
                  >
                    <span className="text-lg">{liked ? "\u2764" : "\u2661"}</span>
                    <span className="font-bold text-sm">{localLikes}</span>
                  </button>
                </div>

                {/* Technologies */}
                {hasTechnologies && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-3">{t("portfolio.techAndServices")}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STORY & OBJECTIVES ──────────────────── */}
        {(project.story || project.objectives || project.results) && (
          <section className="px-4 py-20">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {project.story && (
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600">{t("portfolio.storyLabel")}</span>
                    <h2 className="text-3xl font-black mt-3 mb-6 tracking-tight">{t("portfolio.storyTitle")}</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg">{project.story}</p>
                  </motion.div>
                )}
                {project.objectives && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600">{t("portfolio.objectivesLabel")}</span>
                    <h2 className="text-3xl font-black mt-3 mb-6 tracking-tight">{t("portfolio.objectivesTitle")}</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg">{project.objectives}</p>
                    {project.results && (
                      <div className="mt-8 p-6 rounded-xl border border-slate-200 bg-slate-50">
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600">{t("portfolio.resultsLabel")}</span>
                        <p className="mt-3 text-slate-900 font-medium">{project.results}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── BEFORE / AFTER ──────────────────────────────────── */}
        {project.beforeAfter && (project.beforeAfter.before || project.beforeAfter.after) && (
          <section className="px-4 py-20">
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t("portfolio.transformationLabel")}</span>
                <h2 className="text-3xl sm:text-4xl font-black mt-3 tracking-tight">{t("portfolio.beforeAfterTitle")}</h2>
              </motion.div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <div className="px-4 py-2 bg-slate-100 text-xs font-bold uppercase tracking-wider text-zinc-500">{t("portfolio.before")}</div>
                  {project.beforeAfter.before ? (
                    <img src={project.beforeAfter.before} alt="Before" className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-slate-50 flex items-center justify-center text-zinc-600 text-sm">
                      {t("portfolio.beforeImageComing")}
                    </div>
                  )}
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <div className="px-4 py-2 bg-indigo-100 text-xs font-bold uppercase tracking-wider text-indigo-600">{t("portfolio.after")}</div>
                  {project.beforeAfter.after ? (
                    <img src={project.beforeAfter.after} alt="After" className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-slate-50 flex items-center justify-center text-zinc-600 text-sm">
                      {t("portfolio.afterImageComing")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── TIMELINE ──────────────────────────────────── */}
        {hasTimeline && (
          <section className="px-4 py-20">
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t("portfolio.planningLabel")}</span>
                <h2 className="text-3xl sm:text-4xl font-black mt-3 tracking-tight">{t("portfolio.timelineTitle")}</h2>
              </motion.div>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-indigo-400/50 to-transparent" />
                <div className="space-y-12">
                  {project.timeline.map((phase, i) => (
                    <motion.div
                      key={phase.phase}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-20"
                    >
                      <div className="absolute left-5 top-1.5 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-md">
                        {i + 1}
                      </div>
                      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-500/20 transition-colors">
                        <h3 className="font-bold text-lg">{phase.phase}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-zinc-500">
                          {phase.date && <span>{phase.date}</span>}
                          {phase.duration && <span className="text-indigo-600">{phase.duration}</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CLIENT REVIEW ──────────────────────────────────── */}
        {hasClientReview && (
          <section className="px-4 py-20">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative p-8 sm:p-12 rounded-[2rem] border border-slate-200 bg-slate-100 overflow-hidden"
              >
                <div className="absolute top-0 right-0 text-[200px] font-black text-slate-200 leading-none pointer-events-none select-none">
                  &ldquo;
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    {project.clientReview.avatar ? (
                      <img src={project.clientReview.avatar} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/30" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold text-white">
                        {(project.clientReview.name || "C")[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-lg">{project.clientReview.name || t("portfolio.client")}</p>
                      {project.clientReview.role && <p className="text-sm text-zinc-500">{project.clientReview.role}</p>}
                    </div>
                    {project.clientReview.rating > 0 && (
                      <div className="ml-auto flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={s <= project.clientReview.rating ? "text-yellow-400 text-lg" : "text-zinc-700 text-lg"}>
                            &#9733;
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed font-medium italic">
                    &ldquo;{project.clientReview.text || t("portfolio.clientReviewPlaceholder")}&rdquo;
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ── REACTIONS & REVIEWS ──────────────────────────────────── */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-black mb-8 tracking-tight">{t("portfolio.reactionsTitle")}</h2>

              {/* Emoji reactions */}
              <div className="flex flex-wrap gap-3 mb-10">
                {emojis.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReact(emoji)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all"
                  >
                    <span className="text-xl">{emoji}</span>
                    {reactions[emoji] > 0 && <span className="text-xs font-bold text-zinc-400">{reactions[emoji]}</span>}
                  </motion.button>
                ))}
              </div>

              {/* Review form */}
              <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-slate-50 mb-10">
                <h3 className="font-bold text-lg mb-4">{t("portfolio.shareReview")}</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-medium">{t("portfolio.yourRating")}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <motion.button
                          key={s}
                          type="button"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setUserRating(s)}
                          className="text-2xl transition-colors"
                        >
                          <span className={s <= (hoverRating || userRating) ? "text-yellow-400" : "text-zinc-700"}>
                            &#9733;
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={t("portfolio.reviewPlaceholder")}
                    rows={3}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-500/40 focus:bg-white transition-all resize-none"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!reviewText.trim() || !userRating}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-full text-sm font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                  >
                    {t("portfolio.publish")}
                  </motion.button>
                  {submitted && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-sm mt-2">
                      {t("portfolio.thanksForReview")}
                    </motion.p>
                  )}
                </form>
              </div>

              {/* Submitted reviews */}
              {reviews.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    {t("portfolio.recentReviews", { count: reviews.length })}
                  </h4>
                  {reviews.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                          {r.name[0]}
                        </span>
                        <span className="font-medium text-sm">{r.name}</span>
                        <div className="flex gap-0.5 ml-auto">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className={s <= r.rating ? "text-yellow-400 text-xs" : "text-zinc-700 text-xs"}>
                              &#9733;
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400">{r.text}</p>
                      <p className="text-[10px] text-zinc-600 mt-2">{r.date}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── RELATED PROJECTS ──────────────────────────── */}
        {projects.length > 1 && (
          <section className="px-4 py-20">
            <div className="max-w-7xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t("portfolio.exploreLabel")}</span>
                <h2 className="text-3xl sm:text-4xl font-black mt-3 tracking-tight">{t("portfolio.otherProjects")}</h2>
              </motion.div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter((p) => p.id !== project.id)
                  .slice(0, 3)
                  .map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link to={`/portfolio/${p.id}`} className="group block">
                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 hover:border-indigo-500/20 transition-all">
                          <div className="aspect-[16/10] overflow-hidden">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            {p.category && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{p.category}</span>
                            )}
                            <h3 className="font-bold mt-1 group-hover:text-indigo-600 transition-colors">
                              {p.title || t("portfolio.projectTitle")}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
