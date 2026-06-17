import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const projects = [
  {
    title: "NOVA Labs",
    category: "Web Design",
    tags: ["UI/UX", "Launch"],
    description: "A premium brand experience for a next-gen tech studio.",
  },
  {
    title: "Luna Collective",
    category: "Branding",
    tags: ["Identity", "Campaign"],
    description: "An elegant visual system for a lifestyle collective.",
  },
  {
    title: "Vibe Social",
    category: "Content",
    tags: ["UGC", "Trend"],
    description: "Social-first creative built to amplify organic reach.",
  },
  {
    title: "Orbit Media",
    category: "Marketing",
    tags: ["Strategy", "Digital"],
    description: "A performance-led campaign for a fast-paced media brand.",
  },
  {
    title: "Aster Studio",
    category: "Web Design",
    tags: ["Shop", "Motion"],
    description: "A refined e-commerce experience tailored for premium products.",
  },
  {
    title: "Halo Creative",
    category: "Branding",
    tags: ["Launch", "Naming"],
    description: "A complete brand rollout with signature visual language.",
  },
];

const categories = ["All", "Web Design", "Branding", "Content", "Marketing"];

export default function PortfolioGrid() {
  const { t } = useTranslation();
  const [active, setActive] = useState("All");

  const visibleProjects = useMemo(
    () => (active === "All" ? projects : projects.filter((project) => project.category === active)),
    [active],
  );

  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-indigo-300/80">{t("portfolio.title")}</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Select projects & creative systems.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] transition ${
                  active === category
                    ? "border-indigo-300 bg-indigo-300/10 text-white"
                    : "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              whileHover={{ y: -6 }}
              className="card-glass rounded-[2rem] border border-white/10 p-7"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-white/60">
                  {project.category}
                </span>
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">Case Study</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">{project.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
