import { motion } from "framer-motion";

const team = [
  {
    name: "Mila Stern",
    role: "Creative Director",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Noah Reed",
    role: "Brand Strategist",
    avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Eva Stone",
    role: "Motion Designer",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
];

export default function TeamSection() {
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.32em] text-indigo-300/80">Team</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            A lean team with big creative impact.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {team.map((member, index) => (
            <motion.article
              key={member.name}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="card-glass rounded-[2rem] border border-white/10 p-6"
            >
              <div className="relative overflow-hidden rounded-[1.75rem] bg-white/5">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-72 w-full object-cover"
                />
              </div>
              <div className="mt-5">
                <h3 className="text-2xl font-semibold text-white">{member.name}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/50">{member.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
