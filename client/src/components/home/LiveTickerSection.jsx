import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const ACTIVITIES = [
  "activity1", "activity2", "activity3",
  "activity4", "activity5", "activity6",
];

function TickerTrack({ items }) {
  return (
    <div className="flex items-center gap-16 shrink-0">
      {items.map((text, i) => (
        <span key={i} className="text-sm font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">
          <span className="text-indigo-600 mr-2">◆</span>
          {text}
        </span>
      ))}
    </div>
  );
}

export default function LiveTickerSection() {
  const { t } = useTranslation();

  const items = ACTIVITIES.map((k) => t(k));

  return (
    <section className="py-10 bg-white overflow-hidden border-y-2 border-black">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex overflow-hidden"
      >
        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          <TickerTrack items={items} />
          <TickerTrack items={items} />
        </div>
      </motion.div>
    </section>
  );
}
