const stats = [
  { label: "Clients", value: "38+" },
  { label: "Projects", value: "128" },
  { label: "Years", value: "12" },
];

export default function StatsSection() {
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] bg-[#0f091b]/80 border border-white/10 p-8 sm:flex-row sm:justify-between">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[1.75rem] bg-white/5 p-6 text-center backdrop-blur-md">
            <p className="text-5xl font-semibold text-white">{stat.value}</p>
            <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
