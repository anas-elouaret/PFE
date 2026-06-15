import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

const Check = () => (
  <div className="w-8 h-8 bg-[#d1ff00] rounded-full flex items-center justify-center mx-auto shadow-md shadow-[#d1ff00]/30">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
  </div>
);
const Cross = () => (
  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
  </div>
);

export default function AboutSection() {
  const { t } = useLanguage();

  const rows = [
    { key: "row1", growstack: true,  agencies: true,  freelancers: false, influencer: false },
    { key: "row2", growstack: true,  agencies: false, freelancers: false, influencer: false },
    { key: "row3", growstack: true,  agencies: false, freelancers: false, influencer: false },
    { key: "row4", growstack: true,  agencies: true,  freelancers: false, influencer: false },
    { key: "row5", growstack: true,  agencies: false, freelancers: false, influencer: false },
    { key: "row6", growstack: true,  agencies: true,  freelancers: false, influencer: false },
  ];

  return (
    <section id="about" className="relative mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-0 right-1/4 -z-10 w-[600px] h-[600px] bg-[#d1ff00]/10 blur-[120px] rounded-full" />

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <span className="w-2 h-2 bg-[#d1ff00] rounded-full"></span> {t.aboutBadge}
        </div>
        <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] text-black">
          {t.aboutTitle1}<br /><span className="text-[#d1ff00] [-webkit-text-stroke:2px_black]">{t.aboutTitle2}</span>
        </h2>
        <p className="mt-8 text-gray-400 font-medium max-w-xl mx-auto text-xl">{t.aboutSub}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
        className="overflow-hidden rounded-[3rem] border-2 border-gray-50 shadow-2xl shadow-black/5">
        <table className="w-full border-collapse text-sm text-[#212121]">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-8 py-6 text-left text-xs uppercase tracking-[0.18em] text-gray-400 font-black w-1/3">{t.colFeature}</th>
              <th className="px-6 py-6 text-center">
                <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <span className="w-2 h-2 bg-[#d1ff00] rounded-full"></span> Growstack
                </div>
              </th>
              <th className="px-6 py-6 text-center text-xs uppercase tracking-[0.14em] text-gray-400 font-black">Agencies</th>
              <th className="px-6 py-6 text-center text-xs uppercase tracking-[0.14em] text-gray-400 font-black">Freelancers</th>
              <th className="px-6 py-6 text-center text-xs uppercase tracking-[0.14em] text-gray-400 font-black">Influencers</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((row, i) => (
              <motion.tr key={row.key} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6 font-bold text-black">{t[row.key]}</td>
                <td className="px-6 py-6 text-center">{row.growstack ? <Check /> : <Cross />}</td>
                <td className="px-6 py-6 text-center">{row.agencies ? <Check /> : <Cross />}</td>
                <td className="px-6 py-6 text-center">{row.freelancers ? <Check /> : <Cross />}</td>
                <td className="px-6 py-6 text-center">{row.influencer ? <Check /> : <Cross />}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
        className="text-center text-gray-400 font-medium mt-8 text-sm">{t.aboutNote}</motion.p>
    </section>
  );
}
