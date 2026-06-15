import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const creators = [
  { name: "Yasmine T.", category: "Lifestyle", handle: "@yasmine_creates", price: "890",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80" },
  { name: "Mehdi R.", category: "Tech", handle: "@mehdi.tech", price: "1,200",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80" },
  { name: "Sara L.", category: "Health & Beauty", handle: "@sara_wellness", price: "750",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80" },
];

export default function PortfolioSection() {
  const { t } = useLanguage();

  return (
    <section id="portfolio" className="relative mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div animate={{ x: [0, -60, 0], scale: [1, 1.1, 1] }} transition={{ duration: 16, repeat: Infinity }}
        className="absolute top-1/2 left-0 -z-10 w-[500px] h-[500px] bg-[#d1ff00]/10 blur-[120px] rounded-full -translate-x-2/3 -translate-y-1/2" />

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-20">
        <div>
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <span className="w-2 h-2 bg-[#d1ff00] rounded-full"></span> {t.portfolioBadge}
          </div>
          <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] text-black">
            {t.portfolioTitle1}<br /><span className="text-[#d1ff00] [-webkit-text-stroke:2px_black]">{t.portfolioTitle2}</span>
          </h2>
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link to="/catalog" className="flex items-center gap-3 bg-black text-white font-black px-10 py-5 rounded-[2rem] text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all">
            {t.portfolioCta} <span className="text-[#d1ff00]">→</span>
          </Link>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {creators.map((creator, index) => (
          <motion.article key={creator.name}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ y: -12 }}
            className="group relative aspect-[3/4] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-[box-shadow] duration-500">
            <img src={creator.image} alt={creator.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            <div className="absolute top-6 right-6 bg-[#d1ff00] text-black font-black text-[11px] px-4 py-2 rounded-2xl tracking-widest uppercase shadow-lg">
              {creator.price} MAD
            </div>
            <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md border border-white/10 text-white font-black text-[10px] px-4 py-2 rounded-2xl tracking-widest uppercase">
              {creator.category}
            </div>
            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-2xl font-black text-white tracking-tight">{creator.name}</h3>
              <p className="text-gray-400 font-bold text-sm mt-1">{creator.handle}</p>
              <motion.button whileTap={{ scale: 0.95 }}
                className="mt-6 w-full bg-white text-black font-black text-xs py-4 rounded-2xl uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#d1ff00]">
                {t.portfolioViewProfile}
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
