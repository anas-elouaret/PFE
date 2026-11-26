import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ─── SVG Icons ─────────────────────────────────────────── */
const Search    = ({ size = 20, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const MapPin    = ({ size = 16, fill = "none", strokeWidth = 2, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Play      = ({ size = 24, fill = "none", className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const ChevronDown = ({ size = 14, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>;
const Heart     = ({ size = 14, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
const Tag       = ({ size = 14, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>;
const XIcon     = ({ size = 14, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6L6 18M6 6l12 12"/></svg>;
const Laptop    = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>;
const FashionBag = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const Car       = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;

/* ─── Data ───────────────────────────────────────────────── */
// Deliberately empty. This held eight invented creators with stock
// photographs used as their faces; both the people and their rates were
// fabricated. Add real creators here, with their own permission and their
// own photographs, and the catalogue below lights up again.
const ALL_CREATORS = [];

const CITIES  = ["All Cities", "Agadir", "Casablanca", "El Jadida", "Marrakech", "Mohammedia", "Nador", "Rabat", "Safi", "Tangier", "Tetouan"];
const NICHES  = ["All Niches ⚡", "Cooking 🥘", "Fashion 👗", "Fitness 👟", "Health 💉", "Pets 🐾", "Tech 💻"];
const SORT_OPTIONS = ["Recommended", "Price: Low to High", "Price: High to Low", "Name: A–Z"];

/* ─── 3D Tilt Card ───────────────────────────────────────── */
const CreatorCard = ({ creator, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(useSpring(y), [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(useSpring(x), [-0.5, 0.5], ["-10deg", "10deg"]);

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group relative aspect-[9/16] rounded-[2rem] overflow-hidden bg-gray-900 cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
    >
      <img src={creator.image} alt={creator.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

      {/* LIVE badge for every other card */}
      {index % 2 === 0 && (
        <div className="absolute top-4 start-4 z-10 flex items-center gap-1.5 bg-red-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> LIVE
        </div>
      )}

      {/* Price */}
      <div style={{ transform: "translateZ(50px)" }} className="absolute top-4 end-4 z-10 bg-[#ff5722] px-3 py-1.5 rounded-xl text-[10px] font-black text-black shadow-lg">
        {creator.price} <span className="opacity-50">MAD</span>
      </div>

      {/* City */}
      <div style={{ transform: "translateZ(30px)" }} className={`absolute z-10 ${index % 2 === 0 ? "top-12" : "top-4"} start-4`}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[9px] font-black text-white">
          <MapPin size={10} fill="#ff5722" strokeWidth={0} /> {creator.city}
        </div>
      </div>

      {/* Play */}
      <div style={{ transform: "translateZ(80px)" }} className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
        <Play size={22} fill="#fff" className="ms-1" />
      </div>

      {/* Bottom info */}
      <div style={{ transform: "translateZ(40px)" }} className="absolute bottom-0 start-0 w-full p-5 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full border-2 border-[#ff5722] overflow-hidden shrink-0 shadow-xl">
            <img src={creator.image} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-sm font-black block leading-tight">{creator.name}</span>
            <span className="text-[10px] text-white/40 font-bold">@growstack</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-[#ff5722] text-black px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase">
            {creator.icon} {creator.tag}
          </div>
          <motion.button whileTap={{ scale: 0.8 }} className="p-2 bg-black/40 backdrop-blur-md rounded-xl hover:bg-red-500 transition-colors">
            <Heart size={13} className="text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Empty State ────────────────────────────────────────── */
const EmptyState = ({ onReset }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-32 text-center"
    >
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 border-2 border-gray-100">
        <Search size={32} className="text-gray-300" />
      </div>
      <h3 className="text-2xl font-black text-black mb-3">{t("cat_catalog_empty_title")}</h3>
      <p className="text-gray-400 font-medium mb-8 max-w-xs">{t("cat_catalog_empty_sub")}</p>
      <motion.button
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        onClick={onReset}
        className="bg-black text-white font-black px-10 py-4 rounded-2xl text-xs uppercase tracking-widest"
      >
        {t("cat_catalog_empty_btn")}
      </motion.button>
    </motion.div>
  );
};


/* ─── Active Filter Chip ─────────────────────────────────── */
const FilterChip = ({ label, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="flex items-center gap-2 bg-black text-white text-[10px] font-black px-3 py-2 rounded-xl uppercase tracking-wider"
  >
    {label}
    <button onClick={onRemove} className="hover:text-[#ff5722] transition-colors"><XIcon size={11} /></button>
  </motion.div>
);

/* ─── Main Component ─────────────────────────────────────── */
export default function CreatorCatalogSection() {
  const { t } = useTranslation();
  const [search,   setSearch]   = useState("");
  const [city,     setCity]     = useState("All Cities");
  const [niches,   setNiches]   = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy,   setSortBy]   = useState("rec");
  const [liked,    setLiked]    = useState(new Set());

  // Sort options: stable key → translated label
  const SORT_OPTIONS = [
    { key: "rec",       label: t("cat_sort_rec") },
    { key: "priceLow",  label: t("cat_sort_price_low") },
    { key: "priceHigh", label: t("cat_sort_price_high") },
    { key: "nameAZ",    label: t("cat_sort_name") },
  ];

  /* ── Filter + Sort logic ── */
  const filtered = useMemo(() => {
    let result = [...ALL_CREATORS];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.niche.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q)
      );
    }

    // City
    if (city && city !== "All Cities") {
      result = result.filter(c => c.city.toLowerCase() === city.toLowerCase());
    }

    // Niches (multi-select — strip emoji suffix)
    if (niches.length > 0) {
      const nicheNames = niches.map(n => n.split(" ")[0]);
      result = result.filter(c => nicheNames.includes(c.niche));
    }

    // Price range
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) result = result.filter(c => c.price >= min);
    if (!isNaN(max)) result = result.filter(c => c.price <= max);

    // Sort (language-agnostic stable keys)
    if (sortBy === "priceLow")  result.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") result.sort((a, b) => b.price - a.price);
    if (sortBy === "nameAZ")    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [search, city, niches, minPrice, maxPrice, sortBy]);

  /* ── Helpers ── */
  const toggleNiche = (n) => {
    const base = n.split(" ")[0];
    if (base === "All") { setNiches([]); return; }
    setNiches(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
  };

  const toggleLike = (id) => setLiked(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const resetAll = () => {
    setSearch(""); setCity("All Cities"); setNiches([]);
    setMinPrice(""); setMaxPrice(""); setSortBy("rec");
  };

  const hasActiveFilters = search || city !== "All Cities" || niches.length > 0 || minPrice || maxPrice;

  // No creators yet. Filters and a sort menu over an empty grid look broken,
  // so the section says plainly that the catalogue is opening and invites the
  // people who would fill it. The machinery above stays put for when it does.
  if (ALL_CREATORS.length === 0) {
    return (
      <section
        id="creator-catalog"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="border-2 border-black bg-white px-6 py-12 text-center sm:px-12 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
            <span className="h-2 w-2 rounded-full bg-[#ff5722]" aria-hidden="true" />
            {t("cat_badge")}
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black leading-[1.05] tracking-tight text-black sm:text-4xl lg:text-5xl">
            {t("cat_soon_title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
            {t("cat_soon_sub")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/get-started"
              className="inline-flex min-h-[44px] items-center bg-[#ff5722] px-7 py-3 text-sm font-black text-white transition-colors hover:bg-orange-600"
            >
              {t("cat_soon_join")}
            </Link>
            <Link
              to="/services/ugc"
              className="inline-flex min-h-[44px] items-center border-2 border-black px-7 py-3 text-sm font-black text-black transition-colors hover:bg-black hover:text-white"
            >
              {t("cat_soon_services")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="creator-catalog" className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">

      {/* Ambient glow */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 end-0 -z-10 w-[800px] h-[800px] bg-[#ff5722]/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3"
      />

      {/* ── Header ── */}
      <motion.div
        className="mb-20 text-center lg:text-start"
      >
        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <span className="w-2 h-2 bg-[#ff5722] rounded-full"></span> {t("cat_catalog_badge")}
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-black">
          {t("cat_catalog_title1")} <br /> <span className="text-orange-600">{t("cat_catalog_title2")}</span>
        </h2>
        <p className="mt-8 text-gray-500 max-w-2xl font-medium text-lg">
          {t("cat_catalog_sub")}
        </p>

        {/* Search bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 max-w-xl">
          <div className="relative w-full group">
            <Search size={20} className="absolute start-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("cat_catalog_search_ph")}
              className="w-full bg-white border-2 border-gray-100 rounded-3xl py-5 ps-14 pe-4 font-bold text-black focus:ring-0 focus:border-[#ff5722] outline-none transition-all shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute end-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <XIcon size={16} />
              </button>
            )}
          </div>
          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={resetAll}
              className="shrink-0 bg-black text-white font-black px-8 py-5 rounded-3xl text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
            >
              {t("cat_catalog_reset")}
            </motion.button>
          )}
        </div>

        {/* Active filter chips */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {search         && <FilterChip label={`"${search}"`}   onRemove={() => setSearch("")} />}
              {city !== "All Cities" && <FilterChip label={city}     onRemove={() => setCity("All Cities")} />}
              {niches.map(n  => <FilterChip key={n} label={n}        onRemove={() => toggleNiche(n)} />)}
              {minPrice       && <FilterChip label={`Min ${minPrice} MAD`} onRemove={() => setMinPrice("")} />}
              {maxPrice       && <FilterChip label={`Max ${maxPrice} MAD`} onRemove={() => setMaxPrice("")} />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">

        {/* ── Sidebar ── */}
        <motion.aside
          className="catalog-sidebar sticky top-32 h-fit"
        >
          <div className="text-[11px] uppercase font-black text-black tracking-[0.2em] mb-10 flex items-center gap-2">
            <div className="w-4 h-0.5 bg-black"></div> {t("cat_filter_title")}
          </div>

          {/* City */}
          <div className="mb-12">
            <div className="flex items-center gap-2 uppercase tracking-wider font-extrabold text-[12px] text-black mb-6">
              <MapPin size={16} fill="#ff5722" strokeWidth={0} /> {t("cat_filter_location")}
            </div>
            <div className="max-h-56 overflow-y-auto pe-2 space-y-3 custom-scrollbar">
              {CITIES.map(c => (
                <label key={c} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setCity(c)}
                    className={`w-5 h-5 rounded-full border-2 transition-all duration-200 shrink-0 cursor-pointer ${
                      city === c
                        ? "border-black bg-[#ff5722]"
                        : "border-gray-200 group-hover:border-gray-400"
                    }`}
                  />
                  <span
                    onClick={() => setCity(c)}
                    className={`text-sm font-bold transition-colors cursor-pointer ${city === c ? "text-black" : "text-gray-400 group-hover:text-black"}`}
                  >
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Niche */}
          <div className="mb-12">
            <div className="flex items-center gap-2 uppercase tracking-wider font-extrabold text-[12px] text-black mb-6">
              <Tag size={16} /> {t("cat_filter_niche")}
            </div>
            <div className="max-h-64 overflow-y-auto pe-2 space-y-3 custom-scrollbar">
              {NICHES.map(n => {
                const active = n.startsWith("All") ? niches.length === 0 : niches.includes(n);
                return (
                  <label key={n} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => toggleNiche(n)}
                      className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 shrink-0 cursor-pointer flex items-center justify-center ${
                        active
                          ? "border-black bg-black"
                          : "border-gray-200 group-hover:border-gray-400"
                      }`}
                    >
                      {active && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                    </div>
                    <span
                      onClick={() => toggleNiche(n)}
                      className={`text-sm font-bold transition-colors cursor-pointer ${active ? "text-black" : "text-gray-400 group-hover:text-black"}`}
                    >
                      {n}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="uppercase tracking-wider font-extrabold text-[12px] text-black mb-6">{t("cat_filter_price")}</div>
            <div className="flex flex-col gap-3">
              <input
                type="number"
                placeholder={t("cat_filter_min_ph")}
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="w-full bg-white border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-black outline-none focus:border-[#ff5722] shadow-sm transition-all"
              />
              <input
                type="number"
                placeholder={t("cat_filter_max_ph")}
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="w-full bg-white border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-black outline-none focus:border-[#ff5722] shadow-sm transition-all"
              />
            </div>
          </div>
        </motion.aside>

        {/* ── Results ── */}
        <main>
          {/* Results header */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50 sticky top-32 bg-white z-20">
            <div className="text-xs font-black uppercase tracking-widest text-gray-400">
              <span className="text-black text-lg me-1 font-black">{filtered.length}</span> {t("cat_creators")}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">{t("cat_sort_by")}</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl text-[11px] font-black text-black cursor-pointer outline-none hover:bg-gray-100 transition-colors pe-10"
                >
                  {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0
                ? <EmptyState onReset={resetAll} />
                : filtered.map((creator, index) => (
                    <CreatorCard
                      key={creator.id}
                      creator={{ ...creator, liked: liked.has(creator.id) }}
                      index={index}
                      onLike={() => toggleLike(creator.id)}
                    />
                  ))
              }
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </section>
  );
}
