import { motion } from "framer-motion";

const projects = [
  {
    title: "Nebula Studio",
    category: "Brand Identity",
    description: "A modern launch campaign for a luxury lifestyle brand.",
    accent: "Vibrant visuals and immersive storytelling.",
  },
  {
    title: "Pulse Commerce",
    category: "Web Experience",
    description: "A high-conversion e-commerce build for activewear.",
    accent: "Performance-first interactions and motion.",
  },
  {
    title: "Aurora Stories",
    category: "Content Creation",
    description: "UGC-driven social creative with cinematic editing.",
    accent: "Bold narrative and audience-first media.",
  },
  {
    title: "Luma Social",
    category: "Campaign Strategy",
    description: "A cross-platform launch for premium product storytelling.",
    accent: "Digital growth powered by creative systems.",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-300/80">Featured work</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Designed for ambitious brands.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Explore our latest digital campaigns, product launches and content directions crafted for modern audiences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="card-glass card-glow overflow-hidden rounded-[2rem] border border-white/10 p-8"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-indigo-300/80">
                {project.category}
              </span>
              <h3 className="mt-5 text-3xl font-semibold text-white">{project.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">{project.description}</p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
                {project.accent}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
